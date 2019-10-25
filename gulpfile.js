'use strict';
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var bower       = require('gulp-bower');
var modRewrite  = require('connect-modrewrite');
var prettify    = require('gulp-jsbeautifier');
var jshint      = require('gulp-jshint');
var rimraf      = require("gulp-rimraf");
var uglify      = require("gulp-uglify-es").default;
var usemin      = require("gulp-usemin");
var minifyCss   = require('gulp-minify-css');
var minifyHtml  = require('gulp-minify-html');
var ngHtml2Js   = require("gulp-ng-html2js");
var rollup      = require("rollup");
var resolve     = require("rollup-plugin-node-resolve");
var babel       = require("rollup-plugin-babel");
var terser      = require("rollup-plugin-terser").terser;
var concat      = require("gulp-concat");
var gutil       = require("gulp-util");
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var colors      = require("colors");
var factory     = require("widget-tester").gulpTaskFactory;
var fs          = require('fs');
var os          = require('os');

require("./ch-build");
require("./i18n-build");
require("./css-build");

//--------------------- Variables --------------------------------------

var appJSFiles = [
  "./web/scripts/app.js",
  "./web/scripts/**/*.js"
];

var partialsHTMLFiles = [
  "./web/partials/**/*.html"
];

var unitTestFiles = [
  "web/bower_components/jquery/dist/jquery.js",
  "web/bower_components/angular/angular.js",
  "web/bower_components/angular-sanitize/angular-sanitize.js",
  "web/bower_components/angular-animate/angular-animate.js",
  "web/bower_components/angular-touch/angular-touch.js",
  "web/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
  "web/bower_components/angular-ui-router/release/angular-ui-router.js",
  "web/bower_components/angular-translate/angular-translate.js",
  "web/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "web/bower_components/checklist-model/checklist-model.js",
  "web/bower_components/ngstorage/ngStorage.js",
  "web/bower_components/angular-spinner/dist/angular-spinner.js",
  "web/bower_components/spin.js/spin.js",
  "web/bower_components/angular-cookies/angular-cookies.js",
  "web/bower_components/lodash/dist/lodash.js",
  "web/bower_components/ng-csv/build/ng-csv.js",
  "web/bower_components/ng-tags-input/ng-tags-input.js",
  "web/bower_components/angular-md5/angular-md5.min.js",
  "web/bower_components/angular-local-storage/dist/angular-local-storage.js",
  "web/bower_components/angular-messages/angular-messages.js",
  "web/bower_components/angular-mocks/angular-mocks.js",
  "web/bower_components/q/q.js",
  "web/bower_components/angular-ui-codemirror/ui-codemirror.js",
  "web/bower_components/angular-truncate/src/truncate.js",
  "web/bower_components/angular-slugify/angular-slugify.js",
  'web/bower_components/Sortable/Sortable.js',
  "web/bower_components/rv-angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/position-setting.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/tooltip.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/file-selector.js",
  "web/bower_components/widget-settings-ui-components/dist/js/angular/widget-button-toolbar.js",
  "node_modules/widget-tester/mocks/translate-mock.js",
  "web/tmp/partials.js",
  "web/scripts/components/**/*.js",
  "web/scripts/common-header/**/*.js",
  "node_modules/widget-tester/mocks/segment-analytics-mock.js",
  "web/scripts/storage-selector-app.js",
  "web/scripts/app.js",
  "web/scripts/billing/**/*.js",
  "web/scripts/common/**/*.js",
  "web/scripts/config/test.js",
  "web/scripts/displays/**/*.js",
  "web/scripts/editor/**/*.js",
  "web/scripts/launcher/**/*.js",
  "web/scripts/schedules/**/*.js",
  "web/scripts/storage/**/*.js",
  "web/scripts/template-editor/**/*.js",
  "web/scripts/widgets/**/*.js",
  "test/unit/**/mocks/*.js",
  "test/unit/**/*.tests.js",
  "test/unit/**/*-spec.js",
  "test/unit/common/services/svc-zendesk-override.js"
];

