const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
  name: String,
  surname: String,
  phonenumber: { type: String, unique: true },
  password: String,
  photo: { type: String, default: '' },
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
      order: { type: Number, default: 0 },
      caption: { type: String, default: '' },
      status: { type: Boolean, default: false }, // เปลี่ยนเมื่อกดใช้งานหรือผ่านไปแล้ว
      activitiesDate: { type: Date, default: Date.now },
      timelineType: { type: Number, enum: [0, 1, 2], default: 0 }, // 1(1,2) = farm, 2(3,4,5) = Admin
      activities: [
        {
          code_type: { type: Number, enum: [0, 1, 2], default: 0 }, // 1 = กิจกรรม , 2 = warning
          array_code: [
            {
              postscript: { type: String, default: '' },
              picture_url: { type: String, default: '' },
              owner: { type: String, default: '' },
              definition: { type: String, default: '' },
              code: { type: Number, default: 0 },
              activate: { type: Boolean, default: false },
            },
          ],
        },
      ],
      // activityLenght: { type: Number, default: 0 }, // Count from code_type = 1
      // warningLenght: { type: Number, default: 0 }, // Count from code_type = 2
    },
  ],
  oldfeed: [
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
