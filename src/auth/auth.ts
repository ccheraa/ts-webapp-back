import * as express from 'express';
import * as mongoose from 'mongoose';
import * as crypt from 'bcryptjs';
import { Subject } from 'rxjs';
import { Model } from '../db';
// import { AuthModel } from './model';
import * as jwt from 'jsonwebtoken';

export interface SerializeFunction {
  (user: any): Subject<any>;
}

export class Token {
  private static secret: string = 'SECRET';
  private static duration: number = 86400;
  static setup(secret: string = 'SECRET', duration: number = 86400) {
    Token.secret = secret;
    Token.duration = duration;
  }
  static sign(object: any, secret?: string, duration?: number, cb?: Function) {
    return jwt.sign(object, secret || Token.secret, {expiresIn: duration || Token.duration}, (err, token) => cb && cb(err, token));
  }
  static verify(token: string, secret?: string, cb?: Function) {
    return jwt.verify(token, secret || Token.secret, (err, object) => cb && cb(err, object));
  }
}
export class Auth {
  private static model: Model<any>;
  private static secret: string = 'SECRET';
  private static duration: number = 86400;
  private static serializeFunction: SerializeFunction;
  private static cleanFunction: SerializeFunction;
  private static deserializeFunction: SerializeFunction;
  static setup(model: Model<any>, secret: string = 'SECRET', duration: number = 86400) {
    Auth.model = model;
    Auth.secret = secret;
    Auth.duration = duration;
    return Auth;
  }
  static setupSchema(schema: mongoose.Schema) {
    schema.pre('save', function(next) {
      if (this.isModified('password')) {
        this.password = crypt.hashSync(this.password, 10);
      }
      next();
    });
    return Auth;
  }
  static setSerializeFunction(serializeFunction: SerializeFunction) {
    Auth.serializeFunction = serializeFunction;
    return Auth;
  }
  static setCleanFunction(cleanFunction: SerializeFunction) {
    Auth.cleanFunction = cleanFunction;
    return Auth;
  }
  static setDeserializeFunction(serializeFunction: SerializeFunction) {
    Auth.serializeFunction = serializeFunction;
    return Auth;
  }
  static deserializeDefault(user): Subject<any> | any {
    return Auth.model.get(user);
  }
  static serializeDefault(user): Subject<any> | any {
    return user._id;
  }
  static cleanDefault(user): Subject<any> | any {
    user.__v = undefined;
    user._id = undefined;
    user.password = undefined;
    return user;
  }
  static deserialize(user): Subject<any> | any {
    return (Auth.deserializeFunction || Auth.deserializeDefault)(user);
  }
  static serialize(user): Subject<any> | any {
    return (Auth.serializeFunction || Auth.serializeDefault)(user);
  }
  static clean(user): Subject<any> | any {
    return (Auth.cleanFunction || Auth.cleanDefault)(user);
  }
  static check(user, password): boolean {
    return crypt.compareSync(password, user.password);
  }
  static signIn(fail?: string | express.RequestHandler) {
    return function(req: express.Request, res: express.Response, next: express.NextFunction) {
      function done(err: any, result: any, serializedResult: any, flash?: string) {
        if (result) {
          Token.sign({ data: serializedResult }, Auth.secret, Auth.duration, (err, token) => {
            res.cookie('token', token, { maxAge: Auth.duration * 60000});
            req.body.user = Auth.clean(result);
            req.body.token = token;
            next();
          });
        } else {
          if (fail) {
            if (typeof fail === 'string') {
              res.redirect(fail);
            } else {
              <express.RequestHandler>fail(req, res, next);
            }
          } else {
            res.clearCookie('token');
            req.body.user = false;
            req.body.token = false;
            next();
          }
        }
      }
      Auth.model.list({username: req.body.username}).subscribe(res => {
        if (res.length) {
          let user = res[0];
          // let user: Subject<mongoose.Document> | mongoose.Document = res[0];
          if (Auth.check(user, req.body.password)) {
            let serializedUser: any = Auth.serialize(user);
            if (serializedUser.subscribe) {
              serializedUser.subscribe(serializedUserFinal => done(null, user, serializedUserFinal, 'logged'));
            } else {
              done(null, user, serializedUser, 'logged');
            }
          } else {
            done(null, false, false, 'wrong password');
          }
        } else {
          done(null, false, false, 'user not found');
        }
      });
    };
  }
  static isSignedIn(fail?: string | express.RequestHandler) {
    return function(req: express.Request, res: express.Response, next: express.NextFunction) {
      function done(err: any, result: any, flash?: string) {
        if (result) {
          req.body.user = Auth.clean(result);
          next();
        } else {
          if (fail) {
            if (typeof fail === 'string') {
              res.redirect(fail);
            } else {
              <express.RequestHandler>fail(req, res, next);
            }
          } else {
            res.clearCookie('token');
            req.body.user = false;
            req.body.token = false;
            next();
          }
        }
      }
      if (req.cookies.token) {
        req.body.token = req.cookies.token;
        Token.verify(req.cookies.token, Auth.secret, (err, user) => {
          if (err) {
            done(null, null, 'session expired');
          } else {
            user = Auth.deserialize(user.data);
            if (user.subscribe) {
              user.subscribe(user => {
                done(null, user, 'logged in');
              }, (err) => {
                done(null, null, 'no user');
              });
            } else {
              done(null, user, 'logged in');
            }
          }
        });
      } else {
        done(null, null, 'not logged in');
      }
    };
  }
  static signOut() {
    return function(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.clearCookie('token');
      req.body.user = false;
      req.body.token = false;
      next();
    };
  }
  static register(fail?: string | express.RequestHandler) {
    return function(req: express.Request, res: express.Response, next: express.NextFunction) {
      function done(err: any, result: any, flash?: string) {
        if (result) {
          req.body.registered = result;
          next();
        } else {
          if (fail) {
            if (typeof fail === 'string') {
              res.redirect(fail);
            } else {
              <express.RequestHandler>fail(req, res, next);
            }
          } else {
            req.body.registered = false;
            next();
          }
        }
      }
      let user = {
        username: req.body.username,
        password: req.body.password
      };
      Auth.model.list(user).subscribe(users => {
        if (users.length) {
          done(null, false, 'user exists');
        } else {
          Auth.model.create(user).subscribe(user => {
            done(null, user, 'registered');
          });
        }
      });
    };
  }
}
