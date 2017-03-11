"use strict";
var HTTP_METHODS = ['options', 'patch', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'];
var Handles = (function () {
    function Handles() {
    }
    Handles.prototype.forEach = function (fun) {
        var _this = this;
        HTTP_METHODS
            .filter(function (key) { return _this[key]; })
            .forEach(function (key) { return fun(_this[key], key); });
    };
    Handles.prototype.map = function (fun) {
        var _this = this;
        return HTTP_METHODS
            .filter(function (key) { return _this[key]; })
            .map(function (key) { return fun(_this[key], key); });
    };
    Handles.prototype.on = function (method) {
        var _this = this;
        var functions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            functions[_i - 1] = arguments[_i];
        }
        if (typeof method === 'object') {
            method.forEach(function (methodRef) { return _this.on.apply(_this, [methodRef].concat(functions)); });
        }
        else {
            this[method] = (typeof functions[0] === 'string') ? this[functions[0]] : functions;
        }
        return this;
    };
    return Handles;
}());
exports.Handles = Handles;
var Route = (function () {
    function Route(url) {
        if (url === void 0) { url = '/'; }
        this.url = url;
        this.handles = new Handles();
    }
    Route.create = function (fun, url, method) {
        if (url === void 0) { url = '/'; }
        if (method === void 0) { method = 'get'; }
        return new Route(url).on(method, fun);
    };
    Route.prototype.on = function (method) {
        var functions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            functions[_i - 1] = arguments[_i];
        }
        (_a = this.handles).on.apply(_a, [method].concat(functions));
        return this;
        var _a;
    };
    return Route;
}());
exports.Route = Route;
//# sourceMappingURL=route.js.map