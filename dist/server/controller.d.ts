/// <reference types="express" />
import * as express from 'express';
import { Route } from './route';
export declare class Controller {
    base: string;
    routes: Route[];
    router: express.Router;
    constructor(base?: string, routes?: Route[]);
    add(fun: express.RequestHandler, url?: string, method?: string): Route;
    setup(app: express.Application): void;
}
