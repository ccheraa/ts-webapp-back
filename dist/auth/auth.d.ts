/// <reference types="mongoose" />
/// <reference types="express" />
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';
import { Subject } from 'rxjs';
import { Model } from '../db';
export interface SerializeFunction {
    (user: any): Subject<any>;
}
export declare class Token {
    private static secret;
    private static duration;
    static setup(secret?: string, duration?: number): void;
    static sign(object: any, secret?: string, duration?: number, cb?: Function): void;
    static verify(token: string, secret?: string, cb?: Function): void;
}
export declare class Auth {
    private static model;
    private static secret;
    private static duration;
    private static serializeFunction;
    private static cleanFunction;
    private static deserializeFunction;
    static setup(model: Model<any>, secret?: string, duration?: number): typeof Auth;
    static setupSchema(schema: Schema): typeof Auth;
    static setSerializeFunction(serializeFunction: SerializeFunction): typeof Auth;
    static setCleanFunction(cleanFunction: SerializeFunction): typeof Auth;
    static setDeserializeFunction(serializeFunction: SerializeFunction): typeof Auth;
    static deserializeDefault(user: any): Subject<any> | any;
    static serializeDefault(user: any): Subject<any> | any;
    static cleanDefault(user: any): Subject<any> | any;
    static deserialize(user: any): Subject<any> | any;
    static serialize(user: any): Subject<any> | any;
    static clean(user: any): Subject<any> | any;
    static check(user: any, password: any): boolean;
    static signIn(fail?: string | RequestHandler): (req: Request, res: Response, next: NextFunction) => void;
    static isSignedIn(fail?: string | RequestHandler): (req: Request, res: Response, next: NextFunction) => void;
    static signOut(): (req: Request, res: Response, next: NextFunction) => void;
    static register(fail?: string | RequestHandler): (req: Request, res: Response, next: NextFunction) => void;
}
