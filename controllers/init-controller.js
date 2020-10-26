const connectDB = require("../connectdb");
const User = require("../models/userSchema");
const Farm = require("../models/FarmSchema");
const AIdemo = require("../temp/eval_demo.json");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const user = User.userModel;
const farm = Farm.farmModel;

async function init_data(req, res, next) {
  await connectDB.connect_db();
  const _id = req.body._id;

  const username = await user.findOne({ _id: _id }, "name");
  const useraddress = await user.findOne(
    { _id: _id },
    "address.formattedAddress"
  );

  const farms = await user.findOne({ _id: _id }).populate("farms");
  const feed = await user.findOne({ _id: _id }).populate("feed");

  let ret = {
    userData: { name: username, address: useraddress },
    farms: farms,
    feed: feed,
  };
  //console.log(ret);
  console.log(ret.userData);
  console.log(farms);
  console.log(feed);
  res.send(ret);
}

module.exports.init_data = init_data;
