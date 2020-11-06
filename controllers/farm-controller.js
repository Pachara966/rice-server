const connectDB = require('../connectdb');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const AIdemo = require('../temp/eval_demo.json');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ai = require('./ai-controller');

const varieties = new schema({
  ID: Number,
  rice_varieties_name: String,
});

const Varieties = mongoose.model(
  'rice_varieties_data',
  varieties,
  'rice_varieties_data'
);

const user = User.userModel;
const farm = Farm.farmModel;

async function varieties_eval_only(req, res, next) {
  console.log('request varieties evaluation');

  const { province, varietie, evaltype, startDate } = req.body;

  const data = await ai.predict_tl(province, varietie, evaltype, startDate);
  //var result = AIdemo;
  var result = data;
  var ret = [{}];
  var v = [{}];
  console.log('==============================================');
  console.log('==============================================');
  console.log('==============================================');
  console.log('result: ', result);
  console.log('==============================================');
  console.log('==============================================');
  for (let index = 0; index < result.length; index++) {
    v[index] = await Varieties.findOne({ ID: result[index].varieties }).select([
      'rice_varieties_name',
    ]);
    // console.log('result[index] : ', result[index]);
    // console.log('v[index] : ', v[index]);
    ret[index] = {
      name: v[index].rice_varieties_name, // ชื่อพันธุ์ข้าว
      ID: result[index].varieties, // ID ชื่อพันธุ์ข้าว
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

      code_type: result[0],
      resultLength: result.length,
      timelineLength0: result[0].timeline.length,
      timelineLength1: result[1].timeline.length,
      resultTimelineActivityLength: result[0].timeline[1].activities.length,
      resultTimeline1Activity0Code_type:
        result[0].timeline[1].activities[0].code_type,
      resultTimeline1Activity1Code_type:
        result[0].timeline[1].activities[1].code_type,
      timeline: count_Warning(result[0].timeline),
      // warningLength: count_Warning(result[index].timeline),
      // activityLength: count_Warning(result[index].timeline),
    };
  }
  res.send(ret);
}

const count_Warning = (timelineOrder) => {
  var count = 0;
  var package = [{}];
  var activities = [{}];
  var array_code = [{}];

  var orderLength = timelineOrder.length;
  console.log('===================================================');
  console.log(orderLength);
  for (let i = 0; i < orderLength; i++) {
    var activitiesLength = timelineOrder[i].activities.length;
    for (let j = 0; j < activitiesLength; j++) {
      var array_codeLength = timelineOrder[i].activities[j].array_code.length;
      for (let k = 0; k < array_codeLength; k++) {
        console.log('===================================================');
        console.log('i : ', i);
        console.log('j : ', j);
        console.log('k : ', k);
        console.log(timelineOrder[i].activities[j].array_code[k].code);
        console.log('===================================================');
        array_code[k] = {
          activityCode: timelineOrder[i].activities[j].array_code[k].code,
          activity: 'ตรวจสอบระดับน้ำ 3 เซนติเมตร',
          picture: timelineOrder[i].activities[j].array_code[k].picture_url,
          activate: timelineOrder[i].activities[j].array_code[k].activate,
        };
      }
      activities[j] = {
        code_type: timelineOrder[i].activities[j].code_type,
        array_code,
      };
    }
    package[i] = {
      order: timelineOrder[i].order,
      activitiesDate: timelineOrder[i].activitiesDate,
      caption: timelineOrder[i].caption,
      status: timelineOrder[i].status,
      timelineType: timelineOrder[i].timelineType,
      activities,
    };
  }

  // if (timelineOrder[0].activities[0].code_type == 1) {
  //   count = 100;
  // } else count = 0;

  return package;
};

async function farm_create(req, res, next) {
  const uid = req.body.uid;
  const name = req.body.name;
  const size = req.body.size;
  const formattedAddress = req.body.formattedAddress;
  const province = req.body.province;
  const latt = req.body.latt; // or String
  const long = req.body.long; // or String
  const activate = 'wait';

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
        status: 'ok',
      };
      res.send(ret);
    })
    .catch((err) => {
      console.log(err);
      let ret = {
        detail: err,
        status: 'err',
      };
      res.send(ret);
    });
}

async function farm_create_tl(req, res, next) {
  //Timeline
  const {
    uid,
    name,
    size,
    formattedAddress,
    province,
    latt,
    long,
    startDate,
    varieties,
    timeline,
    cost,
    product,
    price,
    profit,
    costS,
    productS,
    priceS,
    profitS,
  } = req.body;

  const activate = 'wait';

  let location = {
      formattedAddress,
      province,
      latt, // or String
      long, // or String
    },
    evalproduct = {
      cost: { value: cost, status: costS },
      product: { value: product, status: productS },
      price: { value: price, status: priceS },
      profit: { value: profit, status: profitS },
    };
  data = {
    name,
    size,
    varieties,
    location,
    evalproduct,
    timeline,
    activate,
    startDate,
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
        status: 'ok',
      };
      res.send(ret);
    })
    .catch((err) => {
      console.log(err);
      let ret = {
        detail: err,
        status: 'err',
      };
      res.send(ret);
    });
}

async function varieties_get_name(req, res, next) {
  console.log('get varirties id / name');

  const v = await Varieties.find().select(['ID', 'rice_varieties_name']);
  console.log(v);
  res.send(v);
}

async function farm_information(req, res, next) {
  console.log('farm information');
  const fid = req.body.fid;
  const f = await farm.findOne({ _id: fid });

  const v = await Varieties.findOne({ ID: f.varieties }).select([
    'ID',
    'rice_varieties_name',
  ]);
  let ret = {
    farm: f,
    varietie: v,
  };
  res.send(ret);
  console.log(ret);
}

async function farm_informationByname(req, res, next) {
  // read farm to profile
  await connectDB.connect_db();
  console.log('farm information');
  const uid = req.body.uid;
  const farmname = req.body.farmname;
  const u = await user.findOne({ _id: uid }).populate({
    path: 'farms',
    match: { name: farmname },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: '_id',
  });
  fid = u.farms[0]._id;
  const f = await farm.findOne({ _id: fid });

  const v = await Varieties.findOne({ ID: f.varieties }).select([
    'ID',
    'rice_varieties_name',
  ]);
  let ret = {
    farm: f,
    varietie: v,
  };
  res.send(ret);
  console.log(ret);
}

async function farm_remove(req, res, next) {
  console.log('request remove farm');

  const { fid, uid } = req.body;

  await user.updateOne(
    { _id: uid },
    {
      $pullAll: {
        farms: { _id: fid },
      },
    }
  );
  // .catch((err) => console.error(`Failed to add review: ${err}`));
}

module.exports.varieties_eval_only = varieties_eval_only;
module.exports.farm_create = farm_create;
module.exports.varieties_get_name = varieties_get_name;
module.exports.farm_create_tl = farm_create_tl;
module.exports.farm_information = farm_information;
module.exports.farm_remove = farm_remove;
module.exports.farm_informationByname = farm_informationByname;
