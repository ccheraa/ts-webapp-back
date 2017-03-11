"use strict";
var mongoose_1 = require("mongoose");
var rxjs_1 = require("rxjs");
var Model = (function () {
    function Model(name, definition, options) {
        this.name = name;
        this.definition = definition;
        this.makeSchema(definition);
        this.makeModel(name);
    }
    Model.callback = function (result, getResult) {
        // console.info('preparing callback...');
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // console.log('getting result...');
            // console.log(args);
            var err = args[0];
            if (err) {
                result.error(err);
            }
            else {
                args.shift();
                var ret = getResult ? getResult.apply(null, args) : args[0];
                result.next(ret);
                result.complete();
            }
            // console.info('callback prepared.');
        };
    };
    Model.prototype.makeModel = function (name) {
        this.model = mongoose_1.model(name, this.schema);
    };
    Model.prototype.makeSchema = function (definition) {
        this.schema = new mongoose_1.Schema(definition);
    };
    Model.prototype.create = function (document) {
        var _this = this;
        var result = new rxjs_1.Subject();
        if (typeof document.forEach === 'function') {
            var documents_1 = document;
            var current_1 = 0;
            documents_1.forEach(function (doc) { return _this.create(doc).subscribe(function (res) { return result.next(res) || (++current_1 === documents_1.length) && result.complete(); }); }, function (err) { return result.error(err); });
        }
        else {
            var model_1 = new this.model(document);
            model_1.save(Model.callback(result));
        }
        return result;
    };
    // R
    Model.prototype.list = function (conditions, projection, config) {
        var result = new rxjs_1.Subject();
        // while (args.length < 3 ) args.push(undefined);
        // console.log('listing...');
        this.model.find.apply(this.model, [conditions, projection, config, Model.callback(result)]);
        return result;
    };
    Model.prototype.find = function (conditions, projection, config) {
        var _this = this;
        var result = new rxjs_1.Subject();
        this.list(conditions, projection, config).subscribe(function (documents) { return _this.count(conditions).subscribe(function (count) {
            result.next({ rows: documents, total: count });
            result.complete();
        }); });
        return result;
    };
    Model.prototype.count = function (conditions) {
        var result = new rxjs_1.Subject();
        this.model.count(conditions, Model.callback(result, function (count) { return count; }));
        return result;
    };
    Model.prototype.get = function (id, projection, options) {
        var result = new rxjs_1.Subject();
        this.model.findById.apply(this.model, [id, projection, options, Model.callback(result)]);
        return result;
    };
    // U
    Model.prototype.set = function (id, document, options) {
        var result = new rxjs_1.Subject();
        this.model.update.apply(this.model, [{ _id: id }, document, options, Model.callback(result, function (response) { return ({ found: response.n, set: response.nModified }); })]);
        return result;
    };
    Model.prototype.update = function (conditions, document, options) {
        var result = new rxjs_1.Subject();
        if (typeof options === 'object') {
            options.multi = true;
        }
        else {
            options = { multi: true };
        }
        this.model.update(conditions, document, options, Model.callback(result, function (response) { return ({ found: response.n, set: response.nModified }); }));
        return result;
    };
    Model.prototype.remove = function (conditions) {
        var result = new rxjs_1.Subject();
        this.model.remove((typeof conditions === 'string') ? { _id: conditions } : conditions, Model.callback(result, function (response) { return response.result.n; }));
        return result;
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map