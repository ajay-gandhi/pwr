'use strict';

var spawn = require('child_process').spawn;

/******************************* Module Exports *******************************/
var watch_functions = [];

module.exports.start = function (func) {
  var id = watch_functions.length;
  watch_functions[id] = func;
  return id;
}

module.exports.stop = function (id) {
  watch_functions[id] = false;
}

/************************************ Core ************************************/
var watch_battery = spawn(__dirname + '/battery_command.sh', ['5']);
var stats = {};

watch_battery.stdout.on('data', function (raw_data) {
  var lines = raw_data.toString().split('\n');
  var num_regex = /\d+/;
  stats = {
    current: parseInt(lines[0].match(num_regex)[0]),
    max_cap: parseInt(lines[2].match(num_regex)[0]),
    is_full: lines[1].indexOf('Yes') < 0 ? false : true
  };
  stats.percent = stats.current / stats.max_cap;

  // Call all watch functions on data
  watch_functions.forEach(function (f) {
    if (f && typeof f === 'function') {
      f(stats);
    }
  });
});
