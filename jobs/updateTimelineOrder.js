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
  const farmID = await farm.find({}).select(['_id']);

  for (let i in farmID) {
    const farmData = await farm.find({ _id: farmID[i] });
    console.log(
      '\nFarm ID : ',
      farmData[0]._id,
      ' Farm name : ',
      farmData[0].name,
      'is updating timeline order'
    );

    var nextday = '';
    var timeline = [{}];
    var newTimeline;
    let count = 0;

    if (
      typeof farmData[0].timeline !== null &&
      farmData[0].timeline.length > 1 &&
      farmData[0].location.province !== null &&
      farmData[0].activate !== 'end'
    ) {
      for (let j in farmData[0].timeline) {
        var status = farmData[0].timeline[j].status;
        if (status == '3') {
          nextday = farmData[0].timeline[j].order;
          break;
        }
      }
      for (let j in farmData[0].timeline) {
        var status = farmData[0].timeline[j].status;
        if (status == '3' || status == '4') {
          (timeline[count] = farmData[0].timeline[j]), count++;
        }
      }
      const old_timeline = {
        evalproduct: farmData[0].evalproduct,
        timeline,
      };
      var province_id = farmData[0].location.province;
      var rice_id = farmData[0].varieties;
      var start_date =
        dateFormat(farmData[0].startDate, 'isoDate').toString() +
        'T' +
        dateFormat(farmData[0].startDate, 'isoTime').toString() +
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
      for (let j in farmData[0].timeline) {
        var status = farmData[0].timeline[j].status;
        if (status == '1' || status == '2') {
          new_Timeline[count1] = farmData[0].timeline[j];
          count1++;
        }
      }
      for (let j in newTimeline.timeline) {
        new_Timeline[count1] = newTimeline.timeline[j];
        count1++;
      }
      var newEvalproduct = newTimeline.evalproduct;
      await farm.updateOne(
        { _id: farmData[0]._id },
        { $pullAll: { timeline } }
      );
      await farm
        .findOneAndUpdate(
          { _id: farmData[0]._id },
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
            farmData[0]._id,
            'have already updated timeline order\n'
          )
        );
    } else {
      console.log(
        'farm ID ',
        farmData[0]._id,
        'not found timeline order or farm location\n'
      );
    }
  }

  mongoose.connection.close();
}
