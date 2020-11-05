const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
  name: String,
  surname: String,
  phonenumber: { type: String, unique: true },
  password: String,
  address: {
    formattedAddress: { type: String, default: '' },
    province: { type: Number, default: 0 },
    latt: { type: Number, default: 0 }, // or String
    long: { type: Number, default: 0 }, // or String
  },
  farms: [
    {
      type: schema.Types.ObjectId,
      ref: 'farms',
    },
  ],
  feed: [
    {
      name: String,
      feedType: {
        type: String,
        enum: ['farm', 'operation'],
      },
      feedDate: Date,
      content: [String], // เนื้อหา feed
      active: Boolean,
    },
  ],
  active: { type: Boolean, default: true },
});

module.exports.userModel = mongoose.model('users', userSchema);