//------------------------- Browser Sync --------------------------------

gulp.task('browser-sync', function() {
  browserSync({
    startPath: '/index.html',
    server: {
      baseDir: './web',
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    },
    logLevel: "debug",
    port: 8000,
    open: false
  });
});

gulp.task('browser-sync-reload', function() {
  console.log('browser-sync-reload');
  browserSync.reload();
});

//------------------------- Bower --------------------------------

/**
 * Install bower dependencies
 */
gulp.task('bower-install', ['bower-rm'], function(cb){
  return bower().on('error', function(err) {
    console.log(err);
    cb();
  });
});


/**
 *  Remove all bower dependencies
 */
gulp.task('bower-rm', function(){
  return gulp.src('assets/components', {read: false})
    .pipe(rimraf());
});

/**
 * Do a bower clean install
 */
gulp.task('bower-clean-install', ['bower-rm', 'bower-install']);


//------------------------- Watch --------------------------------
/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(partialsHTMLFiles, ['html2js']);
  gulp.watch(['./web/pricing-component.mjs'], ['pricing']);
  gulp.watch(['./web/tmp/partials.js', './web/scripts/**/*.js', './web/tmp/css/*.css', './web/index.html'], ['browser-sync-reload']);
  gulp.watch(unitTestFiles, ['test:unit']);
});


//------------------------ Tooling --------------------------

gulp.task('pretty', function() {
  return gulp.src(appJSFiles)
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./web/scripts'))
    .on('error', function (error) {
      console.error(String(error));
    });
});

gulp.task("clean-dist", function () {
  return gulp.src("dist", {read: false})
    .pipe(rimraf());
});

gulp.task("clean-tmp", function () {
  return gulp.src("tmp", {read: false})
    .pipe(rimraf());
});

gulp.task("clean", ["clean-dist", "clean-tmp"]);

gulp.task("lint", function() {
  return gulp.src(appJSFiles)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"));
});

function buildHtml(path) {
  return gulp.src([path])
    .pipe(usemin({
      css: [minifyCss, 'concat'],
      html: [function() {return minifyHtml({empty: true})} ],
      js: [
        sourcemaps.init({largeFile: true}),
        'concat',
        uglify({ compress: {
          sequences     : false,  //-- join consecutive statemets with the “comma operator”
          properties    : true,   // optimize property access: a["foo"] → a.foo
          dead_code     : true,   // discard unreachable code
          drop_debugger : true,   // discard “debugger” statements
          unsafe        : false,  // some unsafe optimizations (see below)
          conditionals  : false,  //-- optimize if-s and conditional expressions
          comparisons   : true,   // optimize comparisons
          evaluate      : false,  //-- evaluate constant expressions
          booleans      : false,  //-- optimize boolean expressions
          loops         : true,   // optimize loops
          unused        : false,  //-- drop unused variables/functions
          hoist_funs    : true,   // hoist function declarations
          hoist_vars    : false,  // hoist variable declarations
          if_return     : true,   // optimize if-s followed by return/continue
          join_vars     : true,   // join var declarations
          side_effects  : false,  // drop side-effect-free statements
          warnings      : true,   // warn about potentially dangerous optimizations/code
          global_defs   : {}      // global definitions
        }}),
        sourcemaps.write('.')
      ]
    }))
    .pipe(gulp.dest("dist/"))
    .on('error',function(e){
      console.error(String(e));
    });
}

gulp.task("html-index", function () {
  return buildHtml("./web/index.html");
});

gulp.task("html-selector", function () {
  return buildHtml("./web/storage-selector.html");
});

gulp.task("html", ["lint", "html-index", "html-selector"]);

