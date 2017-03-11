// import { Schema, Model as mgModel, model, SchemaOptions } from 'mongoose';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var db_1 = require("../db");
var auth_1 = require("../auth");
// interface AuthFunction {
//   (user: any, done: any): void;
// };
// interface AuthenticateFunction {
//   (username, password, done: any): void;
// };
var AuthModel = (function (_super) {
    __extends(AuthModel, _super);
    function AuthModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // deserializeFunction: AuthFunction;
    // serializeFunction: AuthFunction;
    // authenticateFunction: AuthenticateFunction;
    AuthModel.prototype.makeSchema = function (name) {
        this.definition.username = { type: String };
        this.definition.password = { type: String };
        _super.prototype.makeSchema.call(this, name);
    };
    AuthModel.prototype.makeModel = function (name) {
        auth_1.Auth.setupSchema(this.schema);
        _super.prototype.makeModel.call(this, name);
    };
    return AuthModel;
}(db_1.Model));
exports.AuthModel = AuthModel;
//# sourceMappingURL=model.js.map