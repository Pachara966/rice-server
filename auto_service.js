// const path = require('path');

// optional
const ms = require('ms');
// const dayjs = require('dayjs');
const Graceful = require('@ladjs/graceful');
// const Cabin = require('cabin');

// required
const Bree = require('bree');

const bree = new Bree({
  // logger: new Cabin(),
  // Bree work in UTC time
  jobs: [
    // {
    //   name: 'getFarm',
    //   interval: '60m',
    // },
    // {
    //   name: 'update_timeline_status',
    //   interval: 'at 5:00 am also at 5:00 pm ',
    // },
    // {
    //   name: 'changeFarmActivate',
    //   interval: 'at 5:30 am also at 5:30 pm ',
    // },
    {
      name: 'testGenerateFeed',
    },
    // {
    //   name: 'test2',
    //   worker: {
    //     workerData: {
    //       foo: [
    //         {
    //           code_type: 1,
    //           array_code: [
    //             {
    //               activityCode: 102,
    //               activity: 'ตรวจสอบระดับน้ำ 3 เซนติเมตร',
    //               picture: 'http://ricepedia.org/images/transplanting.jpg',
    //               activate: false,
    //             },
    //             {
    //               activityCode: 103,
    //               activity: 'ให้ปู๋ยสูตร xx-xx-xx',
    //               picture:
    //                 'http://ricepedia.org/images/nutrient-management.jpg',
    //               activate: false,
    //             },
    //           ],
    //         },
    //       ],
    //       beep: 'boop',
    //     },
    //   },
    //   interval: 'at 7:16 am also at 7:17 am ',
    // },
    // {
    //   name: 'rain_regions',
    //   interval: 'at 4:10 am also at 7:17 am ',
    // },
  ],
});
// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
