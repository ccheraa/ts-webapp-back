/// <reference types="mongoose" />
export * from '@ts-webapp/common';
import { Connection } from 'mongoose';
import { Subject } from 'rxjs';
export declare class DB {
    static observer: any;
    static connection: Subject<Connection>;
    static connect(url: string): Subject<Connection>;
}
