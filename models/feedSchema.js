const mongoose = require("mongoose");
const schema = mongoose.Schema;
const feedSchema = new schema({
  users: {
    type: schema.Types.ObjectId,
    ref: "users",
  },
  farmfeed: [
    {
      type: schema.Types.ObjectId,
      ref: "farms",
    },
  ], //farm timeline
  operationfeed: [
    {
      feedDate: Date,
      feedData: String,
    },
  ], // operation feed
});

module.exports.feedModel = mongoose.model("feed", feedSchema);
