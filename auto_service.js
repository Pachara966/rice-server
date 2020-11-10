const path = require('path');

// optional
const ms = require('ms');
const dayjs = require('dayjs');
const Graceful = require('@ladjs/graceful');
const Cabin = require('cabin');

// required
const Bree = require('bree');

const bree = new Bree({
  // logger: new Cabin(),
  jobs: [
    {
      name: 'update_timeline_status',
      timeout: ms('5000'),
      interval: '10m',
    },
    {
      name: 'test2',
      interval: 'at 12:00 am',
    },
  ],
});
// // handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
