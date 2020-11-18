const mongoose = require('mongoose');
const Farm = require('../models/FarmSchema');
const farm = Farm.farmModel;
const connectDB = require('../connectdb');

var dateFormat = require('dateformat');
var today = new Date();
var nextDay = dateFormat(today.setDate(today.getDate() + 1), 'isoDate');

updateTimelineStatus();

async function updateTimelineStatus() {
  console.log('request update farm activate');

  await connectDB.connect_db();

  const farmData = await farm.find({ activate: 'wait' });
  console.log('wait ', farmData.length, ' farm ');

  for (let fIndex in farmData) {
    var farmStartDate = farmData[fIndex].startDate;
    // console.log(farmStartDate);
    if (farmStartDate) {
      farmStartDate = dateFormat(
        farmStartDate.setDate(farmStartDate.getDate()),
        'isoDate'
      );
      // console.log(farmStartDate);
      var fid = farmData[fIndex]._id;
      // console.log(fid);
      if (farmStartDate < nextDay) {
        await farm.findByIdAndUpdate(
          { _id: fid },

          { activate: 'process' }
        );
      }
    }
  }

  mongoose.connection.close();
}
