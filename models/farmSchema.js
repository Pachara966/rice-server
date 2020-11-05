const mongoose = require('mongoose');
const schema = mongoose.Schema;
const farmSchema = new schema({
  name: String,
  farmPicture: { type: String, default: '' },
  size: Number,
  location: {
    formattedAddress: String,
    province: Number,
    latt: Number, // or String
    long: Number, // or String
  },
  varieties: Number,
  evalproduct: {
    cost: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
    product: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
    price: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
    profit: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
  },
  resultproduct: {
    humidity: { type: Number, default: 15 },
    cost: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
    product: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
    price: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
    profit: {
      value: Number,
      status: {
        type: String,
        enum: ['1', '2', '3'],
      },
    },
  },
  // 3 perfect, 2 good, 1 bad
  startDate: Date,
  endDate: Date,
  timelinePast: [
    {
      order: Number,
      activitiesDate: Date,
      activities: [
        {
          code: Number,
          active: { type: Boolean, default: true },
        },
      ],
      bugs: [
        {
          code: Number,
          active: { type: Boolean, default: true },
          found: Boolean,
        },
      ],
    },
  ],
  timelineFuture: [
    {
      order: { type: Number, default: 0 },
      activitiesDate: Date,
      activities: [
        {
          code: Number,
          active: { type: Boolean, default: false },
        },
      ],
      bugs: [
        {
          code: Number,
          active: { type: Boolean, default: false },
          found: Boolean,
        },
      ],
    },
  ],
  timeline: [
    {
      order: { type: Number, default: 0 },
      caption: { type: String, default: '' },
      status: { type: Boolean, default: false }, // เปลี่ยนเมื่อกดใช้งานหรือผ่านไปแล้ว
      activitiesDate: Date,
      timelineType: { type: Number, enum: [0, 1, 2], default: 0 }, // 1(1,2) = farm, 2(3,4,5) = Admin
      activities: [
        {
          code_type: { type: Number, enum: [0, 1, 2], default: 0 }, // 1 = กิจกรรม , 2 = warning
          array_code: [
            {
              code: { type: Number, default: 0 }, // 001 - 299
              activity: { type: String, default: '' }, // Map with code from db
              picture_url: { type: String, default: '' },
              activate: { type: Boolean, default: false },
            },
          ],
        },
      ],
      activityLenght: { type: Number, default: 0 }, // Count from code_type = 1
      warningLenght: { type: Number, default: 0 }, // Count from code_type = 2
    },
  ],
  note: [
    {
      order: Number,
      noteDate: Date,
      content: String,
      photo: [String],
      cost: Number,
    },
  ],
  activate: { type: String, enum: ['wait', 'process', 'end'], default: 'wait' }, // wait รอเริ่มการปลูก, process ระหว่างการปลูก, end เสร็จสิ้นการปลูก
});

module.exports.farmModel = mongoose.model('farms', farmSchema);
