const puppeteer = require("puppeteer");
const Recorder = require('./recorder.js');

const dataRecorder = new Recorder("data", "all");
const logger = new Recorder('logger',logs)

// const path = require("path");
// const output_file_path = path.join(__dirname, "testfinal.csv");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// const csvWriter = createCsvWriter({
//   path: output_file_path,
//   header: [
//     { id: "Title", title: "Title" },
//     { id: "First Name", title: "First Name" },
//     { id: "Middle Name", title: "Middle Name" },
//     { id: "Last Name", title: "Last Name" },
//     { id: "Email", title: "Email" },
//     { id: "Other Email", title: "Other Email" },
//     { id: "Street Address", title: "Street Address" },
//     { id: "City", title: "City" },
//     { id: "State/Region", title: "State/Region" },
//     { id: "Country", title: "Country" },
//     { id: "Postal Code", title: "Postal Code" },
//     { id: "Mobile Phone Number", title: "Mobile Phone Number" },
//     { id: "Phone Number", title: "Phone Number" },
//     { id: "WebsiteAddress1", title: "WebsiteAddress1" },
//     { id: "Professional Summary", title: "Professional Summary" },
//     { id: "Skills", title: "Skills" },
//     { id: "Past Experience Position 1", title: "Past Experience Position 1" },
//     { id: "Past Experience Company 1", title: "Past Experience Company 1" },
//     { id: "Past Experience Position 2", title: "Past Experience Position 2" },
//     { id: "Past Experience Company 2", title: "Past Experience Company 2" },
//     { id: "School", title: "School" },
//     { id: "Graduation Date", title: "Graduation Date" },
//     { id: "Major", title: "Major" },
//     { id: "Degree", title: "Degree" },
//     { id: "Other Education 1", title: "Other Education 1" },
//     {
//       id: "Graduation for Other Education 1",
//       title: "Graduation for Other Education 1",
//     },
//     { id: "Other Education 2", title: "Other Education 2" },
//     { id: "Job Title", title: "Job Title" },
//     { id: "Company name", title: "Company name" },
//     { id: "work Email", title: "work Email" },
//     { id: "Work Phone", title: "Work Phone" },
//     { id: "all data", title: "ALL Data" },
//   ],
// });

// const record_data_to_CSV = (data) => {
//   csvWriter
//     .writeRecords([data]) // returns a promise
//     .then(() => {
//       console.log("Data Recorded");
//     })
//     .catch((err) => console.log(err));
// };

async function login(browser) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const login_page = await browser.newPage();
        await login_page.goto(
          "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
        );
        await login_page.waitForNavigation();

        await login_page.type("#username", "ssl8");
        await login_page.type("#password", "$AgnoS3234");
        await login_page.click(".form-button");
        await login_page.waitFor(30000);
        // await login_page.waitForNavigation();
        resolve();
      } catch {
        (err) => {
          reject(err);
        };
      }
    })();
  });
}

async function fillFormInDirectoryPage(
  directory_page,
  state,
  lastNameInitialLetter
) {
  return new Promise(async (resolve, reject) => {
    try {
      await directory_page.select("#cid_41_SearchGUI_sc731_mf_731", "us");
      await directory_page.select("#cid_41_SearchGUI_sc729_mf_729", state);
      if (lastNameInitialLetter) {
        await directory_page.select(
          "#cid_41_SearchGUI_sc528_ddComparison_528",
          "StartsWith"
        );
        await directory_page.type(
          "#cid_41_SearchGUI_sc528_mf_528",
          lastNameInitialLetter
        );
      }
      await directory_page.select("#cid_41_SearchGUI_sc34_mf_34", "0");
      await directory_page.click("#cid_41_btnContinue");
      //   await directory_page.waitForNavigation();
      resolve();
    } catch {
      (err) => {
        reject(err);
      };
    }
  });
}

async function fetchAllUrlList(page, browser) {
  return new Promise(async (resolve, reject) => {
    let proceed;
    do {
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
      console.log(addresses);
      console.log(nextPage);
      proceed = nextPage;
      // await page.waitForRequest('https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6&SearchType=SIMPLE');
      // await page.waitFor(1000);
      await fetchDataSync(addresses, browser);
    } while (proceed);

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
        // Member of Board of Governors:False
        // Alumni Admissions Program (AAP) Interviewer:False
        // Class Ambassador:False
        // Regional Club Leader:
      });
      // console.log(JSON.stringify(info));
      // contact_information.push(JSON.stringify(info));
      // record_data_to_CSV(info);
      dataRecorder.record(info);
      resolve();
    } catch (err) {
      console.log(err);
      reject();
    }finally{
      page.close();
    }
  });
}

async function fetchDataSync(addresses, browser) {
  return new Promise(async (resolve, reject) => {
    try {
      var l = 0;
      while (l < addresses.length) {
        const dataPromises = [];
        for (var i = 0; i < 5 && l < addresses.length; i++) {
          dataPromises.push(fetchDataAsync(addresses[l], browser));
          l++;
        }
        try {
          await Promise.all(dataPromises);
        } catch {
          (err) => {};
        }
      }
      resolve();
    } catch {
      (err) => {
        console.log(err);
      };
    }
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  await login(browser);
  const directory_page = await browser.newPage();
  await directory_page.goto(
    "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
  );
  await fillFormInDirectoryPage(directory_page, "AL", null);
  await fetchAllUrlList(directory_page, browser);
})();
