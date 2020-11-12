const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const user = User.userModel;

// user.getCollection('users._id').find({});

async function user_register(req, res, next) {
  console.log('request user register');
  const { name, phonenumber, password } = req.body;

  // Validation
  if (!name || !phonenumber || !password) {
    return res.json({
      status: 'fail',
      msg: 'กรอกข้อมูลให้ครบทุกช่อง',
    });
  }

  if (phonenumber.length < 6) {
    return res.json({
      status: 'fail',
      msg: 'กรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก',
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
        newUser
          .save()
          .then(() =>
            res.json({ status: 'success', msg: 'ยืนยันการสมัครสมาชิก' })
          );
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

  if (phonenumber.length < 6) {
    return res.json({
      status: 'fail',
      msg: 'กรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก',
    });
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
        uid: logindata._id,
        name: logindata.name,
        surname: logindata.surname,
        phonenumber: logindata.phonenumber,
        address: logindata.address,
      });
    });
  });
}

async function user_update_information(req, res, next) {
  const { _id, name, formattedAddress, province, latt, long } = req.body;

  console.log('request user update');

  let address = {
    formattedAddress: formattedAddress,
    province: province,
    latt: latt, // or String
    long: long, // or String
  };

  user
    .findOneAndUpdate({ _id }, { name, address }, { new: true })
    .then((userData) => {
      if (!userData)
        return res.json({ status: 'fail', msg: 'ไม่สามารถแก้ไขข้อมูลได้' });

      res.json({
        status: 'success',
        uid: userData._id,
        name: userData.name,
        phonenumber: userData.phonenumber,
        address: userData.address,
      });
    });
}

async function user_delete_user(req, res, next) {
  const { _id } = req.body;

  console.log('request delete user ID');

  if (!_id) {
    return res.json({ status: 'fail', msg: 'ไม่มีข้อมูล id' });
  }

  user.findByIdAndDelete(_id, function (err, docs) {
    if (err) {
      console.log(err);
      return res.json({ status: 'fail', msg: 'ไม่สามารถลบข้อมูลสมาชิกได้' });
    } else {
      console.log('Deleted _id : ', docs._id, ', Name : ', docs.name),
        res.json({
          status: 'success',
          msg: 'ลบข้อมูลสมาชิกแล้ว',
        });
    }
  });
}

async function user_resetpassword(req, res, next) {
  const { _id, phonenumber, password, newPassword } = req.body;
  console.log('request reset password');

  // Validation
  if (!_id || !password || !password || !newPassword) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  if (password.length < 6 || newPassword.length < 6) {
    return res.json({
      status: 'fail',
      msg: 'รหัสผ่านอย่างน้อย 6 ตัวอักษร',
    });
  }

  if (phonenumber.length < 6) {
    return res.json({
      status: 'fail',
      msg: 'กรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก',
    });
  }

  //Check for existing user
  user.findOne({ phonenumber }).then((logindata) => {
    if (!logindata)
      return res.json({ status: 'fail', msg: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' });

    //Validate password
    bcrypt.compare(password, logindata.password).then((isMatch) => {
      if (!isMatch) {
        return res.json({ status: 'fail', msg: 'รหัสผ่านเก่าไม่ถูกต้อง' });
      } else {
        //Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            var newPassword = hash;
            user
              .findByIdAndUpdate(
                { _id },
                {
                  password: newPassword,
                }
              )
              .then((userData) => {
                if (!userData)
                  return res.json({
                    status: 'fail',
                    msg: 'ไม่สามารถแก้ไขรหัสผ่านได้',
                  });

                res.json({
                  status: 'success',
                  msg: 'แก้ไขรหัสผ่านสำเร็จ',
                });
              });
          });
        });
      }
    });
  });
}

module.exports.user_register = user_register;
module.exports.user_login = user_login;
module.exports.user_update_information = user_update_information;
module.exports.user_delete_user = user_delete_user;
module.exports.user_resetpassword = user_resetpassword;