gulp.task('pricing', function() {
  return rollup.rollup({
    input: ['web/pricing-component.mjs'],
    plugins: [
      resolve(),
      babel({
        "presets": [
          [
            "@babel/preset-env",
            {
              "targets": "> 1%, not dead, not ie 11",
              "modules": false
            }
          ]
        ]
      }),
      terser()
    ]
  })
  .then(bundle=>{
    return bundle.write({
      file: 'web/pricing-component.js',
      format: 'iife'
    });
  });
});

gulp.task("html2js", function() {
  return gulp.src(partialsHTMLFiles)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      loose: true
    }))
    .pipe(ngHtml2Js({
      moduleName: "risevision.apps.partials",
      prefix: "partials/"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("./web/tmp/"));
});

gulp.task("images", function () {
  return gulp.src(['./web/images/**/*.*'])
    .pipe(gulp.dest("dist/images"))
    .on('error',function(e){
      console.error(String(e));
    })
});

gulp.task("static-html", function() {
  return gulp.src(['./web/loading-preview.html', './web/pricing-component.js', './web/pricing-component.css'])
    .pipe(gulp.dest('dist/'));
})

gulp.task("config", function() {
  var env = process.env.NODE_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["./web/scripts/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("./web/scripts/config"));
});

gulp.task('build-pieces', function (cb) {
  runSequence(["clean"], ['config', 'i18n-build', 'css-build', 'pricing', 'html2js'], cb);
});

gulp.task('build', function (cb) {
  runSequence(["clean", ], ['build-pieces', 'pretty'], ["html", "static-html", "images"], cb);
});

/*---- testing ----*/

gulp.task("config-e2e", function() {
  var env = process.env.E2E_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["test/e2e/config/" + env + ".json"])
    .pipe(rename("config.json"))
    .pipe(gulp.dest("test/e2e/config"));
});

gulp.task("test:unit", factory.testUnitAngular({
    coverageFiles: "../../web/scripts/**/*.js",
    testFiles: unitTestFiles
}));

gulp.task("coveralls", factory.coveralls());

gulp.task("server", factory.testServer({
  html5mode: true,
  rootPath: "./web"
}));
gulp.task("server-close", factory.testServerClose());
gulp.task("test:webdrive_update", factory.webdriveUpdate({
    webdriverManagerArgs: ["--versions.chrome=" + (process.env.CHROME_VERSION || "latest")]
  }
));
gulp.task("test:e2e:core", ["test:webdrive_update"],factory.testE2EAngular({
  browser: "chrome",
  loginUser: process.env.E2E_USER,
  loginPass: process.env.E2E_PASS,
  stageEnv: process.env.STAGE_ENV || os.userInfo().username || 'local',
  twitterUser: process.env.TWITTER_USER,
  twitterPass: process.env.TWITTER_PASS,
  testFiles: function(){ 
    try{
      return JSON.parse(fs.readFileSync('/tmp/testFiles.txt').toString())
    } catch (e) {
      return process.env.TEST_FILES
    }
  }()
}));
gulp.task("test:e2e", function (cb) { 
  runSequence(["build-pieces", "config-e2e"], "server", "test:e2e:core", "server-close", cb);
});

gulp.task("test",  function (cb) {
  runSequence(["build-pieces"], "test:unit", "coveralls", cb);
});

//------------------------ Global ---------------------------------

gulp.task('default', [], function() {
  console.log('***********************'.yellow);
  console.log('  gulp dev: start a server in the  root folder and watch dev files'.yellow);
  console.log('  gulp test: run unit tests'.yellow);
  console.log('  gulp test:e2e: run e2e tests'.yellow);
  console.log('  gulp build: hint, lint, and minify files into ./dist '.yellow);
  console.log('  gulp bower-clean-install: clean bower install'.yellow);
  console.log('***********************'.yellow);
  return true;
});

gulp.task('dev', ['build-pieces', 'browser-sync', 'watch']);

/**
 * Default task, running just `gulp` will compile the sass, launch BrowserSync & watch files.
 */
gulp.task('default', ['dev']);
