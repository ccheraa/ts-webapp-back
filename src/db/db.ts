export * from '@ts-webapp/common';
import { Model } from './model';
import { Connection, connect, connection } from 'mongoose';
import { Observable, Subject } from 'rxjs';
export class DB {
  static observer: any;
  static connection: Subject<Connection> = new Subject();
  static connect(url: string): Subject<Connection> {
    connect(url, function (err) {
      if (err) {
        DB.connection.error(err);
      } else {
        DB.connection.next(connection);
        DB.connection.complete();
      }
    });
    return DB.connection;
  }
}
