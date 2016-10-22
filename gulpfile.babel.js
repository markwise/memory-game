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

// function html(src) {
//     return gulp.src(src)
//         .pipe(plugins.if(env === 'production',
//             plugins.htmlmin({
//                 collapseBooleanAttributes: true,
//                 collapseWhitespace: true,
//                 html5: true,
//                 minifyCSS: true,
//                 minifyJS: true,
//                 removeAttributeQuotes: true,
//                 removeComments: true,
//                 removeEmptyAttributes: true,
//                 removeScriptTypeAttributes: true,
//                 removeStyleLinkTypeAttributes: true,
//                 sortAttributes: true,
//                 sortClassName: true,
//                 useShortDoctype: true
//             })
//         ))
//         .pipe(plugins.replace('@uuid', uuid))
//         .pipe(gulp.dest(paths.dist));
// };
//
// gulp.task('html:login', () => {
//     return html([`${paths.login}/login.html`]);
// });
//
// gulp.task('html:portal', () => {
//     return html([`${paths.portal}/portal.html`]);
// });
//
// gulp.task('html', ['html:login', 'html:portal']);


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

// function styles(appName, src) {
//     return gulp.src(src)
//         .pipe(plugins.sourcemaps.init())
//             .pipe(plugins.concat(`${appName}${uuid}.css`))
//             .pipe(plugins.less())
//             .pipe(plugins.if(env === 'production', plugins.cssnano()))
//         .pipe(plugins.sourcemaps.write('.'))
//         .pipe(plugins.size({title: 'css'}))
//         .pipe(gulp.dest(`${paths.static}/${appName}`));
// };
//
// gulp.task('styles:login', () => {
//     return styles('login', [
//         `${paths.shared}/fontello/css/fontello-embedded.css`,
//         `${paths.vendor}/normalize-css/normalize.css`,
//         `${paths.styles}/mixins/**/*.less`,
//         `${paths.styles}/colors.less`,
//         `${paths.styles}/base.less`,
//         `${paths.styles}/ui.less`,
//         `${paths.components}/**/*.less`,
//         `${paths.styles}/themes/ocs.less`,
//         `${paths.login}/login.less`,
//         `${paths.login}/views/**/*.{less,css}`
//     ]);
// });
//
// gulp.task('styles:portal', () => {
//     return styles('portal', [
//         `${paths.shared}/fontello/css/fontello-embedded.css`,
//         `${paths.vendor}/normalize-css/normalize.css`,
//         `${paths.styles}/mixins/**/*.less`,
//         `${paths.styles}/colors.less`,
//         `${paths.styles}/base.less`,
//         `${paths.styles}/ui.less`,
//         `${paths.components}/**/*.less`,
//         `${paths.styles}/themes/ocs.less`,
//         `${paths.portal}/portal.less`,
//         `${paths.portal}/views/**/*.{less,css}`
//     ]);
// });
//
// gulp.task('styles', ['styles:login', 'styles:portal']);


gulp.task('styles', () =>
    gulp.src([
        `${paths.styles}/flexbox.less`,
        `${paths.styles}/base.less`,
        `${paths.src}/views/**/*.{less,css}`,
    ])
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat(`app${uuid}.css`))
            .pipe(plugins.less())
            .pipe(plugins.if(env === 'production', plugins.cssnano()))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(plugins.size({title: 'css'}))
        .pipe(gulp.dest(`${paths.static}`))
);


////////////////////////////////////////////////////////////////////////////////
// scripts
////////////////////////////////////////////////////////////////////////////////

// function scripts (appName, done) {
//     let config = webpackConfig(appName, uuid);
//
//     webpack(config).run((err, stats) => {
//         if (err) {
//             done(err);
//         } else {
//             stats.compilation.fileDependencies.forEach((item) => {
//                 //console.log(chalk.green(item));
//             });
//             done();
//         }
//     });
// };
//
// gulp.task('scripts:login', (done) => {
//     scripts('login', done);
// });
//
// gulp.task('scripts:portal', (done) => {
//     scripts('portal', done);
// });
//
// gulp.task('scripts', ['scripts:login', 'scripts:portal']);


gulp.task('scripts', (done) => {
    let config = webpackConfig(uuid);

    webpack(config).run((err, stats) => {
        if (err) {
            done(err);
        } else {
            stats.compilation.fileDependencies.forEach((item) => {
                console.log(chalk.green(item));
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
