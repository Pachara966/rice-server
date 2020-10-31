const bcry = require("bcrypt");

const connectDB = require("../connectdb");
const User = require("../models/userSchema");

const user = User.userModel;

async function user_register(req, res, next) {
  await connectDB.connect_db();
  console.log("request user_register");
  const name = req.body.name;
  const phonenumber = req.body.phonenumber;
  const password = req.body.password;
  const passbcry = await bcry.hash(password, 10);
  const pass = await bcry.compare(password, passbcry);
  if (pass) {
    const data = {
      name: name,
      phonenumber: phonenumber,
      password: passbcry,
    };
    let userdata = new user(data);
    await userdata.save();
    res.send("ok");
  }
}

async function user_login(req, res, next) {
  await connectDB.connect_db();
  const phonenumber = req.body.phonenumber;
  const password = req.body.password;
  console.log("request login");
  user
    .findOne({ phonenumber: phonenumber })
    .then(async function (logindata) {
      const pass = await bcry.compare(password, logindata.password);
      if (pass) {
        let ret = {
          uid: logindata._id,
          status: "ok",
        };
        res.send(ret);
      } else {
        let ret = {
          status: "password incorrect",
        };
        res.send(ret);
      }
    })
    .catch(() => {
      let ret = {
        status: "phonenumber incorrect",
      };
      res.send(ret);
    });
}

async function user_information(req, res, next) {
  await connectDB.connect_db();
  const uid = req.body.uid;
  user
    .findOne({ _id: uid })
    .then(async function (logindata) {
      
        let ret = {
          uid: logindata,
          status: "ok",
        };
        res.send(ret);
      
    })
    .catch(() => {
      let ret = {
        status: "phonenumber incorrect",
      };
      res.send(ret);
    });
}

module.exports.user_register = user_register;
module.exports.user_login = user_login;
module.exports.user_information = user_information;
