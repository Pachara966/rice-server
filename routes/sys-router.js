const express = require('express');
const router = express.Router();
const init = require('../controllers/init-controller');

router
  .post('/api/init/data', init.init_data)
  .get('/api/init/updateFeed', init.updateFeed);
module.exports = router;
