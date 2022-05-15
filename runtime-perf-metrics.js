const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com/');

  const metrics = await page.metrics();
  console.info(metrics);

  await browser.close();
})();
