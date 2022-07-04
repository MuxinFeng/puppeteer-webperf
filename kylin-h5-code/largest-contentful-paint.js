const fs = require('fs');

const puppeteer = require('puppeteer');
const phone = puppeteer.devices['Moto G4']; // 最新版的lighthouse是用该机型测试，我认为该机型具有代表性
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjU2NzQsImF1ZCI6InpiIiwiY2FzIjoidWhhMnZvMHVvNXdmaDA0bWtsbzlob2ozNnRrdDhraWMiLCJleHAiOjE2NTY3MjU0NTV9.K4ZgiS3PnHfONddUyDmygZ4XSwfwX4j0GJxU2yUp4tc';
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
async function getLCP(name, url) {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ['--no-sandbox'],
    timeout: 10000,
  });

  try {
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    await client.send('Network.enable');
    await client.send('ServiceWorker.enable');
    // await page.emulateNetworkConditions(puppeteer.networkConditions['Fast 3G']);
    await page.emulateCPUThrottling(4);
    await page.emulate(phone);
    page.setCookie({
      name: 'kyer',
      value: token,
      url,
    });

    let oldJson;
    try {
      oldJson = fs.readFileSync(
        `./kylin-h5/mainPage_performance_data_old3.json`,
        'utf8'
      );
    } catch (error) {
      console.log(error);
    }
    oldJson = oldJson ? JSON.parse(oldJson) : oldJson;

    await page.evaluateOnNewDocument(calculateLCP);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    const lcp = await page.evaluate(() => {
      return window.largestContentfulPaint;
    });
    const newJson = oldJson
      ? [...oldJson, { name, url, lcp }]
      : [{ name, url, lcp }];
    fs.writeFile(
      `./kylin-h5/mainPage_performance_data_old3.json`,
      JSON.stringify(newJson),
      (err) => {
        if (err) throw err;
      }
    );
    console.log('LCP is: ' + lcp);

    browser.close();
    return lcp;
  } catch (error) {
    console.log(error);
    browser.close();
  }
}

// getLCP('http://localhost:1024/kylin_h5/sass/home').then((lcp) =>
//   console.log('LCP is: ' + lcp)
// );
const allPage = [
  // 主页-业务入口
  {
    name: 'SaaSHome',
    path: 'http://localhost:1024/kylin_h5/sass/home',
  },
  // 主页-数据看板
  {
    name: 'SaaSDataReport',
    path: 'http://localhost:1024/kylin_h5/saas/data_report',
  },
  // 拜访计划
  {
    name: 'SaaSVisitPlanList',
    path: 'http://localhost:1024/kylin_h5/visit_plan/list',
  },
  {
    name: 'SaaSVisitPlanCreate',
    path: 'http://localhost:1024/kylin_h5/visit_plan/create',
  },
  // （陪）拜访记录
  {
    name: 'SaaSOceanVisitNewList',
    path: 'http://localhost:1024/kylin_h5/saas/ocean_visit_new/list',
  },
  {
    name: 'SaaSOceanVisitNewDraftList',
    path: 'http://localhost:1024/kylin_h5/saas/ocean_visit_new/draft_list',
  },
  {
    name: 'SaaSOceanVisitNewCreate',
    path: 'http://localhost:1024/kylin_h5/saas/ocean_visit_new/create',
  },
  // 新建签到
  {
    name: 'SaaSCsSignCreate',
    path: 'http://localhost:1024/kylin_h5/saas/cs_sign/sign/create',
  },
  // 签到记录
  {
    name: 'SaaSCsSignList',
    path: 'http://localhost:1024/kylin_h5/saas/cs_sign/sign/list',
  },
  // 日志
  {
    name: 'SaaSDailyRecordCreate',
    path: 'http://localhost:1024/kylin_h5/saas/daily_record/create',
  },
  {
    name: 'SaaSDailyRecordList',
    path: 'http://localhost:1024/kylin_h5/saas/daily_record/list',
  },
  {
    name: 'SaaSDailyRecordDetail',
    path: 'http://localhost:1024/kylin_h5/saas/daily_record/detail/618108f9b7ea8e0001a0f2eb',
  },
  // 新建点评拜访
  {
    name: 'SaaSCommentVisitCreate',
    path: 'http://localhost:1024/kylin_h5/saas/comment_visit/create',
  },
  {
    name: 'SaaSCommentVisitList',
    path: 'http://localhost:1024/kylin_h5/saas/comment_visit/list',
  },
  {
    name: 'SaaSCommentVisitDetail',
    path: 'http://localhost:1024/kylin_h5/saas/comment_visit/detail/61dff248ec36a50001505685',
  },
  // 签单录入
  {
    name: 'SaaSSignEntryList',
    path: 'http://localhost:1024/kylin_h5/saas/sign_entry/list',
  },
  {
    name: 'SaaSSignEntryCreate',
    path: 'http://localhost:1024/kylin_h5/saas/sign_entry/create',
  },
  {
    name: 'SaaSSignEntryAdd',
    path: 'http://localhost:1024/kylin_h5/saas/sign_entry/add/202',
  },
  {
    name: 'SaaSSignEntryView',
    path: 'http://localhost:1024/kylin_h5/saas/sign_entry/add/155',
  },

  // 公海
  {
    name: 'SaaSOceanPublic',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/resource/public',
  },
  {
    name: 'SaaSOceanHall',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/resource/hall',
  },
  {
    name: 'SaaSOceanCollect',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/resource/collection',
  },
  {
    name: 'SaaSOceanDetail',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/source_detail/public/1995801/competeOrderTab',
  },
  // 私海
  {
    name: 'SaaSOceanCreate',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/resource_create/create',
  },
  {
    name: 'SaaSOceanPrivate',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/private_ocean',
  },
  // 惩罚审批
  {
    name: 'SaaSOceanPunish',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/punish?tabIdx=0',
  },
  {
    name: 'SaaSOceanPunishDetail',
    path: 'http://localhost:1024/kylin_h5/sass/ocean/punish_operate/620c973561735773b0807490?type=',
  },
  // 达人查询
  {
    name: 'SaaSTalentList',
    path: 'http://localhost:1024/kylin_h5/saas/talent/talent_search',
  },
  {
    name: 'SaaSTalentDetail',
    path: 'http://localhost:1024/kylin_h5/saas/talent/talent_detail/1997855',
  },
  // 投放数据
  {
    name: 'SaaSPlatformList',
    path: 'http://localhost:1024/kylin_h5/saas/platform/list',
  },
  {
    name: 'SaaSPlatformDetail',
    path: 'http://localhost:1024/kylin_h5/saas/platform/detail/13',
  },
  // 审批
  {
    name: 'SaaSAuditList',
    path: 'http://localhost:1024/kylin_h5/saas/audit/list',
  },
  {
    name: 'SaaSAuditDetail',
    path: 'http://localhost:1024/kylin_h5/saas/audit/detail/todo/6265450c8169f10001d5498d',
  },
];

let promiseHandle = Promise.resolve();
for (let i = 0; i < 15; i++) {
  allPage.forEach((item) =>
    (promiseHandle = promiseHandle.then((res) =>
      getLCP(item.name, item.path)
    )).catch((err) => {
      return Promise.reject(err);
    })
  );
}
