'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var livereload = require('gulp-livereload');
var bump = require('gulp-bump');
var moment = require('moment');

var stylus = require('gulp-stylus');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var path = require('path');
var connect = require('gulp-connect');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var del = require('del');
var gzip = require('gulp-gzip');

var git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version');

gulp.task('scripts', function () {
  return gulp.src('./client/js/')
    .pipe(gulpWebpack({
        //debug: true,
        //devtool: 'inline-source-map',
        entry: {
            index: "./client/js/index.jsx",
        },
        stats: {
            colors: true,
            reasons: true
        },
        output: {
            path: path.join(__dirname, "./static/js"),
            filename: '[name].bundle.js'
        },
        resolve: {
            extensions: ['', '.js', '.jsx'],
            modulesDirectories: ['node_modules'],
        },
        module: {
            loaders: [
                { test: /\.jsx$/, loader: "jsx-loader?harmony" },
                { test: /\.json$/, loader: 'json-loader' },
                { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
            ]
        },
        plugins: [
          new CommonsChunkPlugin("commons.bundle.js")
        ],
        cache: false
    }))
    .pipe(gulp.dest('./static/js'))
    .pipe(livereload())
});

gulp.task('scripts:min', function () {
  return gulp.src('./client/js/')
    .pipe(gulpWebpack({
    output: {
        path: path.join(__dirname, "./static/js"),
        filename: '[name].bundle.js'
    },
    debug: false,
    entry: {
      index: "./client/js/index.jsx",
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules'],
    },
    module: {
      loaders: [
          { test: /\.jsx$/, loader: "jsx-loader?harmony" },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ],
  }))
  .pipe(gzip({append: false}))
  .pipe(gulp.dest('./static/js'))
  .pipe(livereload())
});

gulp.task('connect', function () {
  connect.server({ 
    root: 'static'
  });
});

gulp.task('connect:build', function () { 
  connect.server({ 
    root: 'static',
    middleware: function() {
      return [
        function (req, res, next) { 
          if (/\.js$/.test(req.url) || /\ex.css$/.test(req.url)) {
            res.setHeader('Content-Encoding', 'gzip');
          }
          next();
        }
      ];
    }
  });
});

gulp.task('clean:build', function (cb) {
  del([
    'static/js/*',
    'static/css/index.css'
  ], cb);
});

// watch files for changes and reload
gulp.task('serve', function() {
  livereload.listen();
  gulp.watch(['./gulpfile.js', './client/js/**/*.js', './client/js/**/*.jsx', './client/js/**/*.glsl'], ['scripts']);
  gulp.watch(['./client/css/*'], ['css']);
});

gulp.task('css', function () { 
  gulp.src('./client/css/index.styl')
    .pipe(stylus({compress: false}))
    .pipe(gulp.dest('./static/css'))
    .pipe(livereload());
});

gulp.task('bump', function(){
  return gulp.src('./package.json')
      .pipe(bump({type: 'patch'}))
      .pipe(gulp.dest('./'))
      .pipe(git.commit('deploy at: ' + moment().format('M/D/YY h:mm a')))
      .pipe(filter('package.json'))
      .pipe(tag_version());
});

gulp.task('css:min', function () { 
  gulp.src('./client/css/index.styl')
    .pipe(stylus({compress: true}))
    .pipe(gzip({append: false}))
    .pipe(gulp.dest('./static/css'))
    .pipe(livereload());
});



gulp.task('build', ['clean:build', 'scripts:min', 'css:min']);
gulp.task('deploy', ['bump', 'clean:build', 'scripts:min', 'css:min']);
gulp.task('default', ['scripts', 'css', 'serve', 'connect']);
