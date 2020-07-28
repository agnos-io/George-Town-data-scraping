const puppeteer = require("puppeteer");

const path = require("path");
const { count } = require("console");
const output_file_path = path.join(__dirname, "count2.csv");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: output_file_path,
  header: [
    { id: "state", title: "STATE" },
    { id: "lastNameInitialLetter", title: "LAST NAME INITIAL LETTER" },
    { id: "count", title: "COUNT" },
    { id: "valid", title: "VALID" },
  ],
});

const record_data_to_CSV = (state, lastNameInitialLetter, count) => {
  const valid = count === "error" ? "unknown" : +count < 1000;
  data = { state, lastNameInitialLetter, count, valid };
  csvWriter
    .writeRecords([data])
    .then(() => {
      console.log("Data Recorded: ", data);
    })
    .catch((err) => console.log(err));
};

const states = [
  // "AL",
  // "AK",
  // "AB",
  // "AS",
  // "AZ",
  // "AR",
  // "AP",
  // "AA",
  // "AL",
  // "BC",
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
      console.log("inside readcount");
      try {
        console.log("before wait for xpath");
        await page.waitForXPath(
          "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[3]/p/span",
          { timeout: 10000 }
        );
        console.log("after wait for xpath");
      } catch {
        (err) => console.log("my error", err);
        resolve(0);
      }
      console.log("before page.$x");
      let [element] = await page.$x(
        "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[3]/p/span"
      );
      console.log("after page.$x");
      console.log("before page.evaluate");
      let countStatus = await page.evaluate(
        (element) => element.textContent,
        element
      );
      console.log("after page.evaluate");
      let count = countStatus.split(" ")[3];
      resolve(count);
    } catch {
      (err) => {
        console.log("my error", err);
        reject(err);
      };
    }
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
      resolve();
    } catch {
      (err) => {
        reject(err);
      };
    }
  });
}

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
        await login_page.waitForNavigation();
        resolve();
      } catch {
        (err) => {
          reject(err);
        };
      }
    })();
  });
}

async function fetchRecordsRecursively(
  page,
  state,
  lastNameInitialLetterPrefix
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
        console.log("before calling fillform");
        await fillFormInDirectoryPage(page, state, lastNameInitialLetter);
        console.log("after calling fillform");
        console.log("before calling readcount");
        let count = await readCountFromPage(page);
        console.log("after calling readcount");

        console.log(state, lastNameInitialLetter, count);
        if (+count === 1000)
          await fetchRecordsRecursively(page, state, lastNameInitialLetter);
        else record_data_to_CSV(state, lastNameInitialLetter, count);
      } catch {
        (err) => {
          console.log(`Error for ${state} at ${lastNameInitialLetter}: `, err);
          record_data_to_CSV(state, lastNameInitialLetter, "error");
          reject(err);
        };
      }
    }
    resolve();
  });
}

async function countRecords() {
  const browser = await puppeteer.launch({ headless: false });
  await login(browser);

  const directory_page = await browser.newPage();

  for (var state of states) {
    try {
      await directory_page.goto(
        "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
      );
      await fillFormInDirectoryPage(directory_page, state, null);
      let count = await readCountFromPage(directory_page);
      if (+count < 1000) record_data_to_CSV(state, "ALL", count);
      else {
        await fetchRecordsRecursively(directory_page, state, "");
      }
    } catch {
      (err) => {
        console.log(`Error for ${state}: `, err);
        record_data_to_CSV(state, "all", "error");
      };
    }
  }
}

countRecords();
