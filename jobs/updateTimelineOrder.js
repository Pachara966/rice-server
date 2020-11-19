const mongoose = require('mongoose');
const connectDB = require('../connectdb');
const config = require('config');
const dateFormat = require('dateformat');
const Farm = require('../models/FarmSchema');
const farm = Farm.farmModel;
const _AI = require('../controllers/ai-controller');

const AIurl = config.get('AIurl');

var today = new Date();
var current_date =
  dateFormat(today, 'isoDate').toString() +
  'T' +
  dateFormat(today, 'isoTime').toString() +
  '.000Z';
var oneWeek = dateFormat(today.setDate(today.getDate() + 7), 'isoDate');

updateTimelineOrder();

async function updateTimelineOrder() {
  console.log('request update timeline order');

  await connectDB.connect_db();
  const farmData = await farm.find({});

  var nextday = '';
  var timeline = [{}];
  var newTimeline;
  let count = 0;

  for (let i in farmData) {
    console.log(farmData[i].timeline.length);
    console.log('farm ID ', farmData[i]._id);
    if (
      typeof farmData[i].timeline !== null &&
      farmData[i].timeline.length > 1 &&
      farmData[i].location.province !== null
    ) {
      for (let j in farmData[i].timeline) {
        var status = farmData[i].timeline[j].status;
        if (status == '3') {
          nextday = farmData[i].timeline[j].order;
          break;
        }
      }
      for (let j in farmData[i].timeline) {
        var status = farmData[i].timeline[j].status;
        if (status == '3' || status == '4') {
          (timeline[count] = farmData[i].timeline[j]), count++;
        }
      }
      const old_timeline = {
        evalproduct: farmData[i].evalproduct,
        timeline,
      };
      var province_id = farmData[i].location.province;
      var rice_id = farmData[i].varieties;
      var start_date =
        dateFormat(farmData[i].startDate, 'isoDate').toString() +
        'T' +
        dateFormat(farmData[i].startDate, 'isoTime').toString() +
        '.000Z';
      var next_day = nextday;
      var test_mode = 1;
      var test_data = 2;
      newTimeline = await _AI.update_tl(
        province_id,
        rice_id,
        start_date,
        current_date,
        next_day,
        JSON.stringify(old_timeline),
        test_mode,
        test_data
      );
      var count1 = 0;
      var new_Timeline = [{}];
      for (let j in farmData[i].timeline) {
        var status = farmData[i].timeline[j].status;
        if (status == '1' || status == '2') {
          new_Timeline[count1] = farmData[i].timeline[j];
          count1++;
        }
      }
      for (let j in newTimeline.timeline) {
        new_Timeline[count1] = newTimeline.timeline[j];
        count1++;
      }
      var newEvalproduct = newTimeline.evalproduct;
      await farm.updateOne(
        { _id: farmData[i]._id },
        { $pullAll: { timeline } }
      );
      await farm
        .findOneAndUpdate(
          { _id: farmData[i]._id },
          {
            $set: {
              evalproduct: newEvalproduct,
              timeline: new_Timeline,
            },
          }
        )
        .then(
          console.log(
            'farm ID ',
            farmData[i]._id,
            'have already updated timeline order'
          )
        );
    } else {
      console.log('farm ID ', farmData[i]._id, 'not found timeline order');
    }
  }

  mongoose.connection.close();
}
