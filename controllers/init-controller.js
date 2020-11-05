const connectDB = require('../connectdb');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const AIdemo = require('../temp/eval_demo.json');
const ai = require('./ai-controller');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
var dateFormat = require('dateformat');

const user = User.userModel;
const farm = Farm.farmModel;

async function farm_begin_process() {
  const farmsWait = await farm.find({ activate: 'wait' });
  for (let index = 0; index < farmsWait.length; index++) {
    const element = Date.now();
    if (element == farmsWait[index].startDate) {
      await farm.findOneAndUpdate(
        { _id: farmsWait[index]._id },
        {
          activate: 'process',
        }
      );
    }
  }
}

async function midnight_demo(req, res, next) {
  // Update Timeline farm and feed
  await connectDB.connect_db();
  // user
  const uid = req.body.uid; //req.body.uid;
  const today = req.body.today;
  const u = await user.findOne({ _id: uid }).populate('farms');
  const farms = u.farms;
  const feeds = u.feeds;
  // wait --> process
  //farm_begin_process();
  // update timelinePast
  /*
  select tlf[0] to tlp[final]
  select tlf[1-final] to old_timeline
  use old_timeline for input update timelineFuture
    condition
      activate == "process"
  */
  console.log(feeds);
  console.log('update timelineFuture');
  //const farms = await farm.find();
  //console.log(farms);
  //var now = new Date();
  var packet = [];
  var old_timeline = [];
  var timeline = [];
  var evalproduct = [];
  var province_id = [];
  var rice_id = [];
  var start_date = [];
  var current_date =
    dateFormat(today, 'isoDate').toString() +
    'T' +
    dateFormat(today, 'isoTime').toString() +
    '.000Z'; //var current_date = dateFormat(now, "isoUtcDateTime");
  var next_day = [];
  var test_mode = 1;
  var test_data = 0;
  var new_timeline = [];
  //var feed = [];
  await user.updateOne(
    { _id: uid },
    {
      $set: { feed: [] },
    }
  );
  for (let i = 0; i < farms.length; i++) {
    var now = new Date();
    if (today == farms[i].timelineFuture[0].activitiesDate || test_mode) {
      await farm.updateOne(
        { _id: farms[i]._id },
        { $push: { timelinePast: farms[i].timelineFuture[0] } }
      );
    }
    for (let j = 1; j < farms[i].timelineFuture.length; j++) {
      timeline[j - 1] = {
        order: farms[i].timelineFuture[j].order,
        activitiesDate: farms[i].timelineFuture[j].activitiesDate,
        activities: farms[i].timelineFuture[j].activities,
        bugs: farms[i].timelineFuture[j].bugs,
      };
    }
    next_day[i] = timeline[0].order;
    province_id[i] = farms[i].location.province;
    rice_id[i] = farms[i].varieties;
    start_date[i] =
      dateFormat(farms[i].startDate, 'isoDate').toString() +
      'T' +
      dateFormat(farms[i].startDate, 'isoTime').toString() +
      '.000Z';
    evalproduct[i] = farms[i].evalproduct;
    old_timeline[i] = {
      evalproduct: evalproduct[i],
      timelineFuture: timeline,
    };
    /* var current_date =
      dateFormat(now.setDate(now.getDate() + 1), "isoDate").toString() +
      "T" +
      dateFormat(now.setDate(now.getDate() + 1), "isoTime").toString() +
      ".000Z";*/

    packet[i] = {
      next_day: next_day[i],
      province_id: province_id[i],
      rice_id: rice_id[i],
      start_date: start_date[i],
      old_timeline: old_timeline[i],
      current_date: current_date,
      test_mode: test_mode,
      test_data: test_data,
    };
    new_timeline[i] = await ai.update_tl(
      province_id[i],
      rice_id[i],
      start_date[i],
      current_date,
      next_day[i],
      JSON.stringify(old_timeline[i]),
      test_mode,
      test_data
    );
    await farm.updateOne(
      { _id: farms[i]._id },
      { $pop: { timelineFuture: -1 } }
    );
    await farm.updateOne(
      { _id: farms[i]._id },
      {
        $set: {
          evalproduct: new_timeline[i].evalproduct,
          timelineFuture: new_timeline[i].timelineFuture,
        },
      }
    );

    for (let k = 0; k < new_timeline[i].timelineFuture.length; k++) {
      var thisday = new Date();
      var week =
        dateFormat(
          thisday.setDate(thisday.getDate() + 7),
          'isoDate'
        ).toString() +
        'T' +
        dateFormat(
          thisday.setDate(thisday.getDate() + 7),
          'isoTime'
        ).toString() +
        '.000Z';
      if (week > new_timeline[i].timelineFuture[k].activitiesDate) {
        console.log(farms[i].name);
        console.log(k + 1);
        var activitiesCode = new_timeline[i].timelineFuture[k].activities.map(
          (ele) => ele.code
        );
        var bugsCode = new_timeline[i].timelineFuture[k].bugs.map(
          (ele) => ele.code
        );
        var content = activitiesCode.concat(bugsCode);

        var feed = {
          name: farms[i].name,
          feedType: 'farm',
          feedDate: new_timeline[i].timelineFuture[k].activitiesDate,
          content: content,
          active: false,
        };

        console.log(feed);
        await user.updateOne(
          { _id: uid },
          {
            $push: {
              feed: feed,
            },
          }
        );
      }
    }
  }

  /*console.log("res update timelineFuture 1");

  console.log(packet);
  console.log("res update timelineFuture 3");
  console.log(new_timeline);
  console.log(feed);*/
  let ret = { feed: feed, data: new_timeline, status: 'ok' };

  res.send(ret);
}

