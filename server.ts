import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
var request = require('request');

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

const lang = process.env.MWLANG || '';
const domino = require('domino');
const fs = require('fs');
const path = require('path');
console.log(`CWD is ${process.cwd()}`);
const templateA = fs.readFileSync(path.join(process.cwd(), `dist/myworry-client/browser/${lang}`, 'index.html')).toString();
const win = domino.createWindow(templateA);
win.Object = Object;
win.Math = Math;
global['window'] = win;
global['document'] = win.document;
global['branch'] = null;
global['object'] = win.object;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {

  const server = express();
  const distFolder = join(process.cwd(), `dist/myworry-client/browser/${lang}`);
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('/api/**', (req, res) => {
    console.log('API Request ' + req.url);
    request(req.url).pipe(res);
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));



  // All regular routes use the Universal engine
  server.get(`*`, (req, res) => {
    console.log(`URL: ${req.url}, Path: ${req.path}`);
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: `/${lang}/` }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port} for ${lang}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
