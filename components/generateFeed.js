const Feed = require('../models/feedSchema');
const User = require('../models/userSchema');
const Farm = require('../models/FarmSchema');
const user = User.userModel;
const feeds = Feed.feedModel;
const farm = Farm.farmModel;

async function generateFeed(_id) {
  console.log('request feed  User : ', await user.findById(_id).select('name'));

  const farms = await user.findById(_id).populate('farms');
  const farmData = farms.farms;
  const feed = await feeds.find().select('-_id -__v');

  var feedsData = [{}];
  var count1 = 0;

  for (let i in farmData) {
    for (let j in farmData[i].timeline) {
      var farmStatus = farmData[i].timeline[j].status;
      if (farmStatus == '2' || farmStatus == '3') {
        feedsData[count1] = {
          feedPicture: farmData[i].timeline[j].farmPicture,
          farmID: farmData[i]._id,
          name: farmData[i].name,
          order: count1 + 1,
          activitiesDate: farmData[i].timeline[j].activitiesDate,
          caption: farmData[i].timeline[j].caption,
          status: farmData[i].timeline[j].status,
          feedType: farmData[i].timeline[j].timelineType,
          activities: farmData[i].timeline[j].activities,
          activityLenght: farmData[i].timeline[j].activityLenght,
          warningLenght: farmData[i].timeline[j].warningLenght,
        };
        count1++;
      }
    }
  }
  for (let i in feed) {
    feedsData[count1] = {
      feedPicture: feed[i].feedPicture,
      farmID: feed[i].farmID,
      name: feed[i].name,
      order: count1 + 1,
      activitiesDate: feed[i].activitiesDate,
      caption: feed[i].caption,
      status: feed[i].status,
      feedType: feed[i].feedType,
      activities: feed[i].activities,
      activityLenght: feed[i].activityLenght,
      warningLenght: feed[i].warningLenght,
    };
    count1++;
  }
  return feedsData;
}

module.exports.generateFeed = generateFeed;
