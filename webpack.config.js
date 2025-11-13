const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const IS_DEV = isDev;
const IS_PROD = !isDev;

const getFilename = (ext) => `[name].[fullhash].${ext}`;

const setCssLoaders = (extra) => {
  const loaders = [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'];
  if (extra) {
    if (Array.isArray(extra)) loaders.push(...extra);
    else loaders.push(extra);
  }
  return loaders;
};
const setJsLoaders = (extra) => {
  const loaders = {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  };

  if (extra) {
    if (Array.isArray(extra)) {
      loaders.options.presets.push(...extra);
    } else {
      loaders.options.presets.push(extra); 
    }
  }

  return loaders;
};

const optimize = () => {
  const config = {
    splitChunks: { chunks: 'all' },
  };

  if (IS_PROD) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()];
  }

  return config;
};

module.exports = {
  mode: isDev ? 'development' : 'production',

  entry: {
    main: path.resolve(__dirname, 'src/index.jsx'),
    stat: path.resolve(__dirname, 'src/statistics.ts'),
  },

  target: 'web',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    assetModuleFilename: 'assets/[name][ext]',
    clean: !isDev,
  },

 devtool: IS_DEV ? 'source-map' : false,
 
  performance: {
    hints: false,
  },


  optimization: optimize(),

  resolve: {
    extensions: ['.js', '.json'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      chunks: ['main'],
      favicon: path.resolve(__dirname, 'src/assets/favicon.dog.png'),
    }),
    ...(!isDev ? [new CleanWebpackPlugin()] : []),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/assets'), to: 'assets', noErrorOnMissing: true },
      ],
    }),
    new MiniCssExtractPlugin({ filename: getFilename('css') }),
    new EslintPlugin({
  extensions: ['js'],
  configType: 'eslintrc',
  fix: true
})
  ],

  module: {
    rules: [
    {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: setJsLoaders(),
    },

   {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: setJsLoaders('@babel/preset-react'),
},
{
  test: /\.ts$/,
  exclude: /node_modules/,
  use: setJsLoaders('@babel/preset-typescript'),
},
      // CSS / Preprocessors
      { test: /\.css$/i, use: setCssLoaders() },
      { test: /\.less$/i, use: setCssLoaders('less-loader') },
      { test: /\.s[ac]ss$/i, use: setCssLoaders('sass-loader') },

      // Assets
      {
        test: /\.(png|jpe?g|svg|gif|webp)$/i,
        type: 'asset/resource',
        generator: { filename: 'assets/images/[name][ext]' },
      },
      {
        test: /\.(ttf|woff2?|eot)$/i,
        type: 'asset/resource',
        generator: { filename: 'assets/fonts/[name][ext]' },
      },

      // Data files
      { test: /\.xml$/i, use: ['xml-loader'] },
      { test: /\.csv$/i, use: ['csv-loader'] },
    ],
  },

  devServer: {
    hot: true,
    open: true,
    port: 4200,
    watchFiles: ['src/**/*'],
  },
};
