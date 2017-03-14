import { Router, RequestHandler, Application } from 'express';
import { Route } from './route';
export class Controller {
  public router: Router = Router();
  constructor(public base: string = '/', public routes: Route[] = []) {}
  public add(fun: RequestHandler, url: string = '/', method: string = 'get') {
    let route = Route.create(fun, url, method);
    this.routes.push(route);
    return route;
  }
  public setup(app: Application): void {
    this.routes.forEach((route) => {
      route.handles.forEach((handle, method) => {
        this.router[method](route.url, ...handle.filter(route => !!route));
      });
    });
    this.router === null || app.use(this.base, this.router);
  }
}