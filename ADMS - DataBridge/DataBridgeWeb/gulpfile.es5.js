/*
 * ########################################################
 * ############## Gulp.js Required Packages ###############
 * ########################################################
 */
'use strict';

var gulp = require('gulp'),
    path = require('path'),
    es = require('event-stream'),
    gutil = require('gulp-util'),

//sass = require('gulp-sass'),
less = require('gulp-less'),
    strip = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),

//minify = require('gulp-minify-css'),
concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    clearRequire = require('clear-require'),
    fs = require('fs');

/*
 * ########################################################
 * ####### JS Bundling / Minification and Hinting #########
 * ########################################################
 * Bundle and Minify app JavaScript (Before running this,
 * lets run our JS Hinting and check for errors)
 */

/* For Vendors js files */
//gulp.task('bundle-js', ['hinting-js'], function () {
gulp.task('bundle-vendors-js', function () {
    return gulp.src(['js/vendors/jquery.js', 'js/vendors/angularJS/angular-1.5.7.js', 'js/vendors/angularJS/angular-animate-1.5.7.js', 'js/vendors/angularJS/angular-route.js', 'js/vendors/ui-bootstrap.js', 'js/vendors/bootstrap-datepicker.min.js', 'js/vendors/angularJS/**/*.js', 'js/vendors/plugins/**/*.js', 'js/vendors/**/*.js']).pipe(concat('vendors.js')).pipe(gulp.dest('js/')).pipe(uglify()).pipe(rename({
        suffix: ".min"
    })).pipe(gulp.dest('js/')).on('error', gutil.log);
});
/* For DataBridge js files */
//gulp.task('bundle-js', ['hinting-js'], function () {
gulp.task('bundle-databridge-js', function () {
    return gulp.src(['js/dataBridge/others/**/*.js', 'js/dataBridge/others/app.js', 'js/dataBridge/modules/*(.module)*.js', 'js/dataBridge/services/*(.service)*.js', 'js/dataBridge/factory/*(.factory)*.js', 'js/dataBridge/directives/*(.directive)*.js', 'js/dataBridge/controllers/controllers.js', 'js/dataBridge/controllers/*(.controller)*.js', '!js/dataBridge/**/*.min.map', '!js/dataBridge/**/*.min.js.map']).pipe(concat('dataBridgeApp.js')).pipe(gulp.dest('js/')).pipe(uglify()).pipe(rename({
        suffix: ".min"
    })).pipe(gulp.dest('js/')).on('error', gutil.log);
});

// JS (JavaScript) Hint
gulp.task('hinting-js', function (done) {
    var failed = false;
    var failWatcher = es.map(function (file, cb) {
        if (!failed) failed = !file.jshint.success;
        cb(null, file);
    });

    gulp.src(['js/dataBridge/**/*.js', '!js/dataBridge/**/*.min.js', '!js/dataBridge/**/*.min.map', '!js/dataBridge/**/*.min.js.map']).pipe(jshint({ // Look at other options to disable / enable hinting rules here > http://jshint.com/docs/options/
        loopfunc: true, // function within a loop..
        "-W041": true,
        node: true,
        undef: true,
        unused: true,
        evil: true, // eval() warning..
        shadow: true, // undeclared variable
        eqnull: true, // Use '===' to compare with 'null'.. etc
        asi: true // Missing semicolon.. etc
    })).pipe(jshint.reporter('jshint-stylish')).pipe(failWatcher).on('end', function () {
        if (failed) {
            return done(new gutil.PluginError('jshint', '############## Failed JSHint, fix errors and warnings ##############', { showStack: false }));
        }

        done();
    });
});

/*
 * ########################################################
 * ####################### WATCHER ########################
 * ########################################################
 * Lets watch the app (JS) for any new added,
 * removed or modified files and attempt to Bundle them
 */
gulp.task('watch-js', function () {
    gutil.log('JS Engine ', gutil.colors.magenta('Using JSHint engine for JavaScript validation'));

    gulp.watch(['js/dataBridge/**/*.js'], ['bundle-databridge-js']);
});

