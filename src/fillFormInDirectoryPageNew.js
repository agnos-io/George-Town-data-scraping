async function fillFormInDirectoryPage(
    directory_page,
    occupation,
    state,
    lastNameInitialLetter
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('fill form directory');
        await directory_page.select("#cid_41_SearchGUI_sc971_mf_971", occupation);
        await directory_page.select("#cid_41_SearchGUI_sc973_mf_973", state);
        console.log('select comlplmeted')
        if (lastNameInitialLetter) {
          await directory_page.select(
            "#cid_41_SearchGUI_sc970_ddComparison_970",
            "StartsWith"
          );
          await directory_page.type(
            "#cid_41_SearchGUI_sc970_mf_970",
            lastNameInitialLetter
          );
        }
        // await directory_page.select("#cid_41_SearchGUI_sc34_mf_34", "0");
        await directory_page.click("#cid_41_btnContinue");
        resolve();
      } catch {
        (err) => {
          reject(err);
        };
      }
    });
  }


module.exports = fillFormInDirectoryPage;