const connectDB = require("../connectdb");
const User = require("../models/userSchema");
const Farm = require("../models/FarmSchema");
const AIdemo = require("../temp/eval_demo.json");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const varieties = new schema({
  ID: Number,
  rice_varieties_name: String,
});

const Varieties = mongoose.model(
  "rice_varieties_data",
  varieties,
  "rice_varieties_data"
);

const user = User.userModel;
const farm = Farm.farmModel;

async function varieties_eval_only(req, res, next) {
  console.log("request");
  await connectDB.connect_db();
  const data = req.body;
  var result = AIdemo;
  var ret = [{}];
  var v = [{}];
  for (let index = 0; index < result.length; index++) {
    v[index] = await Varieties.findOne({ ID: result[index].varieties }).select([
      "rice_varieties_name",
    ]);
    console.log(v[index]);
    ret[index] = {
      name: v[index].rice_varieties_name,
      ID: result[index].varieties,
      cost: {
        value: result[index].evalproduct.cost.value,
        status: result[index].evalproduct.cost.enum,
      },
      product: {
        value: result[index].evalproduct.product.value,
        status: result[index].evalproduct.product.enum,
      },
      price: {
        value: result[index].evalproduct.price.value,
        status: result[index].evalproduct.price.enum,
      },
      profit: {
        value: result[index].evalproduct.profit.value,
        status: result[index].evalproduct.profit.enum,
      },
      tl: result[index].timelineFuture,
    };
  }
  console.log(result);
  console.log(ret[0].tl);
  res.send(ret);
}

async function farm_create(req, res, next) {
  await connectDB.connect_db();
  const uid = req.body.uid;
  const name = req.body.name;
  const size = req.body.size;
  const formattedAddress = req.body.formattedAddress;
  const province = req.body.province;
  const latt = req.body.latt; // or String
  const long = req.body.long; // or String
  const activate = "wait";

  let location = {
      formattedAddress: formattedAddress,
      province: province,
      latt: latt, // or String
      long: long, // or String
    },
    data = {
      name: name,
      size: size,
      location: location,
      activate: activate,
    };
  let farmdata = new farm(data);
  await farmdata.save();

  console.log(uid);
  console.log(farmdata);

  user
    .updateOne(
      { _id: uid },
      {
        $push: { farms: farmdata._id },
      }
    )
    .then(async function (success) {
      console.log(success);
      let ret = {
        farm: farmdata,
        detail: success,
        status: "ok",
      };
      res.send(ret);
    })
    .catch((err) => {
      console.log(err);
      let ret = {
        detail: err,
        status: "err",
      };
      res.send(ret);
    });
}

async function farm_create_tl(req, res, next) {
  await connectDB.connect_db();
  const uid = req.body.uid;
  const name = req.body.name;
  const size = req.body.size;
  const formattedAddress = req.body.formattedAddress;
  const province = req.body.province;
  const latt = req.body.latt;
  const long = req.body.long;
  //const dateTime: _dateTime,
  const varieties = req.body.varieties;
  const timelineFuture = req.body.timelineFuture;
  const cost = req.body.cost;
  const product = req.body.product;
  const price = req.body.price;
  const profit = req.body.profit;
  const activate = "wait";

  let location = {
      formattedAddress: formattedAddress,
      province: province,
      latt: latt, // or String
      long: long, // or String
    },
    evalproduct = {
      cost: { value: cost },
      product: { value: product },
      price: { value: price },
      profit: { value: profit },
    };
  data = {
    name: name,
    size: size,
    varieties: varieties,
    location: location,
    evalproduct: evalproduct,
    timelineFuture: timelineFuture,
    activate: activate,
  };
  let farmdata = new farm(data);
  await farmdata.save();

  console.log(uid);
  console.log(farmdata);
  //res.send("ok");

  user
    .updateOne(
      { _id: uid },
      {
        $push: { farms: farmdata._id },
      }
    )
    .then(async function (success) {
      console.log(success);
      let ret = {
        farm: farmdata,
        detail: success,
        status: "ok",
      };
      res.send(ret);
    })
    .catch((err) => {
      console.log(err);
      let ret = {
        detail: err,
        status: "err",
      };
      res.send(ret);
    });
}

async function varieties_get_name(req, res, next) {
  console.log("get varirties id / name");
  await connectDB.connect_db();

  const v = await Varieties.find().select(["ID", "rice_varieties_name"]);
  console.log(v);
  res.send(v);
}

async function farm_information(req, res, next) {
  await connectDB.connect_db();
  console.log("farm information");
  const fid = req.body.fid;
  const f = await farm.findOne({ _id: fid });

  const v = await Varieties.findOne({ ID: f.varieties }).select([
    "ID",
    "rice_varieties_name",
  ]);
  let ret = {
    farm: f,
    varietie: v,
  };
  res.send(ret);
  console.log(ret);
}

module.exports.varieties_eval_only = varieties_eval_only;
module.exports.farm_create = farm_create;
module.exports.varieties_get_name = varieties_get_name;
module.exports.farm_create_tl = farm_create_tl;
module.exports.farm_information = farm_information;
