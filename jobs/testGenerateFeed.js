const mongoose = require('mongoose');
const connectDB = require('../connectdb');
const Feed = require('../models/feedSchema');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const user = User.userModel;
const feeds = Feed.feedModel;
const farm = Farm.farmModel;

var dateFormat = require('dateformat');
var today = new Date();
var week = dateFormat(today.setDate(today.getDate() + 8), 'isoDate');

const _id = '5fa8c44b4fe4aa0f6c70b649';

addFeed(_id);

async function addFeed(_id) {
  await connectDB.connect_db();

  const farms = await user.findById(_id).populate('farms');
  const farmData = farms.farms;
  const feed = await feeds.find();

  var feedsData = [{}];
  var count1 = 0;
  var count2 = 0;

  for (let i in farmData) {
    var activities = [{}];
    count1 = 0;
    for (let j in farmData[i].timeline) {
      var farmStatus = farmData[i].timeline[j].status;
      if (farmStatus == '2' || farmStatus == '3') {
        activities[count1] = {
          feedPicture: farmData[i].timeline[j].farmPicture,
        };
        count1++;
        console.log(feedsData);
      }
    }
    // feedsData[count]={
    //     feedPicture:farmData[i].timeline[j].farmPicture,
    //     farmID:
    //  }
    //  count++
  }

  mongoose.connection.close();
}
