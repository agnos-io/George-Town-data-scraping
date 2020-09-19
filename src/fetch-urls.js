const puppeteer = require("puppeteer");
const Recorder = require("./recorder.js");
const login = require("./login.js");``
const fillFormInDirectoryPage = require("./fillFormInDirectoryPage");

const logger = new Recorder("logger", "logs");
let profileUrlRecorder;
//Alabama,Alaska,Alberta,American Samao,<Arizona>,Arkansas,Armed Services California,Armed Services Florida,Armed Services New York,British Columbia,<California>,Canal Zone,<Colorado>,
const state = 'CA'
const statelist=['CA','WA']
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
            console.log(countStatus.split(" ")[3])
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
                await page.waitFor(7000);
                // await page.waitForXPath(
                //   "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[8]/div/table/tbody/tr[1]/td[6]"
                // );
                const element = await page.$(".rgCurrentPage");

                let { addresses, nextPage } = await page.evaluate((element) => {
                    var rows = document.getElementsByTagName("tbody")[5].children;
                    var addresses = [];
                    console.log('in browser')
                    console.log(rows);
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
                // await fetchDataSync(addresses, browser);
                // await page.waitFor(2000);
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
    console.log(lastNameInitialLetterPrefix);
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

(async () => {
    for(var state of statelist){
    console.log(state);
    profileUrlRecorder = new Recorder("profileUrl", `${state}_ProfileUrlAddresses`);
    const browser = await puppeteer.launch({ headless: false });
    await login(browser);
    console.log('completed login')
    const directory_page = await browser.newPage();
    
    try {
        await directory_page.goto(
            "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
        );
        await fillFormInDirectoryPage(directory_page, state, null);
        let count = await readCountFromPage(directory_page);
        if (+count < 1000 && +count > 0)
            await fetchAllUrlList(directory_page, browser);
        else if(+count === 1000) {
            console.log('fetching record recursively')
            await fetchRecordsRecursively(directory_page, state, "");
        }
        browser.close();
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
    console.log('state completet')
    }
    // for (var state of states) {
    //   dataRecorder = new Recorder("data", `data_${state}`);
    //   try {
    //     await directory_page.goto(
    //       "https://alumni-resources.georgetown.edu/s/1686/alumni/index.aspx?sid=1686&gid=4&pgid=6"
    //     );
    //     await fillFormInDirectoryPage(directory_page, state, null);
    //     let count = await readCountFromPage(directory_page);
    //     if (+count < 1000 && +count > 0)
    //       await fetchAllUrlList(directory_page, browser);
    //     else {
    //       await fetchRecordsRecursively(directory_page, state, "");
    //     }
    //   } catch {
    //     (err) => {
    //       console.log(`Error for ${state}: `, err);
    //       logger.record({
    //         log_type: "Error",
    //         message: `Error for ${state}`,
    //         log: err,
    //       });
    //     };
    //   }
    // }
})();