"use strict";
var express_1 = require("express");
var route_1 = require("./route");
var Controller = (function () {
    function Controller(base, routes) {
        if (base === void 0) { base = '/'; }
        if (routes === void 0) { routes = []; }
        this.base = base;
        this.routes = routes;
        this.router = express_1.Router();
    }
    Controller.prototype.add = function (fun, url, method) {
        if (url === void 0) { url = '/'; }
        if (method === void 0) { method = 'get'; }
        var route = route_1.Route.create(fun, url, method);
        this.routes.push(route);
        return route;
    };
    Controller.prototype.setup = function (app) {
        var _this = this;
        this.routes.forEach(function (route) {
            route.handles.forEach(function (handle, method) {
                (_a = _this.router)[method].apply(_a, [route.url].concat(handle.filter(function (route) { return !!route; })));
                var _a;
            });
        });
        this.router === null || app.use(this.base, this.router);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map