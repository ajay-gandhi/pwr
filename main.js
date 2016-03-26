'use strict';

/******************************* Initialization *******************************/
// Electron modules
var electron      = require('electron'),
    app           = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipc           = electron.ipcMain,
    dialog        = electron.dialog;

// NPM modules
var ConfigStore = require('configstore');

// Local modules
var bat_watch = require('./battery'),
    utils     = require('./util');

// Persistent configstore
var defaults  = { apps: [], threshold: 0.30 },
    config    = new ConfigStore(require('./package.json').name, defaults),
    threshold = config.get('threshold'),
    all_apps  = config.get('apps');

// Setup app
var main_window = null;

app.on('ready', function () {
  main_window = new BrowserWindow({ width: 500, height: 300 });
  main_window.loadURL('file://' + __dirname + '/html/index.html');
});

// Setup battery watching
var main_watch_id = bat_watch.start(function (stats) {
  if (stats.current * 1.0 / stats.max_cap < threshold) {
    console.log('stopping:', config.get('apps'));
  }
});

/********************************* IPC Events *********************************/

var select_apps_dialog = {
  title: 'Select apps to close',
  defaultPath: '/Applications/',
  filters: [
    { name: 'Applications', extensions: ['app'] }
  ],
  properties: ['openFile', 'multiSelections']
}

ipc.on('update-percentage', function (event, arg) {
  threshold = arg;
  config.set('threshold', threshold);
});

ipc.on('select-apps', function (event, arg) {
  dialog.showOpenDialog(select_apps_dialog, function (apps) {
    if (apps) {

      // Update local and renderer-side app lists
      apps = apps.map(function (n) {
        return n.split('/').pop().split('.').shift();
      });

      all_apps = utils.union(all_apps, apps);
      config.set('apps', all_apps);

      event.sender.send('selections', apps);

    } else {
      // User clicked cancel or didn't choose any
    }
  });
});
