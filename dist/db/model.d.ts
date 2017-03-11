/// <reference types="mongoose" />
import { Schema, Model as mgModel, SchemaOptions } from 'mongoose';
import { Subject } from 'rxjs';
import { Multi } from '@ts-webapp/common';
export declare class Model<T> {
    name: string;
    definition: any;
    schema: Schema;
    model: mgModel<any>;
    constructor(name: string, definition?: any, options?: SchemaOptions);
    private static callback<T>(result, getResult?);
    makeModel(name: any): void;
    makeSchema(definition: any): void;
    create(document: T): Subject<T>;
    create(documents: T[]): Subject<T[]>;
    list(conditions?: T, projection?: any, config?: any): Subject<T[]>;
    find(conditions?: T, projection?: any, config?: any): Subject<Multi<T>>;
    count(conditions?: T): Subject<number>;
    get(id: string, projection?: any, options?: any): Subject<T>;
    set(id: string, document: T, options?: any): Subject<any>;
    update(conditions?: T, document?: T, options?: any): Subject<any>;
    remove(): Subject<number>;
    remove(id?: string | T): Subject<number>;
    remove(conditions?: T): Subject<number>;
}
