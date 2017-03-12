/// <reference types="node" />
/// <reference types="express" />
import { Express, RequestHandler } from 'express';
import { Server as HttpServer } from 'http';
import { Controller } from './controller';
export declare const serverDefaultConfig: {
    port: number;
    host: string;
};
export declare class Server {
    static main: Server;
    static servers: HttpServer[];
    config: {
        port: number;
        host: string;
    };
    app: Express;
    controllers: Controller[];
    statics: any[];
    routes: any[];
    middlewares: any[];
    server: HttpServer;
    static bootstrap(config?: any): Server;
    constructor(config?: any);
    applyRoutes(controllers: Controller[]): void;
    static(dir: string, url?: string): void;
    default(...functions: RequestHandler[]): void;
    route(url: string, ...functions: RequestHandler[]): void;
    middleware(...functions: RequestHandler[]): void;
    ip(): string;
    private static error(error);
    start(callback?: Function): void;
    static stop(callback?: Function): void;
    stop(callback?: Function): void;
    routeReport(): any;
}
