'use strict';

// Interval for checking battery status in s
var INTERVAL = 5;

var spawn = require('child_process').spawn;

/******************************* Module Exports *******************************/

var watch_battery   = spawn(__dirname + '/battery_command.sh', [INTERVAL]),
    watch_functions = [],
    running         = true;

/**
 * Starts watching the battery with given func. Calls the provided func at each
 * interval. Returns the id of the watch function for later use with stop().
 */
module.exports.start = function (func) {
  var id = watch_functions.length;
  watch_functions[id] = func;
  return id;
}

/**
 * Disables the given watch function.
 */
module.exports.stop = function (id) {
  watch_functions[id] = false;
}

/**
 * If enabled is false, stops the battery watch child process. Otherwise,
 * starts the battery watch process.
 */
module.exports.set_enabled = function (enabled) {
  if (!enabled && running) {
    // Stop process
    running = false;
    watch_battery.kill();

  } else if (enabled && !running) {
    // Restart process
    running = true;
    watch_battery = spawn(__dirname + '/battery_command.sh', [INTERVAL]);
    watch_battery.stdout.on('data', new_bat_status);

  }
}

/************************************ Core ************************************/

var stats = {};

var new_bat_status = function (raw_data) {
  var lines = raw_data.toString().split('\n');
  stats = {
    current: parseInt(lines[0]),
    max_cap: parseInt(lines[2]),
    is_full: lines[1].charAt(0) === 'Y' ? true : false
  };
  stats.percent = stats.current * 1.0 / stats.max_cap;

  // Call all watch functions on data
  watch_functions.forEach(function (f) {
    if (f && typeof f === 'function') {
      f(stats);
    }
  });
}

watch_battery.stdout.on('data', new_bat_status);
