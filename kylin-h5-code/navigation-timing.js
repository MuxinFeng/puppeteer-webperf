const fs = require('fs');
const puppeteer = require('puppeteer');
const deviceEnv = puppeteer.devices['Moto G4']; // 最新版的lighthouse是用该机型测试，我认为该机型具有代表性
const netEnv = puppeteer.networkConditions['Fast 3G']; //目前只有快慢3g的选项，其实跟实际环境还有一定差别

// 要配置一个稳定、尽可能贴近实际使用情况的浏览器环境
const options = {
  headless: false, // 是否以 无头模式 运行浏览器。默认是 true，除非 devtools 选项是 true。
  // locale: 'zh-CH',
  // logLevel: 'info',
  // disableDeviceEmulation: true,
};

const getPerformance = async (name, url, token) => {
  // 实例化puppeteer
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.emulate(deviceEnv);
  // await page.emulateNetworkConditions(netEnv);
  page.setCookie({
    name: 'kyer',
    value: token,
    url,
  });

  //开始采集数据
  let oldJson;
  try {
    oldJson = fs.readFileSync(
      `./kylin-h5/mainPage_performance_data_old2.json`,
      'utf8'
    );
  } catch (error) {
    console.log(error);
  }
  oldJson = oldJson ? JSON.parse(oldJson) : oldJson;

  // await page.evaluateOnNewDocument(calculateLCP);
  await page.goto(url);

  const navigation = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(window.performance.getEntriesByType('navigation')[0])
    )
  );
  const paint = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(window.performance.getEntriesByType('paint')[0])
    )
  );
  // const lcp = await page.evaluate(() => {
  //   return window.largestContentfulPaint;
  // });
  console.log(`${name}页面性能参数:`);
  console.log('🏆 navigation:', navigation);
  console.log('🎨 paint:', paint);
  const newJson = oldJson
    ? [...oldJson, { name, navigation, paint }]
    : [{ name, url, navigation, paint }];
  fs.writeFile(
    `./kylin-h5/mainPage_performance_data_old2.json`,
    JSON.stringify(newJson),
    (err) => {
      if (err) throw err;
    }
  );

  await browser.close();
};

//目前LCP有时候一直是0，问题还没排查出来
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

// allPage.forEach((item) =>
//   (promiseHandle = promiseHandle.then((res) =>
//     getPerformance(
//       item.name,
//       item.path,
//       'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjMzMzMsImF1ZCI6InpiIiwiY2FzIjoidnVpcnNtZmtwbTd1OGdpYTB3cnV3aWFiMXI5Y2hwMW8iLCJleHAiOjE2NTI2ODMyNzB9.PsvfFDsay43bstCem3GQ1NOS7ms3f4TSxqz8neLavGc'
//     )
//   )).catch((err) => {
//     return Promise.reject(err);
//   })
// );

for (let i = 0; i < 7; i++) {
  allPage.forEach((item) =>
    (promiseHandle = promiseHandle.then((res) =>
      getPerformance(
        item.name,
        item.path,
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlaWQiOjU2NzQsImF1ZCI6InpiIiwiY2FzIjoidWhhMnZvMHVvNXdmaDA0bWtsbzlob2ozNnRrdDhraWMiLCJleHAiOjE2NTY1Nzg4ODZ9.KSjgamaWB5-B4McSSDtqdx0quBjEgvDJJ9OXGNP8u-k'
      )
    )).catch((err) => {
      return Promise.reject(err);
    })
  );
}
