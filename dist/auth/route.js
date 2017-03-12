"use strict";
var server_1 = require("../server");
var auth_1 = require("./auth");
var common_1 = require("@ts-webapp/common");
function UserController(model) {
    auth_1.Auth.setup(model);
    function result(ok) {
        if (ok === void 0) { ok = true; }
        return function (req, res, next) {
            res.json({ ok: ok });
        };
    }
    var islogged = new server_1.Route('/logged').on(['post', 'get'], auth_1.Auth.isSignedIn(result(false)), function (req, res, next) {
        res.json({
            ok: true,
            token: req.body.token,
            user: req.body.user
        });
    });
    var signout = new server_1.Route('/logout').on('post', auth_1.Auth.signOut(), result());
    var signin = new server_1.Route('/login').on('post', auth_1.Auth.signIn(result(false)), function (req, res, next) {
        res.json({
            ok: true,
            token: req.body.token,
            user: req.body.user
        });
    });
    var register = new server_1.Route('/register').on('post', auth_1.Auth.register(result(false)), result());
    return new server_1.Controller(common_1.ApiUrl() + '/user', [signin, signout, islogged, register]);
}
exports.UserController = UserController;
//# sourceMappingURL=route.js.map