const express = require('express');
const router = express.Router();
const init = require('../controllers/init-controller');

router.post('/api/init/data', init.init_data);

module.exports = router;
