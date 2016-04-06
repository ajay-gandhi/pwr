'use strict';

/******************************* Initialization *******************************/

// Electron modules
var electron      = require('electron'),
    app           = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipc           = electron.ipcMain,
    dialog        = electron.dialog,
    Menu          = electron.Menu,
    Tray          = electron.Tray;

// NPM modules
var ConfigStore = require('configstore');

// Local modules
var bat_watch = require('./battery'),
    utils     = require('./util');

// Battery watch vars
var disable_wid  = null,
    enabled      = true;

// Persistent configstore
var defaults  = { apps: [], threshold: 0.30 },
    config    = new ConfigStore(require('./package.json').name, defaults),
    threshold = config.get('threshold'),
    all_apps  = config.get('apps');

// Setup app
var main_window = null,
    app_icon    = null;

// Hide dock icon
app.dock.hide();

app.on('ready', function () {
  main_window = new BrowserWindow({
    width: 500,
    height: 360,
    center: true,
    resizable: false,
    type: 'textured'
  });
  main_window.loadURL('file://' + __dirname + '/html/index.html');

  // Immediately send current list of apps
  main_window.webContents.on('dom-ready', function () {
    main_window.webContents.send('current-threshold', config.get('threshold'));
    main_window.webContents.send('selections', config.get('apps'));
  });

  main_window.on('close', function (e) {
    main_window.hide();
    e.preventDefault();
  });

  main_window.on('app-command', function (e, cmd) {
    console.log('things are', e, cmd);
  });

  // Setup menu bar
  app_icon = new Tray(__dirname + '/assets/menubar_iconTemplate.png');
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Disable',
      type:  'checkbox',
      click: function () {
        enabled = !enabled;
        bat_watch.set_enabled(enabled);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Settings',
      click: function () {
        main_window.show();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: function () {
        main_window.destroy();
        app.quit();
      }
    }
  ]);
  app_icon.setToolTip('pwr');
  app_icon.setContextMenu(contextMenu);
});

/****************************** Battery Watching ******************************/

var stopped_apps = [];

var disable_func = function (stats) {
  if (stats.percent < threshold) {
    all_apps.forEach(function (app_name) {
      if (stopped_apps.indexOf(app_name) == -1) {
        utils.quit_app(app_name);
        stopped_apps.push(app_name);
      }
    });
  }
}

disable_wid = bat_watch.start(disable_func);

/********************************* IPC Events *********************************/

// Options for dialog box
var select_apps_dialog = {
  title: 'Select apps to close',
  defaultPath: '/Applications/',
  filters: [
    { name: 'Applications', extensions: ['app'] }
  ],
  properties: ['openFile', 'multiSelections']
}

ipc.on('update-percentage', function (event, new_threshold) {
  threshold = new_threshold;
  config.set('threshold', threshold);
});

ipc.on('select-apps', function (event, arg) {
  dialog.showOpenDialog(select_apps_dialog, function (apps) {
    if (apps) {

      apps = apps.map(function (n) {
        return n.split('/').pop().split('.').shift();
      });

      // Update local
      all_apps = utils.union(all_apps, apps).sort(utils.compare_alpha);
      config.set('apps', all_apps);

      // Update renderer
      event.sender.send('selections', apps);

    } else {
      // User clicked cancel or didn't choose any apps
    }
  });
});

ipc.on('remove-apps', function (event, removed) {
  all_apps = all_apps.filter(function (item) {
    return removed.indexOf(item) === -1;
  });

  config.set('apps', all_apps);
});

// User pressed cmd + q in window, so quit app
ipc.on('quit-app', function (event, should_quit) {
  main_window.destroy();
  app.quit();
});
