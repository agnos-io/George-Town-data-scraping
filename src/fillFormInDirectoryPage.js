async function fillFormInDirectoryPage(
    directory_page,
    state,
    lastNameInitialLetter
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('fill form directory');
        // await directory_page.select("#cid_41_SearchGUI_sc971_mf_971", "620000");
        // cid_41_SearchGUI_sc731_mf_731
        await directory_page.select("#cid_41_SearchGUI_sc731_mf_731", 'us');
        await directory_page.select("#cid_41_SearchGUI_sc729_mf_729", state);
        console.log('select comlplmeted')
        if (lastNameInitialLetter) {
          console.log('lastNameinitialletter',lastNameInitialLetter);
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
          console.log(err);
          reject(err);
        };
      }
    });
  }


module.exports = fillFormInDirectoryPage;