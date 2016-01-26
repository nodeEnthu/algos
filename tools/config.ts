import * as argv from 'yargs';
import * as fs from 'fs';

const CWD = process.cwd();
const pkg = JSON.parse(fs.readFileSync(`${CWD}/package.json`, 'utf8'));

// --------------
// Configuration.
const ENV: string = argv['env'] || process.env.profile || 'dev';
process.env.profile = ENV;

export const PORT: number = argv['port'] || 5555;
export const LIVE_RELOAD_PORT: number = argv['reload-port'] || 4002;
export const APP_BASE: string = argv['base'] || '/';
export const APP_VERSION: string = pkg.version;

const CLIENT_SRC_BASE = 'client';
const CLIENT_DEST_BASE = 'dist';
export const LIB_DEST             = `${CLIENT_DEST_BASE}/lib`;


export const PATH = {
  cwd: CWD,
  tslint: [
    `${CLIENT_SRC_BASE}/**/*.ts`,
    `${CWD}/server/**/*.ts`,
    `tools/**/*.ts`,
    `!tools/typings/**`,
    `${CWD}/gulpfile.ts`
  ],
  src: {
    base: CLIENT_SRC_BASE,
    deps: [
      {src: 'node_modules/es6-shim/es6-shim.min.js', dest: LIB_DEST, inject: true},
      {src: 'node_modules/systemjs/dist/system-polyfills.js', dest: LIB_DEST},
      {src: 'node_modules/systemjs/dist/system.src.js', dest: LIB_DEST, inject: true},
      { src: 'node_modules/angular2/bundles/angular2-polyfills.js', dest: LIB_DEST, inject: true },

      {src: `${CLIENT_SRC_BASE}/system.config.js`, dest: LIB_DEST, inject: true},

      {src: 'node_modules/angular2/bundles/angular2.js', dest: LIB_DEST, inject: true},
      {src: 'node_modules/angular2/bundles/router.js', dest: LIB_DEST, inject: true},
      {src: 'node_modules/angular2/bundles/http.js', dest: LIB_DEST, inject: true},

      {src: 'node_modules/bootstrap/dist/css/bootstrap.min.css', dest: LIB_DEST, inject: true}
    ],
    font: [
      'node_modules/bootstrap/dist/fonts/*'
    ],
    index: `${CLIENT_SRC_BASE}/index.html`,
    tpl: `${CLIENT_SRC_BASE}/components/**/*.html`,
    css: [
      `${CLIENT_SRC_BASE}/components/**/*.css`,
    ],
    ts: [
      `${CLIENT_SRC_BASE}/**/*.ts`,
      `!${CLIENT_SRC_BASE}/**/*_spec.ts`
    ]
  },
  dest: {
    app: {
      base: CLIENT_DEST_BASE,
      lib: `${CLIENT_DEST_BASE}/lib`,
      font: `${CLIENT_DEST_BASE}/fonts`,
      component: `${CLIENT_DEST_BASE}/components`
    },
    test: 'test',
    tmp: '.tmp'
  }
};

export const DEPS_SRC = PATH.src.deps.map(it => it.src);



