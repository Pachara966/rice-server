const mongoose = require('mongoose');
const schema = mongoose.Schema;
const feedSchema = new schema({
  feedPicture: { type: String, default: '' },
  farmID: { type: String, default: '' }, // ให้ใส่ค่าว่างไว้
  name: { type: String, default: '' }, // ถ้าไม่รู้จะใส่อะไรห้ใส่ กรมการข้าว ได้หมดเลย
  order: { type: Number, default: 0 }, // เริ่มจาก 1 และ บวกขึ้นไปเรื่อยๆ
  activitiesDate: Date,
  caption: { type: String, default: '' },
  status: { type: String, default: '' }, // ให้ใส่ fales ทั้งไว้เลย
  feedType: { type: Number, enum: [0, 1, 2], default: 0 }, // 1(1,2) = farm, 2(3,4,5) = Admin (กรมการข้าว)
  activities: [
    {
      code_type: { type: Number, enum: [0, 3, 4, 5], default: 0 },
      array_code: [
        {
          activityCode: { type: Number, default: 0 },
          activity: { type: String, default: '' },
          picture: { type: String, default: '' },
          activate: { type: Boolean, default: false },
        },
      ],
    },
  ],
  activityLenght: { type: Number, default: 0 }, // ใส่ 0
  warningLenght: { type: Number, default: 0 }, // ใส่ 0
});

module.exports.feedModel = mongoose.model('feeds', feedSchema);
