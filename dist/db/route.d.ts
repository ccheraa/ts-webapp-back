/// <reference types="express" />
import { Model } from './model';
import { Controller, Route } from '../server';
import { RequestHandler, Response } from 'express';
export declare function sendResponse(res: Response, data: any): void;
export declare function sendErrorResponse(res: Response, errors?: any[]): void;
export declare function ModelRoutes<T>(model: Model<T>, url?: string, access?: RequestHandler, format?: RequestHandler): Route[];
export declare function ModelController<T>(model: Model<T>, baseurl?: string, url?: string, access?: RequestHandler, format?: RequestHandler): Controller;
