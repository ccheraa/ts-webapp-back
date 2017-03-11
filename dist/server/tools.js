"use strict";
var net_1 = require("net");
function isPortFree(port, host) {
    if (host === void 0) { host = '0.0.0.0'; }
    var callback = {
        _onFree: null,
        _onNotFree: null,
        _callback: null,
        then: function (ifFree, ifNotFree) {
            this._onFree = ifFree;
            this._onNotFree = ifNotFree;
        },
        free: function (callback) {
            this._onFree = callback;
        },
        not: function (callback) {
            this._onNotFree = callback;
        },
        notFree: function (callback) {
            this.not(callback);
        },
        callback: function (callback) {
            this._callback = callback;
        }
    };
    var server = net_1.createServer();
    server.listen(port, host);
    server.on('error', function (e) {
        callback._onNotFree && callback._onNotFree();
        callback._callback && callback._callback(false);
    });
    server.on('listening', function (e) {
        server.close();
        callback._onFree && callback._onFree();
        callback._callback && callback._callback(true);
    });
    return callback;
}
exports.isPortFree = isPortFree;
//# sourceMappingURL=tools.js.map