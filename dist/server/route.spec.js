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
// import 'source-map-support/register';
var mocha_typescript_1 = require("mocha-typescript");
var chai = require("chai");
var expect = chai.expect;
var _1 = require(".");
var RouteSpec = (function () {
    function RouteSpec() {
        this.handler = function (req, res, next) { return 'ok'; };
        // @test 'should have a route GET: \'/\''() {
        //
        //   this.obj.add('/', handler);
        //   expect(this.obj.routes[0].url).to.equals('/');
        //   expect(this.obj.routes[0].handles['get']).to.equals(handler);
        //   expect(this.obj.routes[0].handles['get']()).to.equals('ok');
        // };
        // @test 'should have a route POST: \'/upload\''() {
        //
        //   this.obj.add('/upload', handler, 'post');
        //   expect(this.obj.routes[0].url).to.equals('/upload');
        //   expect(this.obj.routes[0].handles['post']).to.equals(handler);
        //   expect(this.obj.routes[0].handles['post']()).to.equals('ok');
        // };
    }
    RouteSpec.prototype['should create a default Route at \'/\''] = function () {
        expect(new _1.Route().url).to.equals('/');
    };
    ;
    RouteSpec.prototype['should create a Route at \'/\' (alias)'] = function () {
        expect(new _1.Route('/').url).to.equals('/');
    };
    ;
    RouteSpec.prototype['should create a Route at: \'/api\''] = function () {
        expect(new _1.Route('/api').url).to.equals('/api');
    };
    ;
    RouteSpec.prototype['should create a route GET/POST: \'/user\''] = function () {
        var route = _1.Route.create(this.handler, '/user', ['get', 'post']);
        expect(route.url).to.equals('/user');
        expect(route.handles['get']).to.equals(this.handler);
        expect(route.handles['get']()).to.equals('ok');
        expect(route.handles['post']).to.equals(this.handler);
        expect(route.handles['post']()).to.equals('ok');
    };
    ;
    RouteSpec.prototype['should create a default route GET: \'/\''] = function () {
        var route = _1.Route.create(this.handler);
        expect(route.url).to.equals('/');
        expect(route.handles['get']).to.equals(this.handler);
        expect(route.handles['get']()).to.equals('ok');
    };
    ;
    RouteSpec.prototype['should create a route POST: \'/user\' and link GET to it'] = function () {
        var route = _1.Route.create(this.handler, '/user', 'post');
        expect(route.url).to.equals('/user');
        expect(route.handles['post']).to.equals(this.handler);
        expect(route.handles['post']()).to.equals('ok');
        route.on('get', 'post');
        expect(route.handles['get']).to.equals(this.handler);
        expect(route.handles['get']()).to.equals('ok');
    };
    ;
    RouteSpec.prototype['should loop through a route\'s handles'] = function () {
        var route = _1.Route.create(this.handler, '/user', ['get', 'post']);
        var count = 0;
        route.handles.forEach(function (handle) {
            expect(handle()).to.equals('ok');
            count++;
        });
        expect(count).to.equals(2);
    };
    ;
    return RouteSpec;
}());
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should create a default Route at '/'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should create a Route at '/' (alias)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should create a Route at: '/api'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should create a route GET/POST: '/user'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should create a default route GET: '/'", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should create a route POST: '/user' and link GET to it", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RouteSpec.prototype, "should loop through a route's handles", null);
RouteSpec = __decorate([
    mocha_typescript_1.suite('Route test')
], RouteSpec);
;
//# sourceMappingURL=route.spec.js.map