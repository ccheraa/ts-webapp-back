/// <reference types="express" />
import * as express from 'express';
export declare class Handles {
    constructor();
    forEach(fun: Function): void;
    map(fun: Function): any[];
    on(method: string | string[], ...functions: (express.RequestHandler | string)[]): Handles;
}
export declare class Route {
    url: string;
    handles: Handles;
    constructor(url?: string);
    static create(fun: express.RequestHandler, url?: string, method?: string | string[]): Route;
    on(method: string | string[], ...functions: (express.RequestHandler | string)[]): Route;
}
