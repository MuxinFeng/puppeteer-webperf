const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Drag and drop this JSON file to the DevTools Performance panel!
  await page.tracing.start({ path: 'profile.json', screenshots: true });
  await page.goto('https://www.baidu.com/');
  await page.tracing.stop();
  await browser.close();
})();
