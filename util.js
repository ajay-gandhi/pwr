'use strict';
/**
 * Miscellaneous utilities
 */

var spawn = require('child_process').spawn;

/**
 * Returns the union of two arrays
 */
module.exports.union = function (x, y) {
  var obj = {};
  for (var i = x.length - 1; i >= 0; --i)
    obj[x[i]] = x[i];

  for (var i = y.length - 1; i >= 0; --i)
    obj[y[i]] = y[i];

  return Object.keys(obj);
}

/**
 * Quits an app using Applescript
 */
module.exports.quit_app = function (app_name) {
  spawn('osascript', ['-e', 'quit app "' + app_name + '"']);
}

/**
 * Alphabetic compare function
 */
module.exports.compare_alpha= function (a, b) {
  var x = a.toLowerCase(),
      y = b.toLowerCase();

  return x < y ? -1 : (x > y ? 1 : 0);
} 

