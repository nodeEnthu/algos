import * as gulp from 'gulp';
import * as del from 'del';
import * as path from 'path';
import * as runSequence from 'run-sequence';
import * as plumber from 'gulp-plumber';
import * as typescript from 'gulp-typescript';
import * as rename from 'gulp-rename';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as tslint from 'gulp-tslint';
import * as inlineNg2Template from 'gulp-inline-ng2-template';
import * as tslintStylish from 'gulp-tslint-stylish';
import * as shell from 'gulp-shell';
import * as nodemon from 'gulp-nodemon';
import {Server} from 'karma';
import * as ts from 'gulp-typescript';
import * as sourcemaps from 'gulp-sourcemaps';
import * as tinylrFn from 'tiny-lr';

import {PATH, LIVE_RELOAD_PORT, APP_BASE, APP_VERSION, DEPS_SRC} from './tools/config';

export const templateLocals = {
  APP_VERSION,
  APP_BASE
};

const tinylr = tinylrFn();

export function notifyLiveReload(changedFiles: string[]) {
  tinylr.changed({
    body: { files: changedFiles }
  });
}

const tsProject = ts.createProject('tsconfig.json');

function compileTs(src: string | string[], dest: string, inlineTpl?: boolean): NodeJS.ReadWriteStream {

  let result = gulp.src(src)
    .pipe(plumber())
    .pipe(sourcemaps.init());

  if (inlineTpl) {
    result = result.pipe(inlineNg2Template({ base: PATH.src.base }));
  }

  return result.pipe(typescript(tsProject))
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
}

function lintTs(src: string | string[]) {
  return gulp.src(src)
    .pipe(tslint());
}

function startKarma(singleRun = true) {
  new Server({
    configFile: `${PATH.cwd}/karma.conf.js`,
    singleRun: singleRun
  }).start();
}

// --------------
// Client.
gulp.task('font.build', () =>
  gulp.src(PATH.src.font)
    .pipe(gulp.dest(PATH.dest.app.font))
);

gulp.task('jslib.build', () => {
  const jslibSrc = gulp.src(DEPS_SRC)
    .pipe(gulp.dest(PATH.dest.app.lib));
  const srcRxjs = gulp.src('node_modules/rxjs/**/*')
    .pipe(gulp.dest(PATH.dest.app.lib + '/rxjs'));
  return [jslibSrc, srcRxjs];
});


gulp.task('jslib.watch', ['jslib.build'], () =>
  gulp.watch(DEPS_SRC, (evt) =>
    runSequence('jslib.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('css.build', () =>
  gulp.src(PATH.src.css)
    .pipe(gulp.dest(PATH.dest.app.component))
);

gulp.task('css.watch', ['css.build'], () =>
  gulp.watch(PATH.src.css, (evt) =>
    runSequence('css.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('tpl.build', () =>
  gulp.src(PATH.src.tpl)
    .pipe(gulp.dest(PATH.dest.app.component))
);

gulp.task('tpl.watch', ['tpl.build'], () =>
  gulp.watch(PATH.src.tpl, (evt) =>
    runSequence('tpl.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('ts.build', () => {
  return compileTs(PATH.src.ts, PATH.dest.app.base);
});

gulp.task('ts.watch', ['ts.build'], () =>
  gulp.watch(PATH.src.ts, (evt) => {
    runSequence('ts.build', () => notifyLiveReload([evt.path]));
  })
);

gulp.task('index.build', () => {

  const rDistPath = new RegExp(`^/${PATH.dest.app.base}`);

  function transformPath(filepath: string): string {
    arguments[0] = filepath.replace(rDistPath, '');
    return inject.transform.apply(inject.transform, arguments);
  }

  function mapPath(dep: any): string {
    return `${dep.dest}/${dep.src.split('/').pop()}`;
  }

  const injectablesDependenciesRef = PATH.src.deps
      .filter(dep => dep['inject'])
      .map(mapPath);

  return gulp.src(PATH.src.index)
    .pipe(inject(gulp.src(injectablesDependenciesRef, {read: false}), {
      transform: transformPath
    }))
    .pipe(template(templateLocals))
    .pipe(gulp.dest(PATH.dest.app.base));
});

gulp.task('index.watch', ['index.build'], () =>
  gulp.watch(PATH.src.index, (evt) =>
    runSequence('index.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('build', ['dist.clean'], (done: gulp.TaskCallback) =>
  runSequence(
    [
      'font.build',
      'jslib.build',
      'css.build',
      'tpl.build',
      'tslint',
      'ts.build'
    ],
    'index.build',
    done)
);

gulp.task('build.watch', ['dist.clean'], (done: gulp.TaskCallback) =>
  runSequence(
    [
      'font.build',
      'jslib.watch',
      'css.watch',
      'tpl.watch',
      'tslint.watch',
      'ts.watch',
    ],
    'index.watch',
    done)
);

// --------------
// Serve.
gulp.task('server.watch', () => {

  nodemon({
    script: 'server/bootstrap.ts',
    watch: 'server',
    ext: 'ts',
    env: { 'profile': process.env.profile },
    execMap: {
      ts: 'ts-node'
    }
  }).on('restart', () => {
    process.env.RESTART = true;
  });

  tinylr.listen(LIVE_RELOAD_PORT);
});

gulp.task('serve', (done: gulp.TaskCallback) =>
  runSequence('build.watch', 'server.watch', done)
);

// --------------
// Test.
gulp.task('test.build', () => {
  const src = [`${PATH.src.base}/**/*.ts`, `!${PATH.src.base}/bootstrap.ts`];
  return compileTs(src, PATH.dest.test, true);
});

gulp.task('karma.start', (done: gulp.TaskCallback) => {
  startKarma();
  done();
});

gulp.task('test.watch', ['test.clean'], (done: gulp.TaskCallback) => {
  const src = [`${PATH.src.base}/**/*.ts`, `!${PATH.src.base}/bootstrap.ts`];
  gulp.watch(src, () => runSequence('test.build'));
  runSequence(['tslint', 'test.build'], () => startKarma(false));
  done();
});

gulp.task('test', ['test.clean'], (done: gulp.TaskCallback) =>
  runSequence(['tslint', 'test.build'], 'karma.start', done)
);

// --------------
// Lint.
gulp.task('tslint', () =>
  lintTs(PATH.tslint)
);

gulp.task('tslint.watch', ['tslint'], () =>
  gulp.watch(PATH.tslint, (evt) =>
    lintTs(evt.path)
  )
);

// --------------
// Clean.
gulp.task('clean', ['dist.clean', 'test.clean', 'tmp.clean']);

gulp.task('dist.clean', () =>
  del(PATH.dest.app.base)
);

gulp.task('test.clean', () =>
  del(PATH.dest.test)
);

gulp.task('tmp.clean', () =>
  del(PATH.dest.tmp)
);

// --------------
// Postinstall.
gulp.task('npm', () =>
  shell.task(['npm prune'])
);

gulp.task('tsd', () =>
  shell.task(['tsd reinstall --clean', 'tsd link', 'tsd rebundle'])
);

gulp.task('postinstall', (done: gulp.TaskCallback) =>
  runSequence('clean', 'npm', done)
);
