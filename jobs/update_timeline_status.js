const User = require('../models/userSchema');
const user = User.userModel;
const connectDB = require('../connectdb');

updateTimelineStatus();

async function updateTimelineStatus() {
  await connectDB.connect_db();
  const userID = await user.find({}).select(['_id']);
  console.log(userID);
  //for (index in userID) {
  user.findById({ _id: userID[0]._id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log('User _id : ', docs._id, ', Name : ', docs.name);
    }
  });
  // }
  return true;
}
