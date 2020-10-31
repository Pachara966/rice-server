const connectDB = require("../connectdb");
const User = require("../models/userSchema");
const Farm = require("../models/FarmSchema");
const AIdemo = require("../temp/eval_demo.json");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ai = require("./ai-controller");
const { json } = require("express");

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
  const province = req.body.location;
  const varietie = req.body.varietie;
  const evaltype = req.body.evaltype;
  const startDate = req.body.startDate;
  const data = await ai.predict_tl(province, varietie, evaltype, startDate);
  //var result = AIdemo;
  var result = data;
  var ret = [{}];
  var v = [{}];
  console.log(result.varieties);
  for (let index = 0; index < result.length; index++) {
    v[index] = await Varieties.findOne({ ID: result[index].varieties }).select([
      "rice_varieties_name",
    ]);
    console.log(result[index]);
    ret[index] = {
      name: v[index].rice_varieties_name,
      ID: result[index].varieties,
      cost: {
        value: result[index].evalproduct.cost.value,
        status: result[index].evalproduct.cost.status,
      },
      product: {
        value: result[index].evalproduct.product.value,
        status: result[index].evalproduct.product.status,
      },
      price: {
        value: result[index].evalproduct.price.value,
        status: result[index].evalproduct.price.status,
      },
      profit: {
        value: result[index].evalproduct.profit.value,
        status: result[index].evalproduct.profit.status,
      },
      tl: result[index].timelineFuture,
    };
  }
  //console.log(result);
  console.log(ret);
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
  const startDate = req.body.startDate;
  const varieties = req.body.varieties;
  const timelineFuture = req.body.timelineFuture;
  const cost = req.body.cost;
  const product = req.body.product;
  const price = req.body.price;
  const profit = req.body.profit;
  const costS = req.body.costS;
  const productS = req.body.productS;
  const priceS = req.body.priceS;
  const profitS = req.body.profitS;
  const activate = "wait";

  let location = {
      formattedAddress: formattedAddress,
      province: province,
      latt: latt, // or String
      long: long, // or String
    },
    evalproduct = {
      cost: { value: cost, status: costS },
      product: { value: product, status: productS },
      price: { value: price, status: priceS },
      profit: { value: profit, status: profitS },
    };
  data = {
    name: name,
    size: size,
    varieties: varieties,
    location: location,
    evalproduct: evalproduct,
    timelineFuture: timelineFuture,
    activate: activate,
    startDate: startDate,
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

async function farm_informationByname(req, res, next) {
  await connectDB.connect_db();
  console.log("farm information");
  const uid = req.body.uid;
  const farmname = req.body.farmname;
  const u = await user.findOne({ _id: uid }).populate({
    path: 'farms',
    match: { name: farmname },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: '_id'
  });
  fid = u.farms[0]._id;
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

async function farm_remove(req, res, next) {
  await connectDB.connect_db();
  const fid = req.body.fid;
  const uid = req.body.uid;

  await user.updateOne(
    { _id: uid },
    {
      $pullAll: {
        farms: { _id: fid },
      },
    }
  );
}

module.exports.varieties_eval_only = varieties_eval_only;
module.exports.farm_create = farm_create;
module.exports.varieties_get_name = varieties_get_name;
module.exports.farm_create_tl = farm_create_tl;
module.exports.farm_information = farm_information;
module.exports.farm_remove = farm_remove;
module.exports.farm_informationByname = farm_informationByname;
