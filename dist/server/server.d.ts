/// <reference types="node" />
/// <reference types="express" />
import * as express from 'express';
import * as http from 'http';
import { Controller } from './controller';
export declare const serverDefaultConfig: {
    port: number;
    host: string;
};
export declare class Server {
    static main: Server;
    static servers: http.Server[];
    config: {
        port: number;
        host: string;
    };
    app: express.Express;
    controllers: Controller[];
    statics: any[];
    routes: any[];
    middlewares: any[];
    server: http.Server;
    static bootstrap(config?: any): Server;
    constructor(config?: any);
    applyRoutes(controllers: Controller[]): void;
    static(dir: string, url?: string): void;
    default(...functions: express.RequestHandler[]): void;
    route(url: string, ...functions: express.RequestHandler[]): void;
    middleware(...functions: express.RequestHandler[]): void;
    ip(): string;
    private static error(error);
    start(callback?: Function): void;
    static stop(callback?: Function): void;
    stop(callback?: Function): void;
    routeReport(): any;
}
