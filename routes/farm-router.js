const express = require('express');
const router = express.Router();
const farm = require('../controllers/farm-controller');
router
  .post('/api/varieties/eval', farm.varieties_eval_only) // วิเคราะห์พันธุ์ข้าว
  .post('/api/create/only', farm.farm_create) // สร้างฟาร์ม
  .post('/api/farm/create/tl', farm.farm_create_tl)
  .get('/api/varietie/get', farm.varieties_get_name)
  .post('/api/farm/information', farm.farm_information)
  .post('/api/farm/information/name', farm.farm_informationByname);

module.exports = router;
