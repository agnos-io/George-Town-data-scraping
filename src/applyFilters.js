const fillFormInDirectoryPage = require('./fillFormInDirectoryPage.js');

async function applyFilters(
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
            await applyFilters(page, state, lastNameInitialLetter);
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

  module.exports = applyFilters;