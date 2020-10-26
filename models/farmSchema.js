const mongoose = require("mongoose");
const schema = mongoose.Schema;
const farmSchema = new schema({
  name: String,
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
        enum: ["1", "2", "3"],
      },
    },
    product: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
      },
    },
    price: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
      },
    },
    profit: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
      },
    },
  },
  resultproduct: {
    humidity: { type: Number, default: 15 },
    cost: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
      },
    },
    product: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
      },
    },
    price: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
      },
    },
    profit: {
      value: Number,
      status: {
        type: String,
        enum: ["1", "2", "3"],
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
      order: Number,
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
  note: [
    {
      order: Number,
      noteDate: Date,
      content: String,
      photo: [String],
      cost: Number,
    },
  ],
  activate: { type: String, enum: ["wait", "process", "end"], default: "wait" }, // wait รอเริ่มการปลูก, process ระหว่างการปลูก, end เสร็จสิ้นการปลูก
});

module.exports.farmModel = mongoose.model("farms", farmSchema);
