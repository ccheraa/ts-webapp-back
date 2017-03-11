"use strict";
var express = require("express");
// import { isPortFree } from './tools';
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
exports.serverDefaultConfig = {
    port: 8001,
    host: '0.0.0.0'
};
var Server = (function () {
    function Server(config) {
        if (config === void 0) { config = {}; }
        this.config = exports.serverDefaultConfig;
        this.controllers = [];
        this.statics = [];
        this.routes = [];
        this.middlewares = [];
        if (config) {
            if (config.port) {
                this.config.port = config.port;
            }
            if (config.host) {
                this.config.host = config.host;
            }
        }
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
        this.static('./src/public', '/');
    }
    Server.bootstrap = function (config) {
        if (config === void 0) { config = {}; }
        return Server.main = new Server(config);
    };
    Server.prototype.applyRoutes = function (controllers) {
        var _this = this;
        controllers.forEach(function (controller) { return (_this.controllers.indexOf(controller) > -1) || _this.controllers.push(controller); });
    };
    Server.prototype.static = function (dir, url) {
        url = url || '/' + dir;
        var route = {
            url: url,
            dir: dir,
            handle: express.static(dir)
        };
        this.statics.push(route);
        this.app.use(url, route.handle);
    };
    Server.prototype.default = function () {
        var _this = this;
        var functions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            functions[_i] = arguments[_i];
        }
        functions.forEach(function (fun) { return _this.app.use(function (err, req, res, next) { return err ? fun(req, res, next) : next(err); }); });
    };
    Server.prototype.route = function (url) {
        var functions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            functions[_i - 1] = arguments[_i];
        }
        this.routes.push({
            url: url,
            handle: functions
        });
        (_a = this.app).use.apply(_a, [url].concat(functions.filter(function (route) { return !!route; })));
        var _a;
    };
    Server.prototype.middleware = function () {
        var functions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            functions[_i] = arguments[_i];
        }
        (_a = this.middlewares).push.apply(_a, functions);
        (_b = this.app).use.apply(_b, functions);
        var _a, _b;
    };
    Server.prototype.ip = function () {
        return this.config.host + ':' + this.config.port;
    };
    Server.error = function (error) {
        Server.stop();
        throw error;
    };
    Server.prototype.start = function (callback) {
        var _this = this;
        this.controllers.forEach(function (controller) { return controller.setup(_this.app); });
        this.server = this.app.listen(this.config.port, this.config.host, callback);
        Server.servers.push(this.server);
        process.on('exit', Server.error);
        process.on('uncaughtException', Server.error);
        process.on('SIGTERM', Server.error);
    };
    // TODO: Server.stop not working?
    Server.stop = function (callback) {
        var closedServers = 0;
        var closedServer = function (server) {
            if (++closedServers === Server.servers.length) {
                !!callback && callback();
            }
        };
        Server.servers.forEach(function (server) { return server && server.close(function () {
            closedServer(server);
        }); });
    };
    Server.prototype.stop = function (callback) {
        var _this = this;
        this.server && this.server.close(callback);
        Server.servers = Server.servers.filter(function (server) { return server !== _this.server; });
    };
    Server.prototype.routeReport = function () {
        return {
            static: this.statics.map(function (route) { return route.url + ': ' + route.dir; }),
            route: this.routes.map(function (route) { return route.url + ' (' + route.handle.length + ')'; }),
            controllers: this.controllers.map(function (controller) {
                return {
                    url: controller.base,
                    urls: controller.routes.map(function (route) {
                        return {
                            url: route.url,
                            fullUrl: controller.base + route.url,
                            methods: route.handles.map(function (handle, method) { return method + ' (' + handle.length + ')'; })
                        };
                    })
                };
            })
        };
    };
    return Server;
}());
Server.main = null;
Server.servers = [];
exports.Server = Server;
//# sourceMappingURL=server.js.map