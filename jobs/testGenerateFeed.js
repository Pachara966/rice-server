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

  mongoose.connection.close();
}
