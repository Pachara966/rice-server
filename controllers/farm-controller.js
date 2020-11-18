const connectDB = require('../connectdb');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const AIdemo = require('../temp/eval_demo.json');

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const CodeDif = require('../models/codeDefSchema');
const codeDif = CodeDif.codeDefModel;

const ai = require('./ai-controller');
const varieties = require('../models/ricevaritiesSchema');
// const varieties = new schema({
//   ID: Number,
//   rice_varieties_name: String,
// });

const Varieties = mongoose.model(
  'rice_varieties1',
  varieties,
  'rice_varieties_data'
);

const codedef = mongoose.model('code_definition', codeDif, 'code_definition');

const user = User.userModel;
const farm = Farm.farmModel;

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

async function farm_create_note(req, res, next) {
  const { fid, order, noteDate, content, photo, cost } = req.body;

  console.log('request create note at farm id ', fid);

  if (!fid || !order) {
    return res.json({ status: 'fail', msg: 'กรอกข้อมูลให้ครบทุกช่อง' });
  }

  const note = {
    order,
    noteDate,
    content, // or String
    photo, // or String
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

module.exports.varieties_eval_only = varieties_eval_only;
module.exports.farm_create = farm_create;
module.exports.varieties_get_name = varieties_get_name;
module.exports.farm_create_tl = farm_create_tl;
module.exports.farm_information = farm_information;
module.exports.farm_remove = farm_remove;
module.exports.farm_informationByname = farm_informationByname;
module.exports.farm_create_note = farm_create_note;
module.exports.farm_get_note = farm_get_note;
module.exports.farm_update_note = farm_update_note;
module.exports.farm_delete_note = farm_delete_note;
module.exports.farm_update_activity_timeline = farm_update_activity_timeline;
