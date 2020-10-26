const connectDB = require("./connectdb");
const User = require("./models/userSchema");
const Farm = require("./models/farmSchema");
const Feed = require("./models/feedSchema");
async function createCollection() {
  connectDB.connect_db();
  User.userModel.createCollection().then(function (collection) {
    console.log("User Collection is created!");
  });
  Farm.farmModel.createCollection().then(function (collection) {
    console.log("Farm Collection is created!");
  });
}

createCollection();
