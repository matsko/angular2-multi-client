var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var core_1 = require('angular2/core');
/**
 * Typescript Implementation of MessageBus for use in electron apps
 */
exports.ELECTRON_WORKER = '__ELECTRON_WORKER';
exports.ELECTRON_CLIENT = '__ELECTRON_CLIENT';
exports.ELECTRON_READY = '__ELECTRON_READY';
var ELECTRON_CHANNEL = '__ELECTRON_CHANNEL';
var ElectronMessageBus = (function () {
    function ElectronMessageBus(sink, source, env) {
        if (env === void 0) { env = exports.ELECTRON_CLIENT; }
        this.sink = sink;
        this.source = source;
        this.env = env;
    }
    ElectronMessageBus.prototype.attachToZone = function (zone) {
        this.source.attachToZone(zone);
        this.sink.attachToZone(zone);
    };
    ElectronMessageBus.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = false; }
        this.source.initChannel(channel, runInZone);
        this.sink.initChannel(channel, runInZone);
    };
    ElectronMessageBus.prototype.from = function (channel) { return this.source.from(channel); };
    ElectronMessageBus.prototype.to = function (channel) { return this.sink.to(channel); };
    ElectronMessageBus = __decorate([
        core_1.Injectable()
    ], ElectronMessageBus);
    return ElectronMessageBus;
})();
exports.ElectronMessageBus = ElectronMessageBus;
var ElectronMessageBusSink = (function () {
    function ElectronMessageBusSink(_ipc) {
        this._ipc = _ipc;
        this._channels = new Map();
        this._messageBuffer = [];
    }
    ElectronMessageBusSink.prototype.attachToZone = function (zone) {
        var _this = this;
        this._zone = zone;
        this._zone.onTurnDone.subscribe(function () { _this._handleOnEventDone(); });
    };
    ElectronMessageBusSink.prototype.initChannel = function (channel, runInZone) {
        var _this = this;
        if (runInZone === void 0) { runInZone = true; }
        if (this._channels.has(channel)) {
            throw new Error(channel + " has already been initialized");
        }
        var _channel = new _ElectronMessageChannel(new core_1.EventEmitter(), runInZone);
        this._channels.set(channel, _channel);
        _channel.emitter.subscribe(function (data) {
            var message = { channel: channel, message: data };
            if (runInZone) {
                _this._messageBuffer.push(message);
            }
            else {
                _this._sendMessages([message]);
            }
        });
    };
    ElectronMessageBusSink.prototype.to = function (channel) {
        if (!this._channels.has(channel)) {
            throw new Error(channel + " does not exist!");
        }
        return this._channels.get(channel).emitter;
    };
    ElectronMessageBusSink.prototype._sendMessages = function (messages) {
        if (this._ipc.sendChannel) {
            this._ipc.sendChannel(ELECTRON_CHANNEL, messages);
        }
        else {
            this._ipc.send(ELECTRON_CHANNEL, messages);
        }
    };
    ElectronMessageBusSink.prototype._handleOnEventDone = function () {
        if (this._messageBuffer.length > 0) {
            this._sendMessages(this._messageBuffer);
            this._messageBuffer = [];
        }
    };
    return ElectronMessageBusSink;
})();
exports.ElectronMessageBusSink = ElectronMessageBusSink;
var ElectronMessageBusSource = (function () {
    function ElectronMessageBusSource(_ipc) {
        var _this = this;
        this._ipc = _ipc;
        this._channels = new Map();
        this._ipc.on(ELECTRON_CHANNEL, function (ev, data) { return _this._handleMessages(data || ev); });
    }
    ElectronMessageBusSource.prototype.attachToZone = function (zone) { this._zone = zone; };
    ElectronMessageBusSource.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        if (this._channels.has(channel)) {
            throw new Error(channel + " has already been initialized");
        }
        var emitter = new core_1.EventEmitter();
        var channelInfo = new _ElectronMessageChannel(emitter, runInZone);
        this._channels.set(channel, channelInfo);
    };
    ElectronMessageBusSource.prototype.from = function (channel) {
        if (this._channels.has(channel)) {
            return this._channels.get(channel).emitter;
        }
        else {
            throw new Error(channel + " is not set up. Did you forget to call initChannel?");
        }
    };
    ElectronMessageBusSource.prototype._handleMessages = function (messages) {
        for (var i = 0; i < messages.length; i++) {
            this._handleMessage(messages[i]);
        }
    };
    ElectronMessageBusSource.prototype._handleMessage = function (data) {
        var channel = data.channel;
        if (this._channels.has(channel)) {
            var channelInfo = this._channels.get(channel);
            this._zone.run(function () { channelInfo.emitter.next(data.message); });
        }
        else {
            throw new Error('unhandled message!');
        }
    };
    return ElectronMessageBusSource;
})();
exports.ElectronMessageBusSource = ElectronMessageBusSource;
var _ElectronMessageChannel = (function () {
    function _ElectronMessageChannel(emitter, runInZone) {
        this.emitter = emitter;
        this.runInZone = runInZone;
    }
    return _ElectronMessageChannel;
})();
