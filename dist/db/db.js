"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("@ts-webapp/common"));
var mongoose_1 = require("mongoose");
// import * as mongoose from 'mongoose';
var rxjs_1 = require("rxjs");
// export const mongo = new Mongoose();
// mongoose.Promise = global.Promise;
var DB = (function () {
    function DB() {
    }
    // static accessController: Subject<[Model, express.Request, express.Response, string, express.NextFunction]> = new Subject();
    DB.connect = function (url) {
        mongoose_1.connect(url, function (err) {
            if (err) {
                DB.connection.error(err);
            }
            else {
                DB.connection.next(mongoose_1.connection);
            }
        });
        return DB.connection;
    };
    // static access(): Observable<[Model, express.Request, express.Response, string, express.NextFunction]> {
    //   return DB.accessController;
    // }
    // static canAccess(model: Model, req: express.Request, res: express.Response, id: string, cb: Function) {
    //   DB.accessController.next([model, req, res, id, () => cb()]);
    // }
    DB.test = function () {
        var promise = new Promise(function (resolve, reject) {
            // Standup.find((err, standups) => {
            //   err ? reject(err) : resolve(standups);
            // });
        });
        return promise;
    };
    return DB;
}());
DB.connection = new rxjs_1.Subject();
exports.DB = DB;
// export const dbReady = function(next?: (value: Connection) => void, error?: (error: any) => void, complete?: () => void): Subscription {
//   return DB.connection.subscribe(next, error, complete);
// }; 
//# sourceMappingURL=db.js.map