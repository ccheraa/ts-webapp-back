import { Model } from '../db';
export declare class AuthModel<T> extends Model<T> {
    makeSchema(definition: any): void;
    makeModel(name: any): void;
}
