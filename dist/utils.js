"use strict";
function extend() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var newObj = {};
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];
        for (var key in obj) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
exports.extend = extend;
;
//# sourceMappingURL=utils.js.map