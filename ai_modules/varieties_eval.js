function varieties_eval(location, evalType, startDate) {
    /* input
    location: {
        parish: String,
        district: String,
        province: String,
        latt: String, // or Number
        long: String, // or Number
    },
    startDate: Date,
    evalType: Number
    */

    /* output
    [
      {
        varieties: String,
        evalproduct: {
          cost: {
            value: Number,
            enum: ["1", "2", "3"],
          },
          product: {
            value: Number,
            enum: ["1", "2", "3"],
          },
          price: {
            value: Number,
            enum: ["1", "2", "3"],
          },
          profit: {
            value: Number,
            enum: ["1", "2", "3"],
          },
        },
        timeline: [
          {
            activitiesDate: Date,
            activities: [
              {
                code: String,
                active: Boolean,
              },
            ],
          },
        ],
      },
    ]
    */

}
