const https = require('https');
const xml2js = require('xml2js');
const fs = require('fs');

var dateFormat = require('dateformat');
var today = new Date();
var DateTime =
  dateFormat(today.setDate(today.getDate()), 'isoDate').toString() +
  'T' +
  dateFormat(today.setDate(today.getDate()), 'isoTime').toString() +
  '.000Z';

rainregions();

async function rainregions() {
  console.log(
    '============================Auto run from Rain Regions============================'
  );
  console.log(DateTime);
  let url =
    'https://data.tmd.go.th/api/RainRegions/v1/?uid=u63glasrice&ukey=3e296702720f633d0a819d0f90c35deb';

  var request = https.request(url, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      xml2js.parseString(data, (err, result) => {
        if (err) {
          throw err;
        }
        const jsonData = JSON.stringify(result, null, 4);
        // fs.writeFileSync('data1.json', jsonData);
        console.log('success');
      });
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
}
