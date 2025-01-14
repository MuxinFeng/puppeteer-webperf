const puppeteer = require('puppeteer');
const phone = puppeteer.devices['Moto G4']; // 最新版的lighthouse是用该机型测试，我认为该机型具有代表性

/**
 * Measure LCP
 */
function calculateLCP() {
  window.largestContentfulPaint = 0;

  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    window.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
  });

  observer.observe({ type: 'largest-contentful-paint', buffered: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      observer.takeRecords();
      observer.disconnect();
      console.log('LCP:', window.largestContentfulPaint);
    }
  });
}

/**
 * Get LCP for a provided URL
 * @param {*} url
 * @return {Number} lcp
 */
async function getLCP(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    timeout: 10000,
  });

  try {
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    await client.send('Network.enable');
    await client.send('ServiceWorker.enable');
    await page.emulateNetworkConditions(puppeteer.networkConditions['Good 3G']);
    await page.emulateCPUThrottling(4);
    await page.emulate(phone);

    await page.evaluateOnNewDocument(calculateLCP);
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    const lcp = await page.evaluate(() => {
      return window.largestContentfulPaint;
    });
    browser.close();
    return lcp;
  } catch (error) {
    console.log(error);
    browser.close();
  }
}

getLCP('http://localhost:1024/kylin_h5/sass/home').then((lcp) =>
  console.log('LCP is: ' + lcp)
);
