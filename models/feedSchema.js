const mongoose = require('mongoose');
const schema = mongoose.Schema;
const feedSchema = new schema({
  feed: [
    {
      feedPicture: { type: String, default: '' },
      name: { type: String, default: '' },
      order: { type: Number, default: 0 },
      activitiesDate: Date,
      caption: { type: String, default: '' },
      status: { type: Boolean, default: false }, // เปลี่ยนเมื่อกดใช้งานหรือผ่านไปแล้ว
      feedType: { type: Number, enum: [0, 1, 2], default: 0 }, // 1(1,2) = farm, 2(3,4,5) = Admin
      activities: [
        {
          code_type: { type: Number, enum: [0, 1, 2], default: 0 }, // 1 = กิจกรรม , 2 = warning
          array_code: [
            {
              activityCode: { type: Number, default: 0 }, // 001 - 299
              activity: { type: String, default: '' }, // Map with code from db
              picture: { type: String, default: '' },
              activate: { type: Boolean, default: false },
            },
          ],
        },
      ],
      activityLenght: { type: Number, default: 0 }, // Count from code_type = 1
      warningLenght: { type: Number, default: 0 }, // Count from code_type = 2
    },
  ],
});

module.exports.feedModel = mongoose.model('feed', feedSchema);
