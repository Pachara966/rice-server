console.log('=============Autro run from bree 2===========');
var dateFormat = require('dateformat');
var today = new Date();
var DateTime =
  dateFormat(today.setDate(today.getDate()), 'isoDate').toString() +
  'T' +
  dateFormat(today.setDate(today.getDate()), 'isoTime').toString() +
  '.000Z';
console.log(DateTime);
