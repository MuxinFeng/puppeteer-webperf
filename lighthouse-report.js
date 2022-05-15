const fs = require('fs');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

const chromeLauncher = require('chrome-launcher');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const request = require('request');
const util = require('util');

const options = {
  logLevel: 'info',
  disableDeviceEmulation: true,
  chromeFlags: ['--disable-mobile-emulation'],
};

/**
 *
 * Perform a Lighthouse run
 * @param {any} urls - url The URL to test
 * @param {Object} options - Optional settings for the Lighthouse run
 * @param {Object} [config=null] - Configuration for the Lighthouse run. If
 * not present, the default config is used.
 */
async function lighthouseFromPuppeteer(urls, options, config = null) {
  // Launch chrome using chrome-launcher
  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;

  // Connect chrome-launcher to puppeteer
  const resp = await util.promisify(request)(
    `http://localhost:${options.port}/json/version`
  );
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  // Run Lighthouse
  const { lhr } = await lighthouse(urls[0], options, config);
  await browser.disconnect();
  await chrome.kill();

  // const html = reportGenerator.generateReport(lhr, 'html');
  const json = reportGenerator.generateReport(lhr, 'json');
  // fs.writeFile('report.html', html, function(err) {
  //   if (err) throw err;
  // });
  fs.writeFile('report1.json', json, function (err) {
    if (err) throw err;
  });
}

lighthouseFromPuppeteer(
  ['http://qilin.zaihuiba.com/tiktok/public-resource'],
  options
);
