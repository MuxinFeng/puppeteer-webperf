const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

const chromeLauncher = require('chrome-launcher');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const request = require('request');
const util = require('util');

const options = {
  locale: 'zh-CH',
  // logLevel: 'info',
  // disableDeviceEmulation: true,
  // chromeFlags: ["--disable-mobile-emulation", "--headless"],
  // args: ['--disable-signin-frame-client-certs','{''token'':''eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ''}'],
};

/**
 *
 * Perform a Lighthouse run
 * @param {String} url - url The URL to test
 * @param {Object} options - Optional settings for the Lighthouse run
 * @param {Object} [config=null] - Configuration for the Lighthouse run. If
 * not present, the default config is used.
 */
async function lighthouseFromPuppeteer(url, options, config) {
  // Launch chrome using chrome-launcher
  const chrome = await chromeLauncher.launch(options);

  options.port = chrome.port;
  console.log(options);
  // Connect chrome-launcher to puppeteer
  const resp = await util.promisify(request)(
    `http://localhost:${options.port}/json/version`
  );
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });
  const page = await browser.newPage();
  await page.setCookie({
    name: 'kyer',
    value:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
    url: 'http://localhost:1024/kylin_h5/saas/sign_entry/list',
  });
  // await page.goto('http://localhost:1024/kylin_h5/saas/sign_entry/list');
  // page.setExtraHTTPHeaders({
  //   Token:
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
  // });
  // browser.setExtraHTTPHeaders({
  //   Token:
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
  // });
  // const page = await browser.newPage();
  // page.setExtraHTTPHeaders({
  //   Token:
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
  // });
  // await page.setCookie({
  //   name: 'kyer',
  //   value:
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
  //   url: 'http://localhost:1024/kylin_h5/saas/sign_entry/list',
  // });

  // Run Lighthouse
  const { lhr } = await lighthouse(
    url,
    {
      ...options,
      // extraHeaders: {
      //   // Authorization:
      //   //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
      //   // Token:
      //   //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ',
      //   authorization:
      //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8',
      // },
    },
    config
  );

  await browser.disconnect();
  await chrome.kill();

  const json = reportGenerator.generateReport(lhr, 'json');

  const audits = JSON.parse(json).audits; // Lighthouse audits
  const performance = JSON.parse(json).categories['performance'].score; // Lighthouse audits
  const firstContentfulPaint = audits['first-contentful-paint'].displayValue;
  const totalBlockingTime = audits['total-blocking-time'].displayValue;
  const timeToInteractive = audits['interactive'].displayValue;

  console.log(`\n
     Lighthouse metrics: 
     🎨 Performance Score: ${performance}, 
     🎨 First Contentful Paint: ${firstContentfulPaint}, 
     ⌛️ Total Blocking Time: ${totalBlockingTime},
     👆 Time To Interactive: ${timeToInteractive}`);
  // console.log(audits);
}

lighthouseFromPuppeteer(
  'http://localhost:1024/kylin_h5/saas/sign_entry/list',
  options
);
