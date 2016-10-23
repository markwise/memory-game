'use strict';

import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import BrowserSync from 'browser-sync';
import runSequence from 'run-sequence';
import chalk from 'chalk';
import path from 'path';
import del from 'del';
import webpack from 'webpack';
import nodeUUID from 'node-uuid';
import webpackConfig from './webpack.config';

const env = process.env.NODE_ENV || 'development';
const plugins = loadPlugins();
const browserSync = BrowserSync.create();
const uuid = (env === 'production') ? nodeUUID.v1() : '';
const paths = {};

paths.dist =       `${__dirname}/dist`;
paths.static =     `${paths.dist}/static`;
paths.src =        `${__dirname}/src`;
paths.images =     `${paths.src}/images`;
paths.styles =     `${paths.src}/styles`;
paths.scripts =    `${paths.src}/scripts`;
paths.views =      `${paths.src}/views`;


////////////////////////////////////////////////////////////////////////////////
// html
////////////////////////////////////////////////////////////////////////////////

gulp.task('html', () =>
    gulp.src(`${paths.src}/index.html`)
        .pipe(plugins.if(env === 'production',
            plugins.htmlmin({
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                sortAttributes: true,
                sortClassName: true,
                useShortDoctype: true
            })
        ))
        .pipe(plugins.replace('@uuid', uuid))
        .pipe(gulp.dest(paths.dist))
);


////////////////////////////////////////////////////////////////////////////////
// styles
////////////////////////////////////////////////////////////////////////////////

gulp.task('styles', () =>
    gulp.src([
        'node_modules/normalize.css/normalize.css',
        `${paths.styles}/flexbox.less`,
        `${paths.styles}/base.less`,
        `${paths.src}/views/**/*.{less,css}`,
    ])
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat(`app${uuid}.css`))
            .pipe(plugins.less().on('error', plugins.util.log))
            .pipe(plugins.if(env === 'production', plugins.cssnano()))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(plugins.size({title: 'css'}))
        .pipe(gulp.dest(`${paths.static}`))
);


////////////////////////////////////////////////////////////////////////////////
// scripts
////////////////////////////////////////////////////////////////////////////////

gulp.task('scripts', (done) => {
    let config = webpackConfig(uuid);

    webpack(config).run((err, stats) => {
        if (err) {
            done(err);
        } else {
            stats.compilation.fileDependencies.forEach((item) => {
                //console.log(chalk.green(item));
            });
            done();
        }
    });
});


////////////////////////////////////////////////////////////////////////////////
// clean
////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', () =>
    del([paths.dist])
);


////////////////////////////////////////////////////////////////////////////////
// build
////////////////////////////////////////////////////////////////////////////////

gulp.task('build', (done) => {
    runSequence(
        'clean',
        ['html', 'styles', 'scripts'],
        done
    );
});


////////////////////////////////////////////////////////////////////////////////
// serve
////////////////////////////////////////////////////////////////////////////////

function log(event) {
    let msg = `${event.type} ${event.path.replace(`${__dirname}/`, '')}`;
    console.log(chalk.yellow(msg));
}

gulp.task('reload', (done) => {
    if (browserSync.active) browserSync.reload();
    done();
});

gulp.task('serve', (done) => {
    runSequence(
        'build',
        () => {
            browserSync.init({
                server: paths.dist,
                logPrefix: 'memory-game',
                notify: false,
                minify: false,
                open: false,
                ghostMode: false,
            });

            gulp.watch(`${paths.src}/index.html`, (event) => {
                log(event);
                runSequence('html', 'reload');
            });

            gulp.watch(`${paths.src}/**/*.{less,css}`, (event) => {
                log(event);
                runSequence('styles', 'reload');
            });

            gulp.watch(`${paths.src}/**/*.{js,json,njk}`, (event) => {
                log(event);
                runSequence('scripts', 'reload');
            });

            done();
        }
    );
});
