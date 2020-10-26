const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema({
  name: String,
  surname: String,
  phonenumber: { type: String, unique: true },
  password: String,
  address: {
    formattedAddress: String,
    province: Number,
    latt: Number, // or String
    long: Number, // or String
  },
  farms: [
    {
      type: schema.Types.ObjectId,
      ref: "farms",
    },
  ],
  feed: [
    {
      name: String,
      feedType: {
        type: String,
        enum: ["farm", "operation"],
      },
      feedDate: Date,
      content: [String],
      active: Boolean,
    },
  ],
  active: { type: Boolean, default: true },
});

module.exports.userModel = mongoose.model("users", userSchema);
