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
          await login_page.waitFor(45000);
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

module.exports = login;