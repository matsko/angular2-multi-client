var electron = require('electron');
var electron_message_bus_1 = require('./electron_message_bus');
var electron_app_common_1 = require('./electron_app_common');
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
var di_1 = require('angular2/src/core/di');
var parse5_adapter_1 = require('angular2/src/platform/server/parse5_adapter');
var core_1 = require('angular2/core');
var message_bus_1 = require('angular2/src/web_workers/shared/message_bus');
var compiler_1 = require('angular2/src/compiler/compiler');
exports.ELECTRON_APP_APPLICATION = [
    electron_app_common_1.ELECTRON_APP_APPLICATION_COMMON,
    compiler_1.COMPILER_PROVIDERS,
    new di_1.Provider(message_bus_1.MessageBus, { useFactory: createMessageBus, deps: [ng_zone_1.NgZone] }),
    new di_1.Provider(core_1.APP_INITIALIZER, { useValue: function () { }, multi: true })
];
var applicationRef;
function createMessageBus(zone) {
    var sink = new electron_message_bus_1.ElectronMessageBusSink(applicationRef.webContents);
    var source = new electron_message_bus_1.ElectronMessageBusSource(electron.ipcMain);
    var bus = new electron_message_bus_1.ElectronMessageBus(sink, source);
    bus.attachToZone(zone);
    return bus;
}
function waitForAppReady() {
    return new Promise(function (resolve, reject) {
        electron.app.on('ready', resolve);
    });
}
function waitForPingback() {
    initializeMainWindow();
    return new Promise(function (resolve) {
        electron.ipcMain.once(electron_message_bus_1.ELECTRON_READY, function (ev) {
            ev.returnValue = 'ok';
            resolve();
        });
    });
}
function initializeMainWindow() {
    applicationRef = new electron.BrowserWindow();
    applicationRef.loadURL("file://" + process.cwd() + "/" + process.env.DESKTOP_DIST_DIR + "index.html");
}
function bootstrap(appComp, providers) {
    parse5_adapter_1.Parse5DomAdapter.makeCurrent();
    return core_1.platform([electron_app_common_1.ELECTRON_APP_PLATFORM])
        .asyncApplication(function (z) {
        return z.run(function () {
            return waitForAppReady()
                .then(waitForPingback)
                .then(function () {
                return exports.ELECTRON_APP_APPLICATION;
            });
        });
    })
        .then(function (appRef) {
        return appRef.bootstrap(appComp);
    });
}
exports.bootstrap = bootstrap;
