'use strict';

/************************** Miscellaneous utilities ***************************/

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

/**
 * Adds this app as a login item
 */
module.exports.autostart = function (app_path, enable) {
  var app_name = 'pwr';
  app_path = app_path.replace(/(.app).*$/, '.app');

  if (enable) {
    var enable_script = 'tell application "System Events" to make login item at'
      + ' end with properties {path:"' + app_path + '", hidden:true, kind:'
      + '"application", name:"' + app_name + '"}';

    var en = spawn('osascript', ['-e', enable_script]);

  } else {
    var disable_script = 'tell application "System Events" to delete login item'
      + ' "' + app_name + '"';

    var dis = spawn('osascript', ['-e', disable_script]);

  }
}
