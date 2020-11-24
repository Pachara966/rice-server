const mongoose = require('mongoose');
const connectDB = require('../connectdb');
const Farm = require('../models/FarmSchema');
const farm = Farm.farmModel;

totalFarm();

async function totalFarm() {
  console.log('request total farms');

  await connectDB.connect_db();

  const farmData = await farm.find().select(['_id']);
  console.log('Total farm : ', farmData.length);

  mongoose.connection.close();
}
