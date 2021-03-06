'use strict';

var ipc   = require('electron').ipcRenderer,
    utils = require('../util');

window.jQuery = window.$ = module.exports;

// Local copy of apps to quit
var all_apps = [];

$(document).ready(function () {
  // Update percentage visuals
  $('#percentage').on('input', function () {
    $('#percentage-value').text($(this).val() + '%');
  });

  // Update battery percentage
  $('#percentage').on('change', function () {
    ipc.send('update-percentage', $(this).val() / 100.0);
  });

  // Open app selection dialog
  $('#add-apps').click(function () {
    ipc.send('select-apps', true);
  });

  // Remove apps from current list
  $('#remove-apps').click(function () {
    var removed = $('#current-apps').val();
    if (removed) {
      ipc.send('remove-apps', removed);

      all_apps = all_apps.filter(function (item) {
        return removed.indexOf(item) === -1;
      });

      update_local_app_list();
    }
  });

  $('#login-start').on('change', function () {
    ipc.send('login-start', $('#login-start').is(':checked'));
  });
});

// Quit app on cmd + q
$(document).keydown(function (e) {
  if (e.metaKey && e.which == 81) {
    ipc.send('quit-app', true);
    e.preventDefault();
    return false;
  };
});

/********************************* IPC Events *********************************/

// Receive app selections
ipc.on('selections', function (event, new_app_list) {
  all_apps = utils.union(all_apps, new_app_list);
  update_local_app_list();
});

// Receive current setting for battery threshold
ipc.on('current-threshold', function (event, curr_th) {
  $('#percentage').val(curr_th * 100);
  $('#percentage-value').text(curr_th * 100 + '%');
});

// Receive current setting for autostart
ipc.on('autostart', function (event, is_enabled) {
  $('#login-start').prop('checked', is_enabled);
});

/**
 * Updates the app list in the UI.
 */
var update_local_app_list = function () {
  // List all apps for user
  $('#current-apps').html('');
  all_apps.forEach(function (app) {
    $('#current-apps').append('<option>' + app + '</option>');
  });
}
