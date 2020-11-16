const mongoose = require('mongoose');
const connectDB = require('../connectdb');
const Feed = require('../models/feedSchema');

const feeds = Feed.feedModel;

var dateFormat = require('dateformat');
var today = new Date();
var Day = dateFormat(today.setDate(today.getDate()), 'isoDate');

addFeed();

async function addFeed() {
  await connectDB.connect_db();

  const dataFeed = new feeds({
    feedPicture:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.egov.go.th%2Fth%2Fgovernment-agency%2F296%2F&psig=AOvVaw19J24yXuNcgtu0we93SAbz&ust=1605596685195000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCICak_O_hu0CFQAAAAAdAAAAABAJ',
    farmID: '',
    name: 'กรมการข้าว',
    order: 4,
    activitiesDate: Day,
    caption: '',
    status: 'false',
    feedType: 2,
    activities: [
      {
        code_type: 0,
        array_code: [
          {
            activityCode: 304,
            activity: 'ทดสอบ4',
            picture: '',
            activate: false,
          },
        ],
      },
    ],
    activityLenght: 0,
    warningLenght: 0,
  });

  await dataFeed.save();

  mongoose.connection.close();
}
