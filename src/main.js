const puppeteer = require("puppeteer");
const Recorder = require("./recorder.js");
const login = require("./login.js");
const fillFormInDirectoryPage = require("./fillFormInDirectoryPage");

let dataRecorder;
const logger = new Recorder("logger", "logs");
const profileUrlRecorder = new Recorder("profileUrl", "profileUrlAddresses");

const states = [
  "AL",
  "AK",
  "AB",
  "AS",
  "AZ",
  "AR",
  "AP",
  "AA",
  "AL",
  "BC",
  "CA",
  "CZ",
  "CO",
  "CT",
  "DE",
  "DC",
  "FM",
  "FL",
  "GA",
  "GU",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LB",
  "LA",
  "ME",
  "MB",
  "MH",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NB",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NF",
  "NC",
  "ND",
  "MP",
  "NT",
  "NS",
  "OH",
  "OK",
  "ON",
  "OR",
  "TT",
  "PW",
  "PA",
  "PE",
  "PR",
  "QC",
  "RI",
  "SK",
  "SC",
  "SD",
  "TN",
  "TX",
  "VI",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "YT",
];

async function readCountFromPage(page) {
  return new Promise(async (resolve, reject) => {
    try {
      try {
        await page.waitForXPath(
          "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[3]/p/span",
          { timeout: 10000 }
        );
      } catch {
        resolve(0);
      }
      let [element] = await page.$x(
        "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[3]/p/span"
      );
      let countStatus = await page.evaluate(
        (element) => element.textContent,
        element
      );
      let count = countStatus.split(" ")[3];
      resolve(count);
    } catch {
      (err) => {
        console.log("Error while reading count: ", err);
        logger.record({
          log_type: "Error",
          message: "Error while counting",
          log: err,
        });
        resolve(0);
      };
    }
  });
}

async function fetchAllUrlList(page, browser) {
  return new Promise(async (resolve, reject) => {
    let proceed;
    do {
      try {
        await page.waitForXPath(
          "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[8]/div/table/tbody/tr[1]/td[6]"
        );
        const element = await page.$(".rgCurrentPage");

        let { addresses, nextPage } = await page.evaluate((element) => {
          var rows = document.getElementsByTagName("tbody")[5].children;
          var addresses = [];
          for (var i = 0; i < rows.length; i++) {
            addresses.push(rows[i].children[1].firstChild.href);
          }
          if (element.nextElementSibling) {
            element.nextElementSibling.click();
          }
          return { addresses, nextPage: !!element.nextElementSibling };
        }, element);
        proceed = nextPage;
        profileUrlRecorder.record(addresses.map((ele) => ({ address: ele })));
        await fetchDataSync(addresses, browser);
      } catch {
        (err) => {
          logger.record({
            log_type: "Error",
            message: "Error while reading url addresses",
            log: err,
          });
          console.log("Error while reading url addresses");
        };
      }
    } while (proceed);

    resolve();
  });
}

async function fetchRecordsRecursively(
  page,
  state,
  lastNameInitialLetterPrefix,
  browser
) {
  console.log("called for ", state, lastNameInitialLetterPrefix);
  return new Promise(async (resolve, reject) => {
    for (var l = 97; l < 123; l++) {
      try {
        var lastNameInitialLetter =
          lastNameInitialLetterPrefix + String.fromCharCode(l);
        await page.goto(
          "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
        );
        await fillFormInDirectoryPage(page, state, lastNameInitialLetter);
        let count = await readCountFromPage(page);

        if (+count === 1000)
          await fetchRecordsRecursively(page, state, lastNameInitialLetter);
        else if (+count !== 0) await fetchAllUrlList(page, browser);
      } catch {
        (err) => {
          console.log(`Error for ${state} at ${lastNameInitialLetter}: `, err);
          logger.record({
            log_type: "Error",
            message: `Error for ${state} at ${lastNameInitialLetter} while recursively applying filters`,
            log: err,
          });
          reject(err);
        };
      }
    }
    resolve();
  });
}

