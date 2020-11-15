const fetch = require('node-fetch');
const utf8 = require('utf8');

async function weatherforecast_7days(province) {
  console.log('require weather forecast 7 days');
  var package = [{}];
  Province = utf8.encode(province);
  url =
    'https://data.tmd.go.th/api/WeatherForecast7Days/V1/?type=json&Province=';
  url = url.concat(Province);
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

module.exports.weatherforecast_7days = weatherforecast_7days;
