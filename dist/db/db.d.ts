/// <reference types="mongoose" />
/// <reference types="es6-promise" />
export * from '@ts-webapp/common';
import { Connection } from 'mongoose';
import { Subject } from 'rxjs';
export declare class DB {
    static observer: any;
    static connection: Subject<Connection>;
    static connect(url: string): Subject<Connection>;
    static test(): Promise<{}>;
}
