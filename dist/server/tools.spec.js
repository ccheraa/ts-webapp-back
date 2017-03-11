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
var tools_1 = require("./tools");
var usedPort = 445;
var usedHost = '0.0.0.0';
var freePort = 9000;
var freeHost = '127.0.0.1';
var ToolsSpec = (function () {
    function ToolsSpec() {
    }
    ToolsSpec.prototype['should return an object'] = function () {
        var obj = tools_1.isPortFree(8000);
        expect(obj).to.not.be.undefined;
        expect(obj.then).to.not.be.undefined;
        expect(obj.not).to.not.be.undefined;
        expect(obj.notFree).to.not.be.undefined;
        expect(obj.free).to.not.be.undefined;
        expect(obj.callback).to.not.be.undefined;
        expect(obj._onFree).to.not.be.undefined;
        expect(obj._onNotFree).to.not.be.undefined;
        expect(obj._callback).to.not.be.undefined;
    };
    ;
    ToolsSpec.prototype['port should not be free (using callback)'] = function (done) {
        var obj = tools_1.isPortFree(usedPort, usedHost);
        obj.callback(function (free) {
            expect(free).to.be.false;
            done();
        });
        expect(obj._callback).to.not.be.null;
    };
    ;
    ToolsSpec.prototype['port should     be free (using callback)'] = function (done) {
        var obj = tools_1.isPortFree(freePort, freeHost);
        obj.callback(function (free) {
            expect(free).to.be.true;
            done();
        });
        expect(obj._callback).to.not.be.null;
    };
    ;
    ToolsSpec.prototype['port should not be free (using then)'] = function (done) {
        var obj = tools_1.isPortFree(usedPort, usedHost);
        obj.then(null, function () {
            expect(true).to.be.true;
            done();
        });
        expect(obj._onNotFree).to.not.be.null;
    };
    ;
    ToolsSpec.prototype['port should     be free (using then)'] = function (done) {
        var obj = tools_1.isPortFree(freePort, freeHost);
        obj.then(function () {
            expect(true).to.be.true;
            done();
        });
        expect(obj._onFree).to.not.be.null;
    };
    ;
    ToolsSpec.prototype['port should not be free (using not)'] = function (done) {
        var obj = tools_1.isPortFree(usedPort, usedHost);
        obj.not(function () {
            expect(true).to.be.true;
            done();
        });
        expect(obj._onNotFree).to.not.be.null;
    };
    ;
    ToolsSpec.prototype['port should not be free (using notFree)'] = function (done) {
        var obj = tools_1.isPortFree(usedPort, usedHost);
        obj.notFree(function () {
            expect(true).to.be.true;
            done();
        });
        expect(obj._onNotFree).to.not.be.null;
    };
    ;
    ToolsSpec.prototype['port should     be free (using free)'] = function (done) {
        var obj = tools_1.isPortFree(freePort, freeHost);
        obj.free(function () {
            expect(true).to.be.true;
            done();
        });
        expect(obj._onFree).to.not.be.null;
    };
    ;
    return ToolsSpec;
}());
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "should return an object", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should not be free (using callback)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should     be free (using callback)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should not be free (using then)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should     be free (using then)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should not be free (using not)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should not be free (using notFree)", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ToolsSpec.prototype, "port should     be free (using free)", null);
ToolsSpec = __decorate([
    mocha_typescript_1.suite('Tools test')
], ToolsSpec);
;
//# sourceMappingURL=tools.spec.js.map