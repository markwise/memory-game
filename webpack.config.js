import webpack from 'webpack';

const env = process.env.NODE_ENV;
const paths = {};

paths.dist =       `${__dirname}/dist`;
paths.static =     `${paths.dist}/static`;
paths.src =        `${__dirname}/src`;
paths.images =     `${paths.src}/images`;
paths.styles =     `${paths.src}/styles`;
paths.scripts =    `${paths.src}/scripts`;
paths.views =      `${paths.src}/views`;


export default function (uuid) {
    let config = {
        devtool: 'source-map',

        entry: {
            app: `${paths.src}/bootstrap.js`,
            vendor: [
                'babel-polyfill',
            ],
        },

        output: {
            path: paths.static,
            filename: `app${uuid}.js`,
        },

        module: {
            loaders: [
                {test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/},
                {test: /\.njk$/, loader: 'nunjucks-loader'},
            ],
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin('vendor', `vendor${uuid}.js`),
            new webpack.ProvidePlugin({ /*globals*/ }),
        ],

        resolve: {
            extensions: ['', '.js'],
            alias: {
                scripts: paths.scripts,
                views:   paths.views,
            },
        },
    };

    if (env === 'production') {
        config.plugins.push(
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    return config;
};
