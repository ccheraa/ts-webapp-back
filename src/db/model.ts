import { Schema, Model as mgModel, model, Document, SchemaOptions } from 'mongoose';
import { Observable, Subject, Subscription } from 'rxjs';
import { Multi } from '@ts-webapp/common';

export class Model<T> {
  schema: Schema;
  model: mgModel<any>;
  constructor(public name: string, public definition?: any, options?: SchemaOptions) {
    this.makeSchema(definition);
    this.makeModel(name);
  }
  private static callback<T>(result: Subject<T>, getResult?: (...args) => any) {
    // console.info('preparing callback...');
    return (...args) => {
      // console.log('getting result...');
      // console.log(args);
      let err = args[0];
      if (err) {
        result.error(err);
      } else {
        args.shift();
        let ret = getResult ? getResult.apply(null, args) : args[0];
        result.next(ret);
        result.complete();
      }
      // console.info('callback prepared.');
    };
  }
  makeModel(name) {
    this.model = model(name, this.schema);
  }
  makeSchema(definition) {
    this.schema = new Schema(definition);
  }
  // C
  create(document: T): Subject<T>;
  create(documents: T[]): Subject<T[]>;
  create(document: T | T[]): Subject<T | T[]> {
    let result: Subject<any> = new Subject();
    if (typeof (document as T[]).forEach === 'function') {
      let documents = document as T[];
      let current = 0;
      documents.forEach(doc => this.create(doc).subscribe(
        (res: any) => result.next(res) || (++current === documents.length) && result.complete()),
        (err: any) => result.error(err)
      );
    } else {
      let model = new this.model(document);
      model.save(Model.callback<T>(result));
    }
    return result;
  }
  // R
  list(conditions?: T, projection?: any, config?: any): Subject<T[]> {
    let result: Subject<T[]> = new Subject();
    // while (args.length < 3 ) args.push(undefined);
    // console.log('listing...');
    this.model.find.apply(this.model, [conditions, projection, config, Model.callback<T[]>(result)]);
    return result;
  }
  find(conditions?: T, projection?: any, config?: any): Subject<Multi<T>> {
    let result: Subject<Multi<T>> = new Subject();
    this.list(conditions, projection, config).subscribe(
      documents => this.count(conditions).subscribe(count => {
        result.next({ rows: documents, total: count });
        result.complete();
      })
    );
    return result;
  }
  count(conditions?: T): Subject<number> {
    let result: Subject<number> = new Subject();
    this.model.count(conditions, Model.callback<number>(result, count => count));
    return result;
  }
  get(id: string, projection?: any, options?: any): Subject<T> {
    let result: Subject<T> = new Subject();
    this.model.findById.apply(this.model, [id, projection, options, Model.callback<T>(result)]);
    return result;
  }
  // U
  set(id: string, document: T, options?: any): Subject<any> {
    let result: Subject<any> = new Subject();
    this.model.update.apply(this.model, [{_id: id}, document, options, Model.callback<any>(result,
      response => ({ found: response.n, set: response.nModified })
    )]);
    return result;
  }
  update(conditions?: T, document?: T, options?: any): Subject<any> {
    let result: Subject<any> = new Subject();
    if (typeof options === 'object') {
      options.multi = true;
    } else {
      options = {multi: true};
    }
    this.model.update(conditions, document, options, Model.callback<any>(result,
      response => ({ found: response.n, set: response.nModified })
    ));
    return result;
  }
  // D
  remove(): Subject<number>;
  remove(id?: string | T): Subject<number>;
  remove(conditions?: T): Subject<number>;
  remove(conditions?: string | T): Subject<number> {
    let result: Subject<number> = new Subject();
    this.model.remove((typeof conditions === 'string') ? {_id: conditions} : conditions, Model.callback<any>(result, response => response.result.n));
    return result;
  }
}
