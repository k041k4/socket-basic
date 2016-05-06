var moment = require('moment');
var now = moment();

// console.log(now.format());
// console.log(now.format('X'));   //timestamp in Unix Time in seconds
// console.log(now.format('x'));   //timestamp in Unix Time in miliseconds
//
// console.log(now.format('x'));   //timestamp in Unix Time in miliseconds as number

var timestamp = 1462500220957;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a'));

// now.subtract(1, 'year');
//
// console.log(now.format());
// console.log(now.format('MMMM Do YYYY, h:mm:ss a'));
