const puppeteer = require('puppeteer');
const options = {
  // locale: 'zh-CH',
  // logLevel: 'info',
  // disableDeviceEmulation: true,
  chromeFlags: ['--headless'],
  viewport: isMobile,
};

(async () => {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  page.setExtraHTTPHeaders({
    Token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjU2NzQsImF1ZCI6InpiIiwiY2FzIjoibDNlZTdsZzltYnZ4eWhma3o1YWxlajRsOTNuNDBhNHEiLCJleHAiOjE2NTI0MTA0NTV9.UYk9fiCLfpAx7sv0mAJrY7Goh6jcBOdQZdIWDBc_7To',
  });
  await page.goto('http://localhost:1024/kylin_h5/sass/ocean/private_ocean');

  const load = JSON.parse(
    await page.evaluate(() =>
      // JSON.stringify(window.performance.getEntriesByType('paint')),
      JSON.stringify(window.performance.getEntries()[0].loadEventEnd)
    )
  );
  const firstPaint = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(window.performance.getEntriesByType('paint'))
    )
  );
  console.log('load', load);
  console.log('firstPaint', firstPaint);

  // const observer = new PerformanceObserver((list, observer) => {
  //   list.getEntries().forEach((e) => console.log('observer', e));
  // });
  // observer.observe({ entryTypes: ['mark', 'frame'] });
  await browser.close();
})();
