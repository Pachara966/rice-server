const express = require('express');
const router = express.Router();
const init = require('../controllers/init-controller');
const weather = require('../controllers/weather-controller');

router
  .post('/api/init/data', init.init_data)
  .get('/api/init/updateFeed', init.updateFeed)
  .post('/api/init/ricevarityinfo', init.get_rice_varity_information)
  .post('/api/init/weatherforecast', weather.weather_forecast_7days)
  .post('/api/init/rainregions', weather.rain_regions);
module.exports = router;
