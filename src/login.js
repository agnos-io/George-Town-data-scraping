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
          console.log('cmoing to duo')
          await login_page.waitForNavigation();
          await login_page.waitFor(10000);
          await login_page.waitForSelector('iframe');
          const elementHandle = await login_page.$(
            'iframe',
          )
          let frame = await elementHandle.contentFrame();
          await frame.evaluate(() => {
            document.getElementsByName('device')[0].value='phone2';
            document.getElementsByClassName('auth-button positive')[0].click()
          })
          // try{
          //   // console.log('watingn for x path')
          //   // await login_page.waitForXPath(
          //   //   '/html/body/div/div/div[1]/div/form/div[1]/fieldset[1]/div[1]'
          //   // )
          //   // console.log('completed x path')
          //   await login_page.waitForNavigation()
          //   console.log('frame checking');
          // // const frameHandle  =await login_page.mainFrame();
          // // console.log(frameHandle);
          // // const frames= await frameHandle.contentFrame();
          // // console.log('getting frames')
          // // console.log(frames);
          
          // const elementHandle = await login_page.$(
          //   'iframe[id="duo_iframe"]',
          // );
          // console.log(elementHandle)
          // let element = await login_page.evaluate((ele)=>{
          //   console.log(ele)
          // },elementHandle)
          // // const frames1 = await login_page.frames();
          // // frames1.forEach((f)=>{
          // //   console.log(f.src)
          // // })
          // // console.log(elementHandle);
          // // const frames= await elementHandle.mainFrame();
          // // console.log(frames)
          // // console.log('page wiat for selector')
          // // // await login_page.waitForSelector('.row-label push-label')
          // // console.log('selector')
          // // let duo_login_url  = await login_page.evaluate(() => {
          // //   return document.getElementById('duo_iframe').src
          // //   // return "Completed DUO"
          // // });
          // // console.log(duo_login_url)
          // // await login_page.goto(duo_login_url)
          // // await login_page.waitForNavigation();
          // // await login_page.evaluate(() => {
          // //   document.getElementsByName('device')[0].value='phone2';
          // //   document.getElementsByClassName('auth-button positive')[0].click()

          // //   // return "Completed DUO"
          // // });
          // // console.log(addresses);
          // }catch(err){
          //   console.log(err);
          // }
          console.log('checked duo page');
          await login_page.waitFor(450000);
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