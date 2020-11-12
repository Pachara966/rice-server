const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');
router
  .post('/api/user/create', user.user_register)
  .post('/api/user/login', user.user_login)
  .post('/api/user/updateinfo', user.user_update_information)
  .post('/api/user/deleteuser', user.user_delete_user)
  .post('/api/user/resetpassword', user.user_resetpassword);

module.exports = router;
