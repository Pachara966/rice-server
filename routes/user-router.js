const express = require("express");
const router = express.Router();
const user = require("../controllers/user-controller");
router
  .post("/api/user/create", user.user_register)
  .post("/api/user/login", user.user_login)
  .post("/api/user/information",user.user_information);

module.exports = router;
