import { Controller, Route, Server } from '../server';
import { Auth } from './auth';
import { AuthModel } from './model';
import { ApiUrl } from '@ts-webapp/common';
export function UserController(model: AuthModel<any>) {
  Auth.setup(model);
  function result(ok: Boolean = true) {
    return (req, res, next) => {
      res.json({ok});
    };
  }
  let islogged: Route = new Route('/logged').on(['post', 'get'], Auth.isSignedIn(result(false)), (req, res, next) => {
      res.json({
        ok: true,
        token: req.body.token,
        user: req.body.user
      });
    });
  let signout: Route = new Route('/logout').on('post', Auth.signOut(), result());
  let signin: Route = new Route('/login').on('post', Auth.signIn(result(false)), (req, res, next) => {
      res.json({
        ok: true,
        token: req.body.token,
        user: req.body.user
      });
    });
  let register: Route = new Route('/register').on('post', Auth.register(result(false)), result());
  return new Controller(ApiUrl() + '/user', [signin, signout, islogged, register]);
}