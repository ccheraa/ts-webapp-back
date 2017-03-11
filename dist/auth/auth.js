"use strict";
var crypt = require("bcryptjs");
// import { AuthModel } from './model';
var jwt = require("jsonwebtoken");
var Token = (function () {
    function Token() {
    }
    Token.setup = function (secret, duration) {
        if (secret === void 0) { secret = 'SECRET'; }
        if (duration === void 0) { duration = 86400; }
        Token.secret = secret;
        Token.duration = duration;
    };
    Token.sign = function (object, secret, duration, cb) {
        return jwt.sign(object, secret || Token.secret, { expiresIn: duration || Token.duration }, function (err, token) { return cb && cb(err, token); });
    };
    Token.verify = function (token, secret, cb) {
        return jwt.verify(token, secret || Token.secret, function (err, object) { return cb && cb(err, object); });
    };
    return Token;
}());
Token.secret = 'SECRET';
Token.duration = 86400;
exports.Token = Token;
var Auth = (function () {
    function Auth() {
    }
    Auth.setup = function (model, secret, duration) {
        if (secret === void 0) { secret = 'SECRET'; }
        if (duration === void 0) { duration = 86400; }
        Auth.model = model;
        Auth.secret = secret;
        Auth.duration = duration;
        return Auth;
    };
    Auth.setupSchema = function (schema) {
        schema.pre('save', function (next) {
            if (this.isModified('password')) {
                this.password = crypt.hashSync(this.password, 10);
            }
            next();
        });
        return Auth;
    };
    Auth.setSerializeFunction = function (serializeFunction) {
        Auth.serializeFunction = serializeFunction;
        return Auth;
    };
    Auth.setCleanFunction = function (cleanFunction) {
        Auth.cleanFunction = cleanFunction;
        return Auth;
    };
    Auth.setDeserializeFunction = function (serializeFunction) {
        Auth.serializeFunction = serializeFunction;
        return Auth;
    };
    Auth.deserializeDefault = function (user) {
        return Auth.model.get(user);
    };
    Auth.serializeDefault = function (user) {
        return user._id;
    };
    Auth.cleanDefault = function (user) {
        user.__v = undefined;
        user._id = undefined;
        user.password = undefined;
        return user;
    };
    Auth.deserialize = function (user) {
        return (Auth.deserializeFunction || Auth.deserializeDefault)(user);
    };
    Auth.serialize = function (user) {
        return (Auth.serializeFunction || Auth.serializeDefault)(user);
    };
    Auth.clean = function (user) {
        return (Auth.cleanFunction || Auth.cleanDefault)(user);
    };
    Auth.check = function (user, password) {
        return crypt.compareSync(password, user.password);
    };
    Auth.signIn = function (fail) {
        return function (req, res, next) {
            function done(err, result, serializedResult, flash) {
                if (result) {
                    Token.sign({ data: serializedResult }, Auth.secret, Auth.duration, function (err, token) {
                        res.cookie('token', token, { maxAge: Auth.duration * 60000 });
                        req.body.user = Auth.clean(result);
                        req.body.token = token;
                        next();
                    });
                }
                else {
                    if (fail) {
                        if (typeof fail === 'string') {
                            res.redirect(fail);
                        }
                        else {
                            fail(req, res, next);
                        }
                    }
                    else {
                        res.clearCookie('token');
                        req.body.user = false;
                        req.body.token = false;
                        next();
                    }
                }
            }
            Auth.model.list({ username: req.body.username }).subscribe(function (res) {
                if (res.length) {
                    var user_1 = res[0];
                    // let user: Subject<mongoose.Document> | mongoose.Document = res[0];
                    if (Auth.check(user_1, req.body.password)) {
                        var serializedUser = Auth.serialize(user_1);
                        if (serializedUser.subscribe) {
                            serializedUser.subscribe(function (serializedUserFinal) { return done(null, user_1, serializedUserFinal, 'logged'); });
                        }
                        else {
                            done(null, user_1, serializedUser, 'logged');
                        }
                    }
                    else {
                        done(null, false, false, 'wrong password');
                    }
                }
                else {
                    done(null, false, false, 'user not found');
                }
            });
        };
    };
    Auth.isSignedIn = function (fail) {
        return function (req, res, next) {
            function done(err, result, flash) {
                if (result) {
                    req.body.user = Auth.clean(result);
                    next();
                }
                else {
                    if (fail) {
                        if (typeof fail === 'string') {
                            res.redirect(fail);
                        }
                        else {
                            fail(req, res, next);
                        }
                    }
                    else {
                        res.clearCookie('token');
                        req.body.user = false;
                        req.body.token = false;
                        next();
                    }
                }
            }
            if (req.cookies.token) {
                req.body.token = req.cookies.token;
                Token.verify(req.cookies.token, Auth.secret, function (err, user) {
                    if (err) {
                        done(null, null, 'session expired');
                    }
                    else {
                        user = Auth.deserialize(user.data);
                        if (user.subscribe) {
                            user.subscribe(function (user) {
                                done(null, user, 'logged in');
                            }, function (err) {
                                done(null, null, 'no user');
                            });
                        }
                        else {
                            done(null, user, 'logged in');
                        }
                    }
                });
            }
            else {
                done(null, null, 'not logged in');
            }
        };
    };
    Auth.signOut = function () {
        return function (req, res, next) {
            res.clearCookie('token');
            req.body.user = false;
            req.body.token = false;
            next();
        };
    };
    Auth.register = function (fail) {
        return function (req, res, next) {
            function done(err, result, flash) {
                if (result) {
                    req.body.registered = result;
                    next();
                }
                else {
                    if (fail) {
                        if (typeof fail === 'string') {
                            res.redirect(fail);
                        }
                        else {
                            fail(req, res, next);
                        }
                    }
                    else {
                        req.body.registered = false;
                        next();
                    }
                }
            }
            var user = {
                username: req.body.username,
                password: req.body.password
            };
            Auth.model.list(user).subscribe(function (users) {
                if (users.length) {
                    done(null, false, 'user exists');
                }
                else {
                    Auth.model.create(user).subscribe(function (user) {
                        done(null, user, 'registered');
                    });
                }
            });
        };
    };
    return Auth;
}());
Auth.secret = 'SECRET';
Auth.duration = 86400;
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map