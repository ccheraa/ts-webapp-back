"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var mocha_typescript_1 = require("mocha-typescript");
var chai = require("chai");
var expect = chai.expect;
var _1 = require(".");
var tools_1 = require("./tools");
describe('Server test', function () {
    var ServerSpec = (function () {
        function ServerSpec() {
        }
        ServerSpec.prototype['should have a default Server'] = function () {
            var app = new _1.Server();
            expect(app.app).to.not.be.an('undefined');
            expect(app.config.port).to.equal(8001);
        };
        ;
        ServerSpec.prototype['should have an Server with config'] = function () {
            var config = {
                port: 9999
            };
            var app = new _1.Server(config);
            expect(app.config).to.not.be.an('undefined');
            expect(app.config.port).to.equal(config.port);
            expect(app.config.host).to.equal(_1.serverDefaultConfig.host);
        };
        ;
        ServerSpec.prototype['should bootstrap a default Server'] = function () {
            var app = _1.Server.bootstrap();
            expect(app.app).to.not.be.an('undefined');
            expect(app.config).to.equal(_1.serverDefaultConfig);
        };
        ;
        ServerSpec.prototype['should bootstrap an Server with config'] = function () {
            var config = {
                host: '127.0.0.1'
            };
            var app = _1.Server.bootstrap(config);
            expect(app.config).to.not.be.an('undefined');
            expect(app.config.port).to.equal(_1.serverDefaultConfig.port);
            expect(app.config.host).to.equal(config.host);
        };
        ;
        return ServerSpec;
    }());
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerSpec.prototype, "should have a default Server", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerSpec.prototype, "should have an Server with config", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerSpec.prototype, "should bootstrap a default Server", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerSpec.prototype, "should bootstrap an Server with config", null);
    ServerSpec = __decorate([
        mocha_typescript_1.suite('Creation test')
    ], ServerSpec);
    ;
    var ServerRoutingSpec = (function () {
        function ServerRoutingSpec() {
            this.handler = function (req, res, next) { return 'ok'; };
        }
        ServerRoutingSpec.prototype.before = function () {
            this.app = new _1.Server();
        };
        ;
        ServerRoutingSpec.prototype['should have static routes to default directories'] = function () {
            var _this = this;
            var directories = ['dir1', 'dir2', 'dir3'];
            directories.forEach(function (route) { return _this.app.static(route); });
            this.app.app._router.stack
                .filter(function (layer) { return layer.name === 'serveStatic'; })
                .map(function (layer, index) {
                expect('/' + directories[index]).to.match(layer.regexp);
            });
        };
        ;
        ServerRoutingSpec.prototype['should have static routes to preset directories'] = function () {
            var _this = this;
            var directories = ['dir1', 'dir2', 'dir3'];
            var urls = ['test1', 'test2', 'test3'];
            urls.forEach(function (url, index) { return _this.app.static(directories[index], url); });
            this.app.app._router.stack
                .filter(function (layer) { return layer.name === 'serveStatic'; })
                .forEach(function (layer, index) {
                expect(urls[index]).to.match(layer.regexp);
            });
        };
        ;
        ServerRoutingSpec.prototype['should have default route'] = function () {
            this.app.default(this.handler);
            this.app.app._router.stack
                .filter(function (layer) { return (layer.name !== 'query') && (layer.name !== 'expressInit'); })
                .forEach(function (layer, index) {
                expect('/').to.match(layer.regexp);
                expect('/level1').to.match(layer.regexp);
                expect('/level1/level2').to.match(layer.regexp);
                expect('/level1/level2/level3').to.match(layer.regexp);
                expect(layer.handle()).to.equal('ok');
            });
        };
        ;
        ServerRoutingSpec.prototype['should have custom route'] = function () {
            this.app.route('/test/2', this.handler);
            this.app.app._router.stack
                .filter(function (layer) { return (layer.name !== 'query') && (layer.name !== 'expressInit'); })
                .forEach(function (layer, index) {
                expect('/test/1').to.not.match(layer.regexp);
                expect('/test/2').to.match(layer.regexp);
            });
        };
        ;
        ServerRoutingSpec.prototype['should have custom middleware'] = function () {
            var _this = this;
            this.app.middleware(this.handler);
            this.app.app._router.stack
                .filter(function (layer) { return (layer.name !== 'query') && (layer.name !== 'expressInit'); })
                .forEach(function (layer, index) {
                expect(layer.handle).to.equal(_this.handler);
            });
        };
        ;
        ServerRoutingSpec.prototype['should give a routing report'] = function () {
            var _this = this;
            var controller = new _1.Controller();
            controller.add(this.handler, '/upload', 'post');
            var directories = ['dir1', 'dir2', 'dir3'];
            directories.forEach(function (route) { return _this.app.static(route); });
            this.app.middleware(this.handler);
            this.app.route('/test/2', this.handler);
            this.app.applyRoutes([controller]);
            var report = this.app.routeReport();
            expect(report.static).to.have.length(directories.length);
            expect(report.route).to.have.length(1);
            expect(report.controllers).to.have.length(1);
        };
        ;
        return ServerRoutingSpec;
    }());
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerRoutingSpec.prototype, "should have static routes to default directories", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerRoutingSpec.prototype, "should have static routes to preset directories", null);
    __decorate([
        mocha_typescript_1.skip, mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerRoutingSpec.prototype, "should have default route", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerRoutingSpec.prototype, "should have custom route", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerRoutingSpec.prototype, "should have custom middleware", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ServerRoutingSpec.prototype, "should give a routing report", null);
    ServerRoutingSpec = __decorate([
        mocha_typescript_1.suite('Routing test')
    ], ServerRoutingSpec);
    ;
    var ServerConfigSpec = (function () {
        function ServerConfigSpec() {
        }
        ServerConfigSpec.prototype.after = function () {
            this.app && this.app.stop();
        };
        ServerConfigSpec.after = function () {
            _1.Server.stop();
        };
        ServerConfigSpec.prototype['should listen on default port'] = function (done) {
            this.app = new _1.Server({
                port: 8001,
                host: '0.0.0.0'
            });
            this.app.start(function () {
                tools_1.isPortFree(8001, '0.0.0.0').callback(function (free) {
                    expect(free).to.be.false;
                    done();
                });
            });
        };
        ;
        // TODO: servers using last config (8005)
        ServerConfigSpec.prototype['should stop all running servers'] = function (done) {
            var servers = [
                new _1.Server({ port: 8001, host: '0.0.0.0' }),
                new _1.Server({ port: 8002, host: '0.0.0.0' }),
                new _1.Server({ port: 8003, host: '0.0.0.0' }),
                new _1.Server({ port: 8004, host: '0.0.0.0' }),
                new _1.Server({ port: 8005, host: '0.0.0.0' }),
            ];
            var startedServers = 0;
            var assertions = 0;
            var serverStarted = function (server) {
                startedServers++;
                if (startedServers === servers.length) {
                    _1.Server.stop(function () {
                        servers.forEach(function (server) {
                            tools_1.isPortFree(server.config.port, server.config.host).free(function () {
                                assertions++;
                                serverStopped(server);
                            });
                        });
                    });
                }
            };
            var serverStopped = function (server) {
                startedServers--;
                if (startedServers === 0) {
                    expect(assertions).to.equal(servers.length * 2);
                    done();
                }
            };
            servers.forEach(function (server) { return server.start(function () {
                tools_1.isPortFree(server.config.port, server.config.host).not(function () {
                    assertions++;
                    serverStarted(server);
                });
            }); });
        };
        ;
        return ServerConfigSpec;
    }());
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], ServerConfigSpec.prototype, "should listen on default port", null);
    __decorate([
        mocha_typescript_1.skip, mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ServerConfigSpec.prototype, "should stop all running servers", null);
    ServerConfigSpec = __decorate([
        mocha_typescript_1.suite('Config test')
    ], ServerConfigSpec);
    ;
});
//# sourceMappingURL=server.spec.js.map