async function midnight(req, res, next) {
  await connectDB.connect_db();
  // wait --> process
  farm_begin_process();
  // update timelinePast
  /*
  select tlf[0] to tlp[final]
  select tlf[1-final] to old_timeline
  use old_timeline for input update timelineFuture
    condition
      activate == "process"
  */
  console.log('update timelineFuture');
  const farms = await farm.find();
  console.log(farms);
  //var now = new Date();
  var packet = [];
  var old_timeline = [];
  var timeline = [];
  var evalproduct = [];
  var province_id = [];
  var rice_id = [];
  var start_date = [];
  var current_date; //var current_date = dateFormat(now, "isoUtcDateTime");
  var next_day = [];
  var test_mode = 1;
  var test_data = 0;
  var new_timeline = [];

  for (let i = 0; i < farms.length; i++) {
    var now = new Date();
    for (let j = 1; j < farms[i].timelineFuture.length; j++) {
      timeline[j - 1] = {
        order: farms[i].timelineFuture[j].order,
        activitiesDate: farms[i].timelineFuture[j].activitiesDate,
        activities: farms[i].timelineFuture[j].activities,
        bugs: farms[i].timelineFuture[j].bugs,
      };
    }
    next_day[i] = timeline[0].order;
    province_id[i] = farms[i].location.province;
    rice_id[i] = farms[i].varieties;
    start_date[i] =
      dateFormat(farms[i].startDate, 'isoDate').toString() +
      'T' +
      dateFormat(farms[i].startDate, 'isoTime').toString() +
      '.000Z';
    evalproduct[i] = farms[i].evalproduct;
    old_timeline[i] = {
      evalproduct: evalproduct[i],
      timelineFuture: timeline,
    };
    current_date =
      dateFormat(now.setDate(now.getDate() + 1), 'isoDate').toString() +
      'T' +
      dateFormat(now.setDate(now.getDate() + 1), 'isoTime').toString() +
      '.000Z';

    packet[i] = {
      next_day: next_day[i],
      province_id: province_id[i],
      rice_id: rice_id[i],
      start_date: start_date[i],
      old_timeline: old_timeline[i],
      current_date: current_date,
      test_mode: test_mode,
      test_data: test_data,
    };
    new_timeline[i] = await ai.update_tl(
      province_id[i],
      rice_id[i],
      start_date[i],
      current_date,
      next_day[i],
      JSON.stringify(old_timeline[i]),
      test_mode,
      test_data
    );
  }
  console.log('res update timelineFuture 1');

  console.log(packet);
  console.log('res update timelineFuture 3');
  console.log(new_timeline);
  console.log(dateFormat(now, 'isoUtcDateTime'));
  let ret = new_timeline;
  res.send(ret);
}

async function init_data(req, res, next) {
  console.log('request initial user data');

  const _id = req.body;

  const farms = await user.findOne(_id).populate('farms');
  const feed = await user.findOne(_id).populate('feed');

  user.findById(_id, '-password', (error, userInfo) => {
    if (error) {
      return res.json({ status: 'fail', msg: 'ไม่พบข้อมูลผู้ใช้งาน' });
    }
    if (userInfo) {
      res.json({
        status: 'success',
        userData: {
          uid: userInfo._id,
          name: userInfo.name,
          surname: userInfo.surname,
          phonenumber: userInfo.phonenumber,
          address: userInfo.address,
        },
        farms: farms,
        feed: feed,
      });
    } else {
      return res.json({ status: 'fail', msg: 'ไม่พบข้อมูลผู้ใช้งาน' });
    }
  });
}

module.exports.init_data = init_data;
module.exports.midnight = midnight;
module.exports.midnight_demo = midnight_demo;
