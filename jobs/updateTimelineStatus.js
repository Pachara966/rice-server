const mongoose = require('mongoose');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const user = User.userModel;
const farm = Farm.farmModel;
const connectDB = require('../connectdb');

var dateFormat = require('dateformat');
var today = new Date();
var toDay = dateFormat(today.setDate(today.getDate()), 'isoDate');
var oneWeek = dateFormat(today.setDate(today.getDate() + 7), 'isoDate');

console.log(toDay);
updateTimelineStatus();

async function updateTimelineStatus() {
  console.log('request update timeline status');

  await connectDB.connect_db();

  const farmID = await farm.find().select(['_id']);

  for (let i in farmID) {
    const farmData = await farm.find({ _id: farmID[i] });

    if (farmData[0].timeline.length > 1 && farmData[0].activate !== 'end') {
      for (let j in farmData[0].timeline) {
        var dateDB = farmData[0].timeline[j].activitiesDate;
        var DateDB = dateFormat(dateDB.setDate(dateDB.getDate()), 'isoDate');
        var status = farmData[0].timeline[j].status;
        var tlid = farmData[0].timeline[j]._id;
        var fid = farmData[0]._id;
        console.log('\nFarm ID : ', fid, ' Farm name : ', farmData[0].name);
        if (DateDB < toDay && status != '1') {
          // status = 2
          console.log('Date : ', DateDB, 'status : 2');
          await farm.findOneAndUpdate(
            { _id: fid, 'timeline._id': tlid },
            {
              $set: { 'timeline.$.status': '2' },
            }
          );
        }
        if (DateDB >= toDay && DateDB <= oneWeek) {
          // status = 3
          console.log('Date : ', DateDB, 'status : 3');
          await farm.findOneAndUpdate(
            { _id: fid, 'timeline._id': tlid },
            {
              $set: { 'timeline.$.status': '3' },
            }
          );
        }
        if (DateDB > oneWeek) {
          // status = 4
          console.log('Date : ', DateDB, 'status : 4');
          await farm.findOneAndUpdate(
            { _id: fid, 'timeline._id': tlid },
            {
              $set: { 'timeline.$.status': '4' },
            }
          );
        }
      }
    }
  }

  mongoose.connection.close();
}
