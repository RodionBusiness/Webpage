const path = require('path');
const dotenv = require('dotenv');
const glob = require('glob');
const requireDir = require('require-dir');

const DotenvPlugin = require('webpack-dotenv-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const DOTENV_PATH = `.env.${production ? 'prod' : 'dev'}`;
dotenv.load({path: DOTENV_PATH});
dotenv.load({path: '.env'});

const templatesData = Object.assign(
  { env: process.env },
  requireDir('./src/templates/data', { recurse: true })
);

const extractSASS = new ExtractTextPlugin({
  filename: '[name]'
});

module.exports = {
  entry: {
    'landing/css/vendor.css': path.resolve(__dirname, './src/styles/vendor.scss'),
    'landing/css/landing.css': path.resolve(__dirname, './src/styles/landing.scss'),
    'landing/js/vendor.js': path.resolve(__dirname, './src/scripts/vendor.js'),
    'landing/js/landing.js': path.resolve(__dirname, './src/scripts/landing.js')
  },

  output: {
    path: path.resolve(__dirname, './www'),
    publicPath: '/',
    filename: '[name]'
  },

  devServer: {
    port: process.env.DEV_SERVER_PORT,
    host: process.env.DEV_SERVER_HOST,
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/
    },
    // publicPath: `/`,
    historyApiFallback: {
      rewrites: [
        {
          from: /./,
          to: (context) => `${context.parsedUrl.pathname}.html`
        }
      ]
    }
  },

  resolve: {
    extensions: ['.js', '.json', '.sass', '.scss', '.ttf', '.png', '.svg', '.jpg', '.jpeg'],
    alias: {
      'assets': path.resolve(__dirname, 'src/assets'),
      'node_modules': path.resolve(__dirname, 'node_modules'),
      'vendor': path.resolve(__dirname, 'src/vendor')
    }
  },

  module: {
    rules: [
      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: './landing/fonts/[name].[ext]'
        }
      },

      // SASS
      {
        test: /\.s[ca]ss$/,
        use: extractSASS.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
              debug: false,
              keepQuery: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.resolve(__dirname, './node_modules'),
                path.resolve(__dirname, './src/styles'),
                path.resolve(__dirname, './src/assets')
              ]
            }
          }]
        })
      },

      // Images
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'landing/images/',
              name: '[name]-[hash:8].[ext]',
              limit: 8192
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      },

      // HTML templates via Nunjucks engine
      {
        test: /\.(html|nunj|nunjucks)$/,
        loaders: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
              interpolate: true
            }
          },
          {
            loader: 'nunjucks-html-loader',
            query: {
              searchPaths: [
                path.resolve(__dirname, './src/templates/pages'),
                path.resolve(__dirname, './src/templates/')
              ],
              context: templatesData
            }
          }
        ]
      }
    ]
  },

  plugins: (production ? [
    new CleanWebpackPlugin(
      './www/*',
      { verbose: true }
    ),

    new UglifyJsPlugin({
      parallel: true,
      sourceMap: true,
      cache: true,
      exclude: [
        /register-service-worker\.js$/
      ]
    })

  ] : [])
    .concat([
      new DotenvPlugin({
        sample: '.env',
        path: DOTENV_PATH
      }),

      new FaviconsWebpackPlugin({
        logo: './src/assets/images/favicon.png',
        prefix: 'landing/icons-[hash]/',
        title: 'BlockSettle',
        emitStats: false,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: true,
          favicons: true,
          firefox: true,
          opengraph: true,
          twitter: true,
          yandex: true,
          windows: true
        }
      }),

      extractSASS
    ])
    // Dynamic HTML pages generation
    .concat(
      glob.sync(`${__dirname}/src/templates/pages/**/*.html`)
        .map((template) => {
          const filename = template.replace(`${__dirname}/src/templates/pages/`, '');

          console.log(`Found page "${filename}"`);

          return new HtmlWebpackPlugin({
            inject: false,
            template,
            filename
          });
        })
    )
};
