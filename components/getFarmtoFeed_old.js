const User = require('../models/userSchema');
var dateFormat = require('dateformat');

const user = User.userModel;

async function getfarmdatatofeed(uid, numOrder) {
  console.log('request farm data to feed');

  var today = new Date();
  var toDay = dateFormat(today.setDate(today.getDate()), 'isoDate');
  var oneWeek = dateFormat(today.setDate(today.getDate() + 7), 'isoDate');

  const farms = await user.findById(_id).populate('farms');
  const farmData = farms.farms;

  var feed = [{}];

  // for (let i in farmData) {
  //   for (let j in farmData[i].timeline) {
  //     var dateDB = farmData[i].timeline[j].activitiesDate;
  //     var DateDB = dateFormat(dateDB.setDate(dateDB.getDate()), 'isoDate');

  //     if (DateDB == toDay) {
  //       activities[countActivities] = {
  //         fid: farmData[i]._id,
  //         fname: farmData[i].name,
  //         activitiesDate: farmData[i].timeline[j].activitiesDate,
  //         activityLenght: farmData[i].timeline[j].activityLenght,
  //       };
  //       countActivities++;
  //     }

  //     if (DateDB >= toDay && DateDB <= oneWeek) {
  //       console.log('Date from DB ', DateDB);
  //       warning[countWarning] = {
  //         fid: farmData[i]._id,
  //         fname: farmData[i].name,
  //         activitiesDate: farmData[i].timeline[j].activitiesDate,
  //         activityLenght: farmData[i].timeline[j].warningLenght,
  //       };
  //       countWarning++;
  //     }
  //   }
  // }
  // notification = {
  //   activities,
  //   warning,
  // };

  return feed;
}

module.exports.getfarmdatatofeed = getfarmdatatofeed;
