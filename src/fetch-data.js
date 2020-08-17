const puppeteer = require("puppeteer");
const Recorder = require("./recorder.js");
const login = require("./login.js");
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const path = require("path");
const file_name = 'ALProfileUrlAddresses';

let dataRecorder;
const logger = new Recorder("logger", "logs");

async function fetchData(address, browser) {
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
            await page.close();
            resolve();
        } catch (err) {
            console.log(err);
            logger.record({
                log_type: "Error",
                message: "Error while reading data from " + address,
                log: err,
            });
            resolve();
            page.close();
        }
    });
}

(async () => {
    const addresses = []
    dataRecorder = new Recorder("data", `AL_data`);
    const browser = await puppeteer.launch({ headless: false });
    await login(browser);
    let inputStream = Fs.createReadStream(path.join(__dirname, `../output/${file_name}.csv`), 'utf8');
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            addresses.push(row[0])
        })
        .on('end', function (data) {
            (async () => {
                console.log('Data Fetching Started');
                for (var i = 0; i < addresses.length; i++) {
                    await fetchData(addresses[i], browser);
                }
            })();
        });
})()