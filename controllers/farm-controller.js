const connectDB = require('../connectdb');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const RicePricePredict = require('../models/ricePricePredictSchema');
const AIdemo = require('../temp/eval_demo.json');
var dateFormat = require('dateformat');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const CodeDif = require('../models/codeDefSchema');
const codeDif = CodeDif.codeDefModel;

const ai = require('./ai-controller');
const varieties = require('../models/ricevaritiesSchema');
const { json } = require('body-parser');
const { restart } = require('nodemon');
const { constants } = require('fs');
// const varieties = new schema({
//   ID: Number,
//   rice_varieties_name: String,
// });

const Varieties = mongoose.model(
  'rice_varieties1',
  varieties,
  'rice_varieties_data'
);

const Ricepricepredict = mongoose.model(
  'trme_rice_price',
  RicePricePredict,
  'trme_rice_price_all'
);

const codedef = mongoose.model('code_definition', codeDif, 'code_definition');

const user = User.userModel;
const farm = Farm.farmModel;
// const Ricepricepredict = RicePricePredict.ricepricepredictModel;

function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj;
  return Object.keys(obj).reduce(
    function (acc, key) {
      acc[key.trim()] =
        typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}

async function varieties_eval_only(req, res, next) {
  console.log('request varieties evaluation');
  var variriesName = await Varieties.find().select([
    'ID',
    'rice_varieties_name',
  ]);
  variriesName = JSON.stringify(variriesName);
  variriesName = trimObj(variriesName);
  const obj = JSON.parse(variriesName);

  const { province, varietie, evaltype, startDate } = req.body;

  const data = await ai.predict_tl(province, varietie, evaltype, startDate);
  //var result = AIdemo;
  var result = data;
  var ret = [{}];
  var v = [{}];

  for (let index = 0; index < result.length; index++) {
    var __FOUND = obj.find(function (post, index1) {
      if (post.ID == result[index].varieties) {
        return true;
      }
    });
    ret[index] = {
      name: __FOUND.rice_varieties_name, // ชื่อพันธุ์ข้าว
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
      timeline: await timeline(result[index].timeline),
    };
  }
  res.json(ret);
}

async function timeline(timelineOrder) {
  const activity1 = await codedef.find();
  var package = [{}];

  let i, j, k;
  for (i in timelineOrder) {
    var count1 = 0;
    var count2 = 0;

    var activities = [{}];
    for (j in timelineOrder[i].activities) {
      if (timelineOrder[i].activities[j].code_type == 1) {
        count1++;
      }
      if (timelineOrder[i].activities[j].code_type == 2) {
        count2++;
      }

      var array_code = [{}];
      for (k in timelineOrder[i].activities[j].array_code) {
        var __FOUND = activity1.find(function (post, index) {
          if (post.code == timelineOrder[i].activities[j].array_code[k].code)
            return true;
        });

        array_code[k] = {
          activityCode: timelineOrder[i].activities[j].array_code[k].code,
          activity: __FOUND.definition,
          picture: timelineOrder[i].activities[j].array_code[k].picture_url,
          activate: timelineOrder[i].activities[j].array_code[k].activate,
        };
      }

      activities[j] = {
        code_type: timelineOrder[i].activities[j].code_type,
        array_code: array_code,
      };
    }

    package[i] = {
      order: timelineOrder[i].order,
      activitiesDate: timelineOrder[i].activitiesDate,
      caption: timelineOrder[i].caption,
      status: timelineOrder[i].status,
      timelineType: timelineOrder[i].timelineType,
      activities,
      activityLenght: count1,
      warningLenght: count2,
    };
  }
  return package;
}

async function farm_create(req, res, next) {
  console.log('require create new farm');
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
  await farmdata.save().then(() => {
    console.log('New farm have been created');
  });

  // console.log(uid);
  // console.log(farmdata);

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

  // console.log(uid);
  // console.log(farmdata);
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
}

async function farm_informationByname(req, res, next) {
  // read farm to profile

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

async function farm_create_note(req, res, next) {
  const { fid, order, noteDate, content, photo, cost } = req.body;

  console.log('request create note at farm id ', fid);

  if (!fid || !order) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  const note = {
    order,
    noteDate,
    content,
    photo,
    cost,
  };

  farm
    .findOneAndUpdate({ _id: fid }, { $push: { note: note } }, { new: true })
    .then((farmData) => {
      if (!farmData)
        return res.json({ status: 'fail', msg: 'ไม่สามารถแก้ไขข้อมูลได้' });

      res.json({
        status: 'success',
        note: farmData.note,
      });
    });
}

async function farm_get_note(req, res, next) {
  const { fid } = req.body;

  console.log('request load note at farm id ', fid);

  if (!fid) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  farm.findOne({ _id: fid }).then((farmData) => {
    if (!farmData)
      return res.json({ status: 'fail', msg: 'ไม่สามารถแก้ไขข้อมูลได้' });

    res.json({
      status: 'success',
      note: farmData.note,
    });
  });
}

async function farm_update_note(req, res, next) {
  const { fid, nid, order, noteDate, content, photo, cost } = req.body;

  console.log('request update note at farm id ', fid, 'note id ', nid);

  if (!fid || !nid) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  farm
    .findOneAndUpdate(
      { _id: fid, 'note._id': nid },
      {
        'note.$.order': order,
        'note.$.noteDate': noteDate,
        'note.$.content': content,
        'note.$.photo': photo,
        'note.$.cost': cost,
      },
      { new: true }
    )
    .then((farmData) => {
      if (!farmData)
        return res.json({ status: 'fail', msg: 'ไม่สามารถแก้ไขข้อมูลได้' });

      res.json({
        status: 'success',
        note: farmData.note,
      });
    });
}

async function farm_delete_note(req, res, next) {
  const { fid, nid } = req.body;

  console.log('request delete note at farm id ', fid, 'note id ', nid);

  if (!fid || !nid) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  farm
    .updateMany(
      { _id: fid },
      {
        $pull: { note: { _id: nid } },
      },
      { new: true }
    )
    .then((farmData) => {
      if (!farmData)
        return res.json({ status: 'fail', msg: 'ไม่สามารถแก้ไขข้อมูลได้' });

      res.json({
        status: 'success',
        note: farmData,
      });
    });
}

async function farm_update_activity_timeline(req, res, next) {
  console.log('request farm update activity in timeline');

  const { fid, activitiesDate, activities } = req.body;
  try {
    await farm
      .findOneAndUpdate(
        {
          _id: fid,
          'timeline.activitiesDate': activitiesDate,
        },
        {
          $set: { 'timeline.$.status': 1, 'timeline.$.activities': activities },
        },
        {
          new: true,
        }
      )
      .then((farmData) => {
        if (!farmData) {
          console.log('Update activities fail');
          return res.json({
            status: 'fail',
            msg: 'ไม่สามารถแก้ไขข้อมูลได้',
          });
        }

        console.log('Update activities success');
        res.json({
          status: 'success',
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
}

async function rice_price_predict(req, res, next) {
  console.log('request rice price prediction');
  var thisday = new Date();

  const data = await Ricepricepredict.find();
  var RicrPricedata = JSON.stringify(data);
  RicrPricedata = trimObj(RicrPricedata);
  const obj = JSON.parse(RicrPricedata);

  var month;
  var current_month =
    dateFormat(thisday.setDate(1), 'isoDate').toString() + 'T00:00:00.000Z';

  let rice_price_predict = [{}];
  let count = 0;
  for (let i in obj) {
    for (let j in obj[i].rice_price_predict) {
      month = obj[i].rice_price_predict[j].month.toString();

      if (current_month == month) {
        rice_price_predict[count] = {
          type: obj[i].rice_price_type,
          name: obj[i].rice_price_name,
          month: obj[i].rice_price_predict[j].month,
          price: {
            Value: obj[i].rice_price_predict[j].price,
            Unit: 'บาท/ตัน',
          },
        };
        count++;
      }
    }
  }

  return res.json({
    status: 'success',
    rice_price_predict,
  });
}

async function rice_price_predict_interval(req, res, next) {
  console.log('request rice price prediction interval');

  const { rice_ID, startMonth, Endmonth } = req.body;

  var start_month = dateFormat(startMonth, 'isoDate');
  var end_month = dateFormat(Endmonth, 'isoDate');

  var riceVarities = await Varieties.findOne({ ID: rice_ID }).select([
    'ID',
    'rice_price_type',
    'rice_varieties_name',
  ]);

  riceVarities = JSON.stringify(riceVarities);
  riceVarities = trimObj(riceVarities);
  const riceVaritiesObj = JSON.parse(riceVarities);

  var ricePrice = await Ricepricepredict.findOne({
    rice_price_type: riceVaritiesObj.rice_price_type,
  });

  ricePrice = JSON.stringify(ricePrice);
  ricePrice = trimObj(ricePrice);
  const ricePriceObj = JSON.parse(ricePrice);

  let rice_price_predict = [{}];
  let count = 0;

  for (let i in ricePriceObj.rice_price_predict) {
    var priceMonth = dateFormat(
      ricePriceObj.rice_price_predict[i].month,
      'isoDate'
    );
    if (priceMonth >= start_month && priceMonth <= end_month) {
      rice_price_predict[count] = {
        type: ricePriceObj.rice_price_type,
        name: ricePriceObj.rice_price_name,
        month: ricePriceObj.rice_price_predict[i].month,
        price: {
          Value: ricePriceObj.rice_price_predict[i].price,
          Unit: 'บาท/ตัน',
        },
      };
      count++;
    }
  }
  return res.json({
    status: 'success',
    rice_price_predict,
  });
}

async function farm_result_evaluation(req, res, next) {
  console.log('request farm result evaluation');

  const { fid, cost, product, price, profit } = req.body;
  var { humidity } = req.body;
  var province_id = 0;
  if (humidity == 0 || typeof humidity === null) {
    humidity = 15;
  }

  // const data = await farm.findById({ _id: fid });
  await farm.findById({ _id: fid }).then((data) => {
    if (data) {
      if (data.location.province === null) {
        province_id = 0;
      }

      const rice_id = data.varieties;
      const evalproduct = {
        evalproduct: {
          cost: {
            value: cost,
            status: data.evalproduct.cost.status,
          },
          product: {
            value: product,
            status: data.evalproduct.product.status,
          },
          price: {
            value: price,
            status: data.evalproduct.price.status,
          },
          profit: {
            value: profit,
            status: data.evalproduct.profit.status,
          },
        },
      };

      ai.resultEvaluate(province_id, rice_id, JSON.stringify(evalproduct)).then(
        (evalproductResult) => {
          console.log(evalproductResult);
          console.log(evalproductResult.evalproduct);

          const resultproduct = {
            humidity: humidity,
            cost: evalproductResult.evalproduct.cost,
            product: evalproductResult.evalproduct.product,
            price: evalproductResult.evalproduct.price,
            profit: evalproductResult.evalproduct.profit,
          };

          farm
            .updateOne(
              { _id: fid },
              {
                resultproduct,
              }
            )
            .then(() => {
              return res.json({
                status: 'success',
                resultproduct,
              });
            });
        }
      );
    } else {
      return res.json({
        status: 'fail',
        msg: 'ไม่มีฟาร์มที่เลือก',
      });
    }
  });
}

async function farm_delete(req, res, next) {
  console.log('request delete farm');

  const { uid, fid } = req.body;

  await user
    .findOneAndUpdate(
      { _id: uid },
      { $pullAll: { farms: [fid] } },
      { new: true }
    )
    .then((userData) => {
      if (userData) {
        farm
          .findByIdAndUpdate({ _id: fid }, { activate: 'end' }, { new: true })
          .then((farmData) => {
            if (farmData) {
              return res.json({
                status: 'success',
              });
            }
          });
      } else {
        return res.json({
          status: 'fail',
          msg: 'ไม่สามารถแก้ไขข้อมูลได้',
        });
      }
    });
}

module.exports.varieties_eval_only = varieties_eval_only;
module.exports.farm_create = farm_create;
module.exports.varieties_get_name = varieties_get_name;
module.exports.farm_create_tl = farm_create_tl;
module.exports.farm_information = farm_information;
module.exports.farm_informationByname = farm_informationByname;
module.exports.farm_create_note = farm_create_note;
module.exports.farm_get_note = farm_get_note;
module.exports.farm_update_note = farm_update_note;
module.exports.farm_delete_note = farm_delete_note;
module.exports.farm_update_activity_timeline = farm_update_activity_timeline;
module.exports.rice_price_predict = rice_price_predict;
module.exports.rice_price_predict_interval = rice_price_predict_interval;
module.exports.farm_result_evaluation = farm_result_evaluation;
module.exports.farm_delete = farm_delete;
