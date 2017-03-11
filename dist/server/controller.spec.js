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
var ControllerSpec = (function () {
    function ControllerSpec() {
        this.handler = function (req, res, next) { return 'ok'; };
    }
    ControllerSpec.prototype.before = function () {
        this.obj = new _1.Controller();
    };
    ControllerSpec.prototype.after = function () {
        delete (this.obj);
        // this.obj = null;
    };
    ControllerSpec.prototype['should have a router for default Controller'] = function () {
        expect(this.obj.router).to.be.ok;
    };
    ;
    ControllerSpec.prototype['should have a router at: \'/\''] = function () {
        this.obj = new _1.Controller('/root');
        expect(this.obj.base).to.equals('/root');
    };
    ;
    ControllerSpec.prototype['should create a Controller with a route GET: \'/routes/home\''] = function () {
        var route = new _1.Route('/home');
        route.on('get', this.handler);
        this.obj = new _1.Controller('/routes', [route]);
        expect(this.obj.base).to.equals('/routes');
        expect(this.obj.routes[0].url).to.equals('/home');
        expect(this.obj.routes[0].handles['get']).to.equals(this.handler);
        expect(this.obj.routes[0].handles['get']()).to.equals('ok');
    };
    ;
    ControllerSpec.prototype['should have a route GET: \'/\''] = function () {
        this.obj.add(this.handler);
        expect(this.obj.routes[0].url).to.equals('/');
        expect(this.obj.routes[0].handles['get']).to.equals(this.handler);
        expect(this.obj.routes[0].handles['get']()).to.equals('ok');
    };
    ;
    ControllerSpec.prototype['should have a route POST: \'/upload\''] = function () {
        this.obj.add(this.handler, '/upload', 'post');
        expect(this.obj.routes[0].url).to.equals('/upload');
        expect(this.obj.routes[0].handles['post']).to.equals(this.handler);
        expect(this.obj.routes[0].handles['post']()).to.equals('ok');
    };
    ;
    ControllerSpec.prototype['should setup a server with one controller'] = function (done) {
        var _this = this;
        this.obj.add(this.handler, '/upload', 'post');
        var server = new _1.Server();
        server.applyRoutes([this.obj]);
        server.start(function () {
            server.stop();
            expect(_this.obj.router.stack).length(1);
            done();
        });
    };
    ;
    return ControllerSpec;
}());
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControllerSpec.prototype, "should have a router for default Controller", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControllerSpec.prototype, "should have a router at: '/'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControllerSpec.prototype, "should create a Controller with a route GET: '/routes/home'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControllerSpec.prototype, "should have a route GET: '/'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControllerSpec.prototype, "should have a route POST: '/upload'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ControllerSpec.prototype, "should setup a server with one controller", null);
ControllerSpec = __decorate([
    mocha_typescript_1.suite('Controller test')
], ControllerSpec);
;
//# sourceMappingURL=controller.spec.js.map