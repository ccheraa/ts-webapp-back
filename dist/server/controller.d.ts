/// <reference types="express" />
import { Router, RequestHandler, Application } from 'express';
import { Route } from './route';
export declare class Controller {
    base: string;
    routes: Route[];
    router: Router;
    constructor(base?: string, routes?: Route[]);
    add(fun: RequestHandler, url?: string, method?: string): Route;
    setup(app: Application): void;
}
