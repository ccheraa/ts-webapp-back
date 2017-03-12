"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("@ts-webapp/common"));
var mongoose_1 = require("mongoose");
var rxjs_1 = require("rxjs");
var DB = (function () {
    function DB() {
    }
    DB.connect = function (url) {
        mongoose_1.connect(url, function (err) {
            if (err) {
                DB.connection.error(err);
            }
            else {
                DB.connection.next(mongoose_1.connection);
                DB.connection.complete();
            }
        });
        return DB.connection;
    };
    return DB;
}());
DB.connection = new rxjs_1.Subject();
exports.DB = DB;
//# sourceMappingURL=db.js.map