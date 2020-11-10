const User = require('../models/userSchema');
const user = User.userModel;
const connectDB = require('../connectdb');
const Farm = require('../models/FarmSchema');
const farm = Farm.farmModel;
var dateFormat = require('dateformat');
var today = new Date();
var DateTime =
  dateFormat(today.setDate(today.getDate()), 'isoDate').toString() +
  'T' +
  dateFormat(today.setDate(today.getDate()), 'isoTime').toString() +
  '.000Z';

// var week =
// dateFormat(today.setDate(today.getDate() + 7), 'isoDate').toString() +
// 'T' +
// dateFormat(today.setDate(today.getDate() + 7), 'isoTime').toString() +
// '.000Z';

updateTimelineStatus();

async function updateTimelineStatus() {
  await connectDB.connect_db();
  const farmData = await farm.find({}).select(['_id', 'timeline', 'activate']);
  console.log('มีทั้งหมด ', farmData.length, ' farm');
  console.log(DateTime);
  // let countWait = 0;

  // for (index in farmData) {
  //   if (farmData[index].activate == 'wait') {
  //     countWait++;
  //   }
  // }
  // console.log('count wait = ', countWait);
  return true;
}
