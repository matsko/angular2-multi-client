function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
//public angular electron API for main (node/background)
__export(require('angular2/common'));
__export(require('angular2/core'));
__export(require('angular2/platform/worker_app'));
__export(require('angular2/instrumentation'));
__export(require('./platform/electron_app'));
__export(require('./platform/electron'));
