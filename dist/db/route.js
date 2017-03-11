"use strict";
var server_1 = require("../server");
function sendResponse(res, data) {
    res.json({ ok: true, data: data });
}
exports.sendResponse = sendResponse;
function sendErrorResponse(res, errors) {
    res.json({ ok: false, errors: errors });
}
exports.sendErrorResponse = sendErrorResponse;
function ModelRoutes(model, url, access, format) {
    if (url === void 0) { url = '/'; }
    var find = new server_1.Route(url + '/find')
        .on('post', access, function (req, res, next) {
        model.find(req.body.conditions, req.body.projection, req.body.options).subscribe(function (documents) { return sendResponse(res, documents); }, function (err) { return sendErrorResponse(res, err); });
    });
    var count = new server_1.Route(url + '/count')
        .on(['post', 'get'], access, function (req, res, next) {
        model.count(req.body.conditions).subscribe(function (count) { return sendResponse(res, count); }, function (err) { return sendErrorResponse(res, err); });
    });
    var multi = new server_1.Route(url)
        .on('post', function (req, res, next) {
        var docs = [];
        model.create(req.body.document).subscribe(function (doc) {
            if (typeof req.body.document.forEach === 'function') {
                docs.push(doc);
            }
            else {
                sendResponse(res, doc);
            }
        }, function (err) { return sendErrorResponse(res, err); }, function () { return (typeof req.body.document.forEach === 'function') && sendResponse(res, docs); });
    })
        .on('get', access, function (req, res, next) {
        model.list(req.query.doc).subscribe(function (documents) { return model.count(req.query.conditions).subscribe(function (count) {
            if (format) {
                req.body.data = documents;
                format(req, res, function () { return sendResponse(res, req.body.data); });
            }
            else {
                sendResponse(res, documents);
            }
        }); }, function (err) { return sendErrorResponse(res, err); });
    })
        .on('put', function (req, res, next) {
        // TODO: options not used
        model.update(req.body.conditions, req.body.document).subscribe(function (result) { return sendResponse(res, result); }, function (err) { return sendErrorResponse(res, err); });
    })
        .on('delete', function (req, res, next) {
        model.remove(req.body.conditions).subscribe(function (result) { return sendResponse(res, result); }, function (err) { return sendErrorResponse(res, err); });
    });
    var single = new server_1.Route(url + '/:id([0-9a-f]+)')
        .on('get', function (req, res, next) {
        // TODO: req.query.projection and req.query.options not used
        model.get(req.params.id, req.query.projection, req.query.options).subscribe(function (document) {
            if (format) {
                req.body.data = document;
                format(req, res, function () { return sendResponse(res, req.body.data); });
            }
            else {
                sendResponse(res, document);
            }
        }, function (err) { return sendErrorResponse(res, err); });
    })
        .on(['put', 'post'], function (req, res, next) {
        var obs = model.set(req.params.id, req.body.document);
        obs.subscribe(function (result) { return sendResponse(res, result); }, function (err) { return sendErrorResponse(res, err); });
    })
        .on('delete', function (req, res, next) {
        model.remove(req.params.id).subscribe(function (result) { return sendResponse(res, result); }, function (err) { return sendErrorResponse(res, err); });
    });
    return [single, multi, find, count];
}
exports.ModelRoutes = ModelRoutes;
;
function ModelController(model, baseurl, url, access, format) {
    if (baseurl === void 0) { baseurl = '/'; }
    if (url === void 0) { url = '/'; }
    return new server_1.Controller(baseurl, ModelRoutes(model, url, access, format));
}
exports.ModelController = ModelController;
;
//# sourceMappingURL=route.js.map