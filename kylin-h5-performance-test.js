const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const request = require('request');
const util = require('util');

const options = {
  // locale: 'zh-CH',
  // logLevel: 'info',
  // disableDeviceEmulation: true,
  // chromeFlags: ['--headless'],
  // args: ['--disable-signin-frame-client-certs','{''token'':''eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA4NTU5Mzl9.KqEn391iE6PyXtel6hFI7rU8oQp2BVVq69g9Nc2VBO8.eyJlaWQiOjIwMDYsImF1ZCI6InpiIiwiY2FzIjoiOTcxcWRlenppeG4yaXJ4MnRqanQxNG9meGI5cnR5YXIiLCJleHAiOjE2NTA2OTY1ODR9.LG9rmy2egMRNbsB512Gol47Dq38g-gomCDXje7lXbeQ''}'],
};

const config = null;

/**
 * Perform a Lighthouse run
 * @param {String} url - url The URL to test
 * @param {String} name - name of page to Test
 * @param {String} token - token in cookie
 * @param {Object} options - Optional settings for the Lighthouse run
 * @param {Object} [config=null] - Configuration for the Lighthouse run. If
 * not present, the default config is used.
 */
const lighthouseFromPuppeteer = async (url, name, token, options, config) => {
  // Launch chrome using chrome-launcher
  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;
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
    value: token,
    url: url,
  });

  const { lhr } = await lighthouse(url, options, config);

  await browser.disconnect();
  await chrome.kill();

  // 处理数据,保存为json和html报告
  const json = reportGenerator.generateReport(lhr, 'json');
  // fs.writeFile(`./kylin-h5/${name}.json`, json, (err) => {
  //   if (err) throw err;
  // });

  // const html = reportGenerator.generateReport(lhr, 'html');
  // fs.writeFile(`./kylin-h5/${name}.html`, html, (err) => {
  //   if (err) throw err;
  // });

  const audits = JSON.parse(json).audits;
  const performance = JSON.parse(json).categories['performance'].score;
  const firstContentfulPaint = audits['first-contentful-paint'].displayValue;
  const timeToInteractive = audits['interactive'].displayValue;
  const speedIndex = audits['speed-index'].displayValue;
  const totalBlockingTime = audits['total-blocking-time'].displayValue;
  const largestContentfulPaint =
    audits['largest-contentful-paint'].displayValue;
  const cumulativeLayoutShift = audits['cumulative-layout-shift'].displayValue;

  const metrics = JSON.parse(json).metrics;
  // const timing = metrics['details'].displayValue;

  console.log(`
  ${name}页面性能参数: 
  🏆 Performance Score: ${performance * 100}, 
  🎨 FCP: ${firstContentfulPaint}, 
  🎐 TTI: ${timeToInteractive}, 
  🎄 SpeedIndex: ${speedIndex}
  ⌛️ TBT: ${totalBlockingTime},
  🧩 LCP: ${largestContentfulPaint},
  ⚽ CLS: ${cumulativeLayoutShift},
     timing:${metrics}
  `);
};

const allPage = [
  // 主页-业务入口
  {
    name: 'SaaSHome',
    path: 'http://localhost:1024/kylin_h5/sass/home',
  },
  // // 主页-数据看板
  // {
  //   name: 'SaaSDataReport',
  //   path: 'http://localhost:1024/kylin_h5/saas/data_report',
  // },
  // // 拜访计划
  // {
  //   name: 'SaaSVisitPlanList',
  //   path: 'http://localhost:1024/kylin_h5/visit_plan/list',
  // },
  // {
  //   name: 'SaaSVisitPlanCreate',
  //   path: 'http://localhost:1024/kylin_h5/visit_plan/create',
  // },
  // // （陪）拜访记录
  // {
  //   name: 'SaaSOceanVisitNewList',
  //   path: 'http://localhost:1024/kylin_h5/saas/ocean_visit_new/list',
  // },
  // {
  //   name: 'SaaSOceanVisitNewDraftList',
  //   path: 'http://localhost:1024/kylin_h5/saas/ocean_visit_new/draft_list',
  // },
  // {
  //   name: 'SaaSOceanVisitNewCreate',
  //   path: 'http://localhost:1024/kylin_h5/saas/ocean_visit_new/create',
  // },
  // // 拜访统计
  // {
  //   name: 'SaaSOceanVisitStatistics',
  //   path: 'http://localhost:1024/kylin_h5/saas/ocean_visit/statistics',
  // },
  // // 新建签到
  // {
  //   name: 'SaaSCsSignCreate',
  //   path: 'http://localhost:1024/kylin_h5/saas/cs_sign/sign/create',
  // },
  // // 签到记录
  // {
  //   name: 'SaaSCsSignList',
  //   path: 'http://localhost:1024/kylin_h5/saas/cs_sign/sign/list',
  // },
  // // 日志
  // {
  //   name: 'SaaSDailyRecordCreate',
  //   path: 'http://localhost:1024/kylin_h5/saas/daily_record/create',
  // },
  // {
  //   name: 'SaaSDailyRecordList',
  //   path: 'http://localhost:1024/kylin_h5/saas/daily_record/list',
  // },
  // {
  //   name: 'SaaSDailyRecordDetail',
  //   path: 'http://localhost:1024/kylin_h5/saas/daily_record/detail/618108f9b7ea8e0001a0f2eb',
  // },
  // // 新建点评拜访
  // {
  //   name: 'SaaSCommentVisitCreate',
  //   path: 'http://localhost:1024/kylin_h5/saas/comment_visit/create',
  // },
  // {
  //   name: 'SaaSCommentVisitList',
  //   path: 'http://localhost:1024/kylin_h5/saas/comment_visit/list',
  // },
  // {
  //   name: 'SaaSCommentVisitDetail',
  //   path: 'http://localhost:1024/kylin_h5/saas/comment_visit/detail/61dff248ec36a50001505685',
  // },
  // // 签单录入
  // {
  //   name: 'SaaSSignEntryList',
  //   path: 'http://localhost:1024/kylin_h5/saas/sign_entry/list',
  // },
  // {
  //   name: 'SaaSSignEntryCreate',
  //   path: 'http://localhost:1024/kylin_h5/saas/sign_entry/create',
  // },
  // {
  //   name: 'SaaSSignEntryAdd',
  //   path: 'http://localhost:1024/kylin_h5/saas/sign_entry/add/202',
  // },
  // {
  //   name: 'SaaSSignEntryView',
  //   path: 'http://localhost:1024/kylin_h5/saas/sign_entry/add/155',
  // },

  // // 公海
  // {
  //   name: 'SaaSOceanPublic',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/resource/public',
  // },
  // {
  //   name: 'SaaSOceanHall',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/resource/hall',
  // },
  // {
  //   name: 'SaaSOceanCollect',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/resource/collection',
  // },
  // {
  //   name: 'SaaSOceanDetail',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/source_detail/public/1995801/competeOrderTab',
  // },
  // // 私海
  // {
  //   name: 'SaaSOceanCreate',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/resource_create/create',
  // },
  // {
  //   name: 'SaaSOceanPrivate',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/private_ocean',
  // },
  // // 惩罚审批
  // {
  //   name: 'SaaSOceanPunish',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/punish?tabIdx=0',
  // },
  // {
  //   name: 'SaaSOceanPunishDetail',
  //   path: 'http://localhost:1024/kylin_h5/sass/ocean/punish_operate/620c973561735773b0807490?type=',
  // },
  // // 达人查询
  // {
  //   name: 'SaaSTalentList',
  //   path: 'http://localhost:1024/kylin_h5/saas/talent/talent_search',
  // },
  // {
  //   name: 'SaaSTalentDetail',
  //   path: 'http://localhost:1024/kylin_h5/saas/talent/talent_detail/1997855',
  // },
  // // 投放数据
  // {
  //   name: 'SaaSPlatformList',
  //   path: 'http://localhost:1024/kylin_h5/saas/platform/list',
  // },
  // {
  //   name: 'SaaSPlatformDetail',
  //   path: 'http://localhost:1024/kylin_h5/saas/platform/detail/13',
  // },
  // // 审批
  // {
  //   name: 'SaaSAuditList',
  //   path: 'http://localhost:1024/kylin_h5/saas/audit/list',
  // },
  // {
  //   name: 'SaaSAuditDetail',
  //   path: 'http://localhost:1024/kylin_h5/saas/audit/detail/todo/6265450c8169f10001d5498d',
  // },
];

const promiseHandle = Promise.resolve();

allPage.forEach((item) =>
  (promiseHandle = promiseHandle.then((res) =>
    lighthouseFromPuppeteer(
      item.path,
      item.name,
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjMzMzMsImF1ZCI6InpiIiwiY2FzIjoidnVpcnNtZmtwbTd1OGdpYTB3cnV3aWFiMXI5Y2hwMW8iLCJleHAiOjE2NTI2ODMyNzB9.PsvfFDsay43bstCem3GQ1NOS7ms3f4TSxqz8neLavGc',
      options,
      config
    )
  )).catch((err) => {
    return Promise.reject(err);
  })
);
