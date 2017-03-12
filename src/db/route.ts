import { DB } from './db';
import { ResponseType } from '@ts-webapp/common';
import { Model } from './model';
import { extend } from '../utils';
import { Controller, Route } from '../server';
import { RequestHandler, Request, Response, NextFunction } from 'express';

export function sendResponse(res: Response, data: any) {
  res.json({ ok: true, data});
}
export function sendErrorResponse(res: Response, errors?: any[]) {
  res.json({ ok: false, errors});
}

export function ModelRoutes<T>(model: Model<T>, url: string = '/', access?: RequestHandler, format?: RequestHandler): Route[] {
  let find: Route = new Route(url + '/find')
    .on('post', access, (req: Request, res: Response, next: NextFunction) => {
      model.find(req.body.conditions, req.body.projection, req.body.options).subscribe(
        documents => sendResponse(res, documents),
        err => sendErrorResponse(res, err)
      );
    });
  let count: Route = new Route(url + '/count')
    .on(['post', 'get'], access, (req: Request, res: Response, next: NextFunction) => {
      model.count(req.body.conditions).subscribe(
        count => sendResponse(res, count),
        err => sendErrorResponse(res, err)
      );
    });
  let multi: Route = new Route(url)
    .on('post', (req: Request, res: Response, next: NextFunction) => {
      let docs: any[] = [];
      model.create(req.body.document).subscribe(
        doc => {
          if (typeof (req.body.document as Object[]).forEach === 'function') {
            docs.push(doc);
          } else {
            sendResponse(res, doc);
          }
        },
        err => sendErrorResponse(res, err),
        () => (typeof (req.body.document as Object[]).forEach === 'function') && sendResponse(res, docs)
      );
    })
    .on('get', access, (req: Request, res: Response, next: NextFunction) => {
      model.list(req.query.doc).subscribe(
        documents => model.count(req.query.conditions).subscribe(count => {
          if (format) {
            req.body.data = documents;
            format(req, res, () => sendResponse(res, req.body.data));
          } else {
            sendResponse(res, documents);
          }
        }),
        err => sendErrorResponse(res, err)
      );
    })
    .on('put', (req: Request, res: Response, next: NextFunction) => {
    // TODO: options not used
      model.update(req.body.conditions, req.body.document).subscribe(
        result => sendResponse(res, result),
        err => sendErrorResponse(res, err)
      );
    })
    .on('delete', (req: Request, res: Response, next: NextFunction) => {
      model.remove(req.body.conditions).subscribe(
        result => sendResponse(res, result),
        err => sendErrorResponse(res, err)
      );
    });
  let single: Route = new Route(url + '/:id([0-9a-f]+)')
    .on('get', (req: Request, res: Response, next: NextFunction) => {
    // TODO: req.query.projection and req.query.options not used
      model.get(req.params.id, req.query.projection, req.query.options).subscribe(
        document => {
          if (format) {
            req.body.data = document;
            format(req, res, () => sendResponse(res, req.body.data));
          } else {
            sendResponse(res, document);
          }
        },
        err => sendErrorResponse(res, err)
      );
    })
    .on(['put', 'post'], (req: Request, res: Response, next: NextFunction) => {
      let obs = model.set(req.params.id, req.body.document);
      obs.subscribe(
        result => sendResponse(res, result),
        err => sendErrorResponse(res, err)
      );
    })
    .on('delete', (req: Request, res: Response, next: NextFunction) => {
      model.remove(req.params.id).subscribe(
        result => sendResponse(res, result),
        err => sendErrorResponse(res, err)
      );
    });
  return [single, multi, find, count];
};
export function ModelController<T>(model: Model<T>, baseurl: string = '/', url: string = '/', access?: RequestHandler, format?: RequestHandler): Controller {
  return new Controller(baseurl, ModelRoutes(model, url, access, format));
};