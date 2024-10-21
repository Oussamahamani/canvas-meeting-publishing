require('dotenv').config()
const puppeteer = require('puppeteer')
const fs = require('fs');


let main = async()=>{
  // console.log('yay',req.body)

  canvasLink = "https://perscholas.instructure.com/courses/2284/external_tools/6407"
  let browser

    browser = await puppeteer.launch({ 
      headless: true,//responsible for opening tab// making false for the browser to show up
      ignoreDefaultArgs: ['--disable-extensions'] ,
      args:['--no-sandbox', '--disable-setuid-sandbox']
    });
  try{
   

  


  let page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  });


  await page.setDefaultNavigationTimeout(0); // Set the timeout to 0 to disable it
  let cookies = [];


  if (fs.existsSync('canvas.json')) {
  cookies = JSON.parse(fs.readFileSync('canvas.json', 'utf-8'));
  }
  await page.setCookie(...cookies);

   

  await page.goto(canvasLink,{ timeout: 0,slowMo: 500 });

     let url = await page.url(); 
    console.log("🚀 ~ file: index.js:154 ~ app.get ~ url:", url)


    if(url === "https://perscholas.instructure.com/login/canvas"){
      await page.type('#pseudonym_session_unique_id', process.env.canvas_id);
      await page.type('#pseudonym_session_password', process.env.canvas_password);
      const rememberButton = await page.waitForSelector('#pseudonym_session_remember_me');
      await rememberButton.evaluate(b => b.click()); 

      const Login = await page.waitForSelector('.Button--login');
    await Login.evaluate(b => b.click()); 


    
  }
await new Promise(resolve => setTimeout(resolve, 1000));
if(url === "https://perscholas.instructure.com/login/canvas"){
  cookies = await page.cookies();
  fs.writeFileSync('canvas.json', JSON.stringify(cookies));
}
const newPage = await browser.newPage();
await newPage.goto('https://perscholas.instructure.com/courses/2284/external_tools/6407', { timeout: 0, slowMo: 500 });
page = newPage
console.log('New tab opened with URL:', await newPage.url());
const elementHandle = await page.waitForSelector('.tool_launch');
const frame = await elementHandle.contentFrame();

const openRecordings = await frame.waitForSelector('div[role="tab"]:nth-of-type(4)');
await openRecordings.evaluate(b => b.click()); 
console.log('cloud meeting click')
    await frame.waitForSelector('td button');
    await new Promise(resolve => setTimeout(resolve, 500));

    await frame.evaluate(() => {
      let meetings = Array.from(document.querySelectorAll('td button'))
      console.log(meetings,'meetings')
      let lastMeeting = meetings[2]
      console.log(lastMeeting.checked)
      if(!lastMeeting.checked){
        // lastMeeting.evaluate(b => b.click())
        lastMeeting.click()
      }

    });
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('done, published meeting')
    // res.status(200).json({status:'success'})
}catch(err){
  
  console.log(err,'main eror')

// res.status(400).json({err:err.message})


}finally{
  console.log("closing browser")
  await browser.close();
}
}


main()








