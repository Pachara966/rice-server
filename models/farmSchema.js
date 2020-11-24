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
        enum: ['0', '1', '2', '3'],
      },
    },
    product: {
      value: Number,
      status: {
        type: String,
        enum: ['0', '1', '2', '3'],
      },
    },
    price: {
      value: Number,
      status: {
        type: String,
        enum: ['0', '1', '2', '3'],
      },
    },
    profit: {
      value: Number,
      status: {
        type: String,
        enum: ['0', '1', '2', '3'],
      },
    },
  },
  resultproduct: {
    humidity: { type: Number, default: 0 },
    cost: {
      value: { type: Number, default: 0 },
      status: {
        type: String,
        default: '0',
        enum: ['0', '1', '2', '3'],
      },
    },
    product: {
      value: { type: Number, default: 0 },
      status: {
        type: String,
        default: '0',
        enum: ['0', '1', '2', '3'],
      },
    },
    price: {
      value: { type: Number, default: 0 },
      status: {
        type: String,
        default: '0',
        enum: ['0', '1', '2', '3'],
      },
    },
    profit: {
      value: { type: Number, default: 0 },
      status: {
        type: String,
        default: '0',
        enum: ['0', '1', '2', '3'],
      },
    },
  },
  // 3 perfect, 2 good, 1 bad
  startDate: Date,
  endDate: Date,
  timeline: [
    {
      farmPicture: { type: String, default: '' },
      order: { type: Number, default: 0 },
      caption: { type: String, default: '' },
      status: { type: String, default: '' }, // เปลี่ยนเมื่อกดใช้งานหรือผ่านไปแล้ว 1 = Past Done, 2 = Past Not done, 3 = now -> next 7 days, 4 = After 7 day
      activitiesDate: Date,
      timelineType: { type: Number, enum: [0, 1, 2], default: 0 }, // 1(1,2) = farm, 2(3,4,5) = Admin
      activities: [
        {
          code_type: { type: Number, enum: [0, 1, 2], default: 0 }, // 1 = กิจกรรม , 2 = warning
          array_code: [
            {
              activityCode: { type: Number, default: 0 }, // 001 - 299
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
      order: { type: Number, default: 0 },
      noteDate: { type: Date, default: Date.now() },
      content: { type: String, default: '' },
      photo: [{ type: String, default: '' }],
      cost: { type: Number, default: 0 },
    },
  ],
  activate: { type: String, enum: ['wait', 'process', 'end'], default: 'wait' }, // wait รอเริ่มการปลูก, process ระหว่างการปลูก, end เสร็จสิ้นการปลูก
});

module.exports.farmModel = mongoose.model('farms', farmSchema);
