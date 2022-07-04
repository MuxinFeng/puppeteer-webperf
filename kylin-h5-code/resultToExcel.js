const fs = require('fs');
const json2xls = require('json2xls');

fs.readFile(
  './kylin-h5/mainPage_performance_data_old3_result.json',
  'utf8',
  (err, data) => {
    if (err) throw err;
    const json = JSON.parse(data);
    const jsonArray = [];
    json.forEach(function (item) {
      let temp = {
        模块: item.name,
        lcp: item.lcp,
      };
      jsonArray.push(temp);
    });

    let xls = json2xls(jsonArray);

    fs.writeFileSync('name3.xlsx', xls, 'binary');
  }
);
