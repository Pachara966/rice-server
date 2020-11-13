const { Worker, isMainThread, workerData } = require('worker_threads');

console.log(
  '============================Auto run from bree 2============================'
);

console.log('worker data', workerData.foo);

var dateFormat = require('dateformat');
var today = new Date();
var DateTime =
  dateFormat(today.setDate(today.getDate()), 'isoDate').toString() +
  'T' +
  dateFormat(today.setDate(today.getDate()), 'isoTime').toString() +
  '.000Z';
console.log(DateTime);
