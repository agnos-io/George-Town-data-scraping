const puppeteer = require("puppeteer");
const Recorder = require("./georgetown_recorder");
const login = require("./login.js");
const fillFormInDirectoryPage = require("./fillFormInDirectoryPageNew");
const createDirectoryForOccupation =require('./createDirecory');
const logger = new Recorder("logger", "logs");
let profileUrlRecorder;

const state = 'VA'
const occupation = [
    "620000",
    "lhh",
    "hmhe",
    "lhiv",
    "720000",
    "hmim",
    "hdim",
    "hmid"
]
const occupationMap={
    "620000":'HealthCare'
    // "lhh":'HealthLaw',
    // "hmhe":'Hematology',
    // "lhiv":'HIV_AIDS Law',
    // "720000":'Hospitality',
    // "hmim":'Immunology',
    // "hdim":'Implantology',
    // "hmid":'Infectious Diseases'
}
const statesMap={
    "TX" : 'TX',
    // "us":'US'
    // us
    // 'AE':'AE',
    // 'AK':'AK',
    // 'AL':'AL',
    // 'AP':'AP',
    // 'AR':'AR',
    // 'AS':'AS',
    // 'AZ':'AZ',
    // 'BC':'BC',
    // 'CA':'CA',
    // 'CO':'CO',
    // 'CT':'CT',
    // 'DC':'DC',
    // 'DE':'DE',
    // 'FL':'FL',
    // 'HI':'HI',
    // 'IA':'IA',
    // 'ID':'ID',
    // 'IL':'IL',
    // 'IN':'IN',
    // 'KS':'KS',
    // 'LA':'LA',
    // 'LB':'LB',
    // 'MA':'MA',
    // 'MB':'MB',
    // 'MD':'MD',
    // 'ME':'ME',
    // 'MI':'MI',
    // 'MN':'MN',
    // 'MP':'MP',
    // 'MS':'MS',
    // 'ca':'ca',
    // 'MT':'MT',
    // 'NB':'NB',
    // 'NC':'NC',
    // 'ND':'ND',
    // 'NE':'NE',
    // 'NJ':'NJ',
    // 'NM':'NM',
    // 'NS':'NS',
    // 'NV':'NV',
    // 'NY':'NY',
    // 'OH':'OH',
    // 'OK':'OK',
    // 'ON':'ON',
    // 'OR':'OR',
    // 'PA':'PA',
    // 'cy':'cy',
    // 'QC':'QC',
    // 'RI':'RI',
    // 'SC':'SC',
    // 'SD':'SD',
    // 'SK':'SK',
    // 'TN':'TN',
    // 'UT':'UT',
    // 'VA':'VA',
    // 'VI':'VI',
    // 'VT':'VT',
    // 'WA':'WA',
    'WI' : 'WI', 
 'WV' : 'WV' ,
 'gm' : 'gm' ,
 'gy' : 'gy' ,
 'ha' : 'ha' ,
 'ho' : 'ho' ,
 'mx' : 'mx' ,
 'nu' : 'nu' ,
 'pn' : 'pn' ,
 'ns' : 'ns' ,
 've' : 've', 
}
async function readCountFromPage(page) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('count cal')
            try {
                await page.waitForXPath(
                    "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[5]/p/span",
                    { timeout: 10000 }
                );
            } catch {
                resolve(0);
            }
            let [element] = await page.$x(
                "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[5]/p/span"
            );
            console.log('status count')
            let countStatus = await page.evaluate(
                (element) => element.textContent,
                element
            );
            console.log(countStatus)
            let count = countStatus.split(" ")[3];
            resolve(count);
        } catch {
            (err) => {
                console.log('came to error');
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
                console.log('coming here')
                await page.waitFor(7000);
                // await page.waitForXPath(
                //   "/html/body/form/div[3]/div/div[2]/div/div[2]/section/div[2]/div[10]/div/table/tbody/tr[1]/td[1]"
                // );
                const element = await page.$(".rgCurrentPage");
                // console.log(element)
                // console.log(document.getElementsByTagName("tbody"));
                let  addresses, nextPage ;
                if(element){
                 [ addresses, nextPage ] = await page.evaluate((element) => {
                    console.log('coming inside')
                    console.log(document.getElementsByTagName("tbody"));
                    var rows = document.getElementsByTagName("tbody")[5].children;
                    console.log(rows);
                    var addresses = [];
                    for (var i = 0; i < rows.length; i++) {
                        addresses.push(rows[i].children[1].firstChild.href);
                        console.log(addresses)
                    }
                    if (element.nextElementSibling) {
                        element.nextElementSibling.click();
                    }
                    return [ addresses, !!element.nextElementSibling ];
                }, element);
                    proceed = nextPage;
                    console.log(proceed)
                }else{
                    console.log('in if else')
                    try{
                        
                     addresses  = await page.evaluate(() => {
                        console.log('coming inside')
                        console.log(document.getElementsByTagName("tbody"));
                        var rows = document.getElementsByTagName("tbody")[4].children;
                        console.log(rows);
                        var addresses = [];
                        for (var i = 0; i < rows.length; i++) {
                            
                            addresses.push(rows[i].children[1].querySelector('a').href);
                            console.log(addresses)
                        }
                        // if (element.nextElementSibling) {
                        //     element.nextElementSibling.click();
                        // }
                        return  addresses ;
                    });
                    }catch(err){
                        console.log(err);
                    }
                    
                    
                    
                }

                console.log('completed evaluate');
                console.log(addresses)
                profileUrlRecorder.record(addresses.map((ele) => ({ address: ele })));
                // await fetchDataSync(addresses, browser);
                await page.waitFor(10000);
            } catch {
                (err) => {
                    console.log('came error')
                    console.log(err)
                    
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
                    "https://georgetown.imodules.com/s/1686/alumni/index.aspx?sid=1686&gid=7&pgid=6&cid=41&_ga=2.174287978.914790330.1597784911-286610759.1594338404"
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
async function getProfileUrl(occuaptions,states){
    const browser = await puppeteer.launch({ headless: false });
    
    await login(browser);

    const directory_page = await browser.newPage();
    
    // for(var occupation of Object.keys(occupationMap)){
    //     console.log(Object.keys(occupationMap))
    //     console.log(occupation)
    //     console.log(occupationMap[occupation])
        createDirectoryForOccupation(occupations)
    //     for(var states of Object.keys(statesMap)){
            console.log(states)
            profileUrlRecorder = new Recorder("profileUrl", `${states}_ProfileUrlAddresses`,occupations);
            
            try {
                await directory_page.goto(
                    "https://georgetown.imodules.com/s/1686/alumni/index.aspx?sid=1686&gid=7&pgid=6&cid=41&_ga=2.174287978.914790330.1597784911-286610759.1594338404"
                );
                await fillFormInDirectoryPage(directory_page,occupations, states, null);
                let count = await readCountFromPage(directory_page);
                console.log(count)
                if (+count < 1000 && +count > 0){
                    console.log('less than 1000');
                    await fetchAllUrlList(directory_page, browser);
                }else if(+count === 1000) {
                    await fetchRecordsRecursively(directory_page, state, "");
                }
                // browser.close();
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
    //     }
    // }
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    
    await login(browser);

    const directory_page = await browser.newPage();
    
    for(var occupation of Object.keys(occupationMap)){
        console.log(Object.keys(occupationMap))
        console.log(occupation)
        console.log(occupationMap[occupation])
        
        for(var states of Object.keys(statesMap)){
            createDirectoryForOccupation(`${occupationMap[occupation]}/${states}`)
            console.log(states)
            profileUrlRecorder = new Recorder("profileUrl", `${states}_ProfileUrlAddresses`,occupationMap[occupation],states);
            
            try {
                await directory_page.goto(
                    "https://georgetown.imodules.com/s/1686/alumni/index.aspx?sid=1686&gid=7&pgid=6&cid=41&_ga=2.174287978.914790330.1597784911-286610759.1594338404"
                );
                await fillFormInDirectoryPage(directory_page,occupation ,states, null);
                let count = await readCountFromPage(directory_page);
                console.log(count)
                if (+count < 1000 && +count > 0){
                    console.log('less than 1000');
                    await fetchAllUrlList(directory_page, browser);
                }else if(+count === 1000) {
                    await fetchRecordsRecursively(directory_page, state, "");
                }
                // browser.close();
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