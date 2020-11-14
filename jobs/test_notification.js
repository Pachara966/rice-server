const User = require('../models/userSchema');
// const Farm = require('../models/FarmSchema');
const user = User.userModel;
// const farm = Farm.farmModel;
const connectDB = require('../connectdb');
const mongoose = require('mongoose');

const _id = '5fa849904fe4aa0f6c70b585';
var dateFormat = require('dateformat');
var today = new Date();
var toDay = dateFormat(today.setDate(today.getDate()), 'isoDate');
var oneWeek = dateFormat(today.setDate(today.getDate() + 14), 'isoDate');

notification(_id);

async function notification(_id) {
  await connectDB.connect_db();
  const farms = await user.findById(_id).populate('farms');
  const farmData = farms.farms;

  var activities = [{}];
  var warning = [{}];
  let countActivities = 0;
  let countWarning = 0;
  for (let i in farmData) {
    for (let j in farmData[i].timeline) {
      var dateDB = farmData[i].timeline[j].activitiesDate;
      var DateDB = dateFormat(dateDB.setDate(dateDB.getDate()), 'isoDate');

      if (DateDB == toDay) {
        console.log('Date from DB ', DateDB);
        activities[countActivities] = {
          fid: farmData[i]._id,
          fname: farmData[i].name,
          activitiesDate: farmData[i].timeline[j].activitiesDate,
          activityLenght: farmData[i].timeline[j].activityLenght,
        };
        countActivities++;
      }

      if (DateDB >= toDay && DateDB <= oneWeek) {
        console.log('Date from DB ', DateDB);
        warning[countWarning] = {
          fid: farmData[i]._id,
          fname: farmData[i].name,
          activitiesDate: farmData[i].timeline[j].activitiesDate,
          activityLenght: farmData[i].timeline[j].warningLenght,
        };
        countWarning++;
      }
    }
  }
  console.log('farmData');
  console.log('activities', activities);
  console.log('warning', warning);
  // console.log('Today ', toDay);
  // console.log('Week ', oneWeek);
  //   var today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   console.log('today ', today);

  //   var localDate = new Date(farmData[0].timeline[0].activitiesDate);
  //   localDate.setHours(0, 0, 0, 0);
  //   console.log('today ', localDate);

  //   d = farmData[0].timeline[0].activitiesDate;
  //   d.setHours(0, 0, 0, 0);
  //   console.log('==== ', d);

  // if (DateDB < oneWeek) {
  //   console.log('d is greater than or equal to current date');
  // }
  mongoose.connection.close();
}
