// @ ts-nocheck
// 计算平均值
const fs = require('fs');

function calcAvage() {
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

  const resultMap = new Map();
  [...oldJson].map((item) => {
    if (resultMap.has(item.name)) {
      resultMap.set(item.name, resultMap.get(item.name) + item.lcp);
    } else {
      resultMap.set(item.name, item.lcp);
    }
  });

  console.log();

  let resultList = [];
  resultMap.forEach((value, key) => {
    resultList.push({ name: key, lcp: value / 15 });
    return;
  });

  console.log(resultList);
  fs.writeFile(
    `./kylin-h5/mainPage_performance_data_old2_result.json`,
    JSON.stringify(resultList),
    (err) => {
      if (err) throw err;
    }
  );
}

calcAvage();
