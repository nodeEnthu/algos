import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as openResource from 'open';
import {resolve} from 'path';

import {APP_BASE, LIVE_RELOAD_PORT, PATH, PORT} from '../tools/config';
import * as contactRouter from './contact/contact.router';

const INDEX_DEST_PATH = resolve(PATH.cwd, PATH.dest.app.base, 'index.html');

const server = express();

server.use(
  APP_BASE,
  connectLivereload({ port: LIVE_RELOAD_PORT })
);

server.use(express.static(PATH.dest.app.base));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get('/api/**', (req, res, next) => {
  // TODO: remove this. It just mimics a delay in the backend.
  const delay = Math.floor((Math.random() * 300) + 1);
  setTimeout(() => next(), delay);
});

server.use('/api/contact', contactRouter);

server.get(APP_BASE + '*', (req, res) =>
  res.sendFile(INDEX_DEST_PATH)
);

server.listen(PORT, () => {
  const url = 'http://localhost:' + PORT + APP_BASE;
  if (process.env.RESTART) {
    console.log('Server restarted at: ', url);
  } else {
    openResource(url);
    console.log('Server started at: ', url);
  }
});


