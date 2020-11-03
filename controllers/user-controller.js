const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const user = User.userModel;

async function user_register(req, res, next) {
  // await connectDB.connect_db();
  console.log('request user register');
  const { name, phonenumber, password } = req.body;
  // const name = req.body.name;
  // const phonenumber = req.body.phonenumber;
  // const password = req.body.password;

  // Validation
  if (!name || !phonenumber || !password) {
    return res.json({
      status: 'fail',
      msg: 'กรอกข้อมูลให้ครบทุกช่อง',
    });
  }

  if (password.length < 6) {
    return res.json({
      status: 'fail',
      msg: 'รหัสผ่านอย่างน้อย 6 ตัวอักษร',
    });
  }

  await user.findOne({ phonenumber }).then((userinfo) => {
    if (userinfo)
      return res.json({ status: 'fail', msg: 'หมายเลขโทรศัพท์ถูกใช้แล้ว' });

    const newUser = new user({
      name,
      phonenumber,
      password,
    });

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(() => res.json({ status: 'success' }));
      });
    });
  });
}

async function user_login(req, res, next) {
  const { phonenumber, password } = req.body;
  console.log('request login');

  // Validation
  if (!phonenumber || !password) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  //Check for existing user
  user.findOne({ phonenumber }).then((logindata) => {
    if (!logindata)
      return res.json({ status: 'fail', msg: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' });

    //Validate password
    bcrypt.compare(password, logindata.password).then((isMatch) => {
      if (!isMatch)
        return res.json({ status: 'fail', msg: 'รหัสผ่านไม่ถูกต้อง' });

      res.json({
        status: 'success',
        userData: {
          uid: logindata._id,
          name: logindata.name,
          surname: logindata.surname,
          phonenumber: logindata.phonenumber,
          address: logindata.address,
        },
      });
    });
  });

  // user
  //   .findOne({ phonenumber })
  //   .then(async function (logindata) {
  //     const pass = await bcry.compare(password, logindata.password);
  //     if (pass) {
  //       res.json({
  //         status: 'success',
  //         userData: {
  //           uid: logindata._id,
  //           name: logindata.name,
  //           surname: logindata.surname,
  //           phonenumber: logindata.phonenumber,
  //           address: logindata.address,
  //         },
  //       });
  //     } else {
  //       res.json({ status: 'fail', msg: 'รหัสผ่านไม่ถูกต้อง' });
  //     }
  //   })
  //   .catch(() => {
  //     res.json({ status: 'fail', msg: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' });
  //   });
}

async function user_information(req, res, next) {
  // await connectDB.connect_db();
  const uid = req.body.uid;
  user
    .findOne({ _id: uid })
    .then(async function (logindata) {
      let ret = {
        uid: logindata,
        status: 'success',
      };
      res.send(ret);
    })
    .catch(() => {
      let ret = {
        status: 'phonenumber incorrect',
      };
      res.send(ret);
    });
}

module.exports.user_register = user_register;
module.exports.user_login = user_login;
module.exports.user_information = user_information;
