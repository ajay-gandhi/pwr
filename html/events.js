'use strict';

var ipc   = require('electron').ipcRenderer,
    utils = require('../util');
    console.log(utils);

window.jQuery = window.$ = module.exports;

var all_apps = [];

$(document).ready(function () {
  // Update percentage visuals
  $('#percentage').on('input', function () {
    $('#percentage-value').text($(this).val() + '%');
  });

  // Update battery percentage
  $('#update-percentage').click(function () {
    ipc.send('update-percentage', $('#percentage').val() / 100);
  });

  // Open app selection dialog
  $('#select-apps').click(function () {
    ipc.send('select-apps', true);
  });
});

/********************************* IPC Events *********************************/

ipc.on('selections', function (event, new_apps) {
  // Received app selections
  all_apps = union(all_apps, new_apps);

  // List all apps for user
  $('#current-apps').html('');
  all_apps.forEach(function (app) {
    $('#current-apps').append('<option>' + app + '</option>');
  });
});
