const { weatherforecast_7days } = require('../components/weatherforecast7days');

async function weather_forecast_7days(req, res, next) {
  console.log('request weather forecast 7 days');

  let { Province } = req.body;
  const data = await weatherforecast_7days(Province);
  console.log(data);
  if (data) {
    return res.json({ status: 'success', Provinces: data.Provinces[0] });
  } else {
    return res.json({
      status: 'fail',
      msg: 'Please search for a valid city 😩',
    });
  }
}

const https = require('https');
const xml2js = require('xml2js');
const fs = require('fs');

async function rain_regions(req, res, next) {
  console.log(
    '===============================Rain Regions=================================='
  );
  let url =
    'https://data.tmd.go.th/api/RainRegions/v1/?uid=u63glasrice&ukey=3e296702720f633d0a819d0f90c35deb';

  var request = https.request(url, function (returnData) {
    var data = '';
    returnData.on('data', function (chunk) {
      data += chunk;
    });
    returnData.on('end', function () {
      xml2js.parseString(data, { mergeAttrs: true }, (err, result) => {
        if (err) {
          throw err;
        }
        const jsonData = JSON.stringify(result.RainRegions.Version).replace(
          /\\/g,
          ''
        );
        // fs.writeFileSync('data1.json', jsonData);
        fs.writeFileSync(
          'data2.json',
          JSON.stringify(result.RainRegions.Version)
        );
        return res.json({
          status: 'success',
          data: jsonData,
        });
        // fs.writeFileSync('data1.json', jsonData);
        // console.log(jsonData.RainRegions);
      });
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
}

module.exports.weather_forecast_7days = weather_forecast_7days;
module.exports.rain_regions = rain_regions;
