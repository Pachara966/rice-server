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

  const uid = await user.find({}, '_id');
  for (let uIndex in uid) {
    const farms = await user.findById(uid[uIndex]).populate('farms');
    const farmData = farms.farms;
    // console.log(farmData);
    for (let i in farmData) {
      for (let j in farmData[i].timeline) {
        var dateDB = farmData[i].timeline[j].activitiesDate;
        console.log('date', dateDB);
        var DateDB = dateFormat(dateDB.setDate(dateDB.getDate()), 'isoDate');
        var status = farmData[i].timeline[j].status;
        var tlid = farmData[i].timeline[j]._id;
        console.log('Timeline ID ', tlid);
        var fid = farmData[i]._id;
        console.log('fid : ', fid);
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
