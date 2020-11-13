const fetch = require('node-fetch');
const utf8 = require('utf8');

async function weather_forecast_7days(req, res, next) {
  console.log('Require weather forecast 7 days');

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

async function weatherforecast_7days(Province) {
  var package = [{}];
  Province = utf8.encode(Province);
  url =
    'https://data.tmd.go.th/api/WeatherForecast7Days/V1/?type=json&Province=';
  url = url.concat(Province);
  console.log(url);
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      package = data;
    })
    .catch(() => {
      console.log('Please search for a valid city 😩');
    });
  return package;
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
module.exports.weatherforecast_7days = weatherforecast_7days;