async function fetchDataAsync(address, browser) {
  return new Promise(async (resolve, reject) => {
    let info;
    const page = await browser.newPage();
    try {
      await page.goto(address);
      await page.waitForXPath(
        "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div/div/div[3]/div[2]/div/div[4]/div[2]/div/div/div[1]/div[2]"
      );
      info = await page.evaluate(() => {
        const data = {};
        const name = document.getElementsByClassName(
          "imod-profile-summary-member-name"
        )[0].innerText;
        data.name = name;
        const label_nodes = document.getElementsByClassName(
          "imod-profile-field-label"
        );
        const labels = [];
        for (var k = 0; k < label_nodes.length; k++) {
          labels.push(label_nodes[k].innerText);
        }
        const value_nodes = document.getElementsByClassName(
          "imod-profile-field-data"
        );
        const values = [];
        for (var k = 0; k < value_nodes.length; k++) {
          values.push(value_nodes[k].innerText);
        }

        for (var k = 0; k < labels.length; k++) {
          data[labels[k]] = values[k];
        }
        return {
          Title: data["Preferred Title:"] || "",
          "First Name": data["Preferred First Name:"] || "",
          "Middle Name": data["Preferred Middle Name:"] || "",
          "Last Name": data["Preferred Last Name:"] || "",
          Email: data["Personal/Home Email:"] || "",
          "Other Email": data["GU Email Address:"] || "",
          "Street Address": data["Home Address 1:"] || "",
          City: data["Home City:"] || "",
          "State/Region": data["Home State/Province:"] || "",
          Country: data["Home Country:"] || "",
          "Postal Code": data["Home Zip/Postal Code:"] || "",
          "Mobile Phone Number":
            data["Personal Cell/Mobile:"] || data["Work Cell/Mobile:"] || "",
          "Phone Number": data["Home Phone Number:"] || "",
          WebsiteAddress1:
            data["Employer Website"] || data["Personal Web Address:"] || "",
          "Professional Summary":
            (data["Professional Specialty 1:"]
              ? data["Professional Specialty 1:"] + ", "
              : "") +
            (data["Professional Specialty 2"]
              ? data["Professional Specialty 2:"] + ", "
              : "") +
            (data["Professional Specialty 3"]
              ? data["Professional Specialty 3:"]
              : ""),
          Skills:
            (data["Member of Board of Governors:"] !== "False"
              ? "Member of Board of Governors, "
              : "") +
            (data["Alumni Admissions Program (AAP) Interviewer:"] !== "False"
              ? "Alumni Admissions Program (AAP) Interviewer, "
              : "") +
            (data["Class Ambassador:"] !== "False"
              ? "Class Ambassador, "
              : "") +
            (data["Regional Club Leader:"] !== "False"
              ? "Regional Club Leader, "
              : ""),
          "Past Experience Position 1": data["Job Title:"] || "",
          "Past Experience Company 1": data["Past Employer 1 Name:"] || "",
          "Past Experience Position 2":
            data["Past Employment 2 Job Title:"] || "",
          "Past Experience Company 2": data["Past Employer 2 Name:"] || "",
          School: "George Town, " + data["Degree 1 School:"] || "",
          "Graduation Date": data["Degree 1 Class Year:"] || "",
          Major: data["Degree 1 Major 1:"] || "",
          Degree: data["Degree 1:"] || "",
          "Other Education 1": data["Other Degree 1 Institution:"] || "",
          "Graduation for Other Education 1":
            data["Other Degree 1 Year:"] || "",
          "Other Education 2": data["Other Degree 2 Institution:"] || "",
          "Job Title": data["Job Title:"] || "",
          "Company name": data["Employer Name:"] || "",
          "work Email": data["Work Email:"] || "",
          "Work Phone": data["Work Phone Number:"] || "",
          "all data": JSON.stringify(data),
        };
      });
      dataRecorder.record(info);
      await page.waitFor(30000);
      page.close();
      resolve();
    } catch (err) {
      console.log(err);
      logger.record({
        log_type: "Error",
        message: "Error while reading data from " + address,
        log: err,
      });
      page.close();
      resolve();
    }
  });
}

async function fetchDataSync(addresses, browser) {
  return new Promise(async (resolve, reject) => {
    // var l = 0;
    // while (l < addresses.length) {
    //   const dataPromises = [];
    //   for (var i = 0; i < 5 && l < addresses.length; i++) {
    //     dataPromises.push(fetchDataAsync(addresses[l], browser));
    //     l++;
    //   }
    //   await Promise.allSettled(dataPromises);
    // }
    for (address of addresses) {
      await fetchDataAsync(address, browser);
    }
    resolve();
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  await login(browser);

  const directory_page = await browser.newPage();

  for (var state of states) {
    dataRecorder = new Recorder("data", `data_${state}`);
    try {
      await directory_page.goto(
        "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
      );
      await fillFormInDirectoryPage(directory_page, state, null);
      let count = await readCountFromPage(directory_page);
      if (+count < 1000 && +count > 0)
        await fetchAllUrlList(directory_page, browser);
      else {
        await fetchRecordsRecursively(directory_page, state, "");
      }
    } catch {
      (err) => {
        console.log(`Error for ${state}: `, err);
        logger.record({
          log_type: "Error",
          message: `Error for ${state}`,
          log: err,
        });
      };
    }
  }
})();
