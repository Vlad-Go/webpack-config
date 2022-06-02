const fs = require('fs');
// --webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const webpack = require('webpack');
// --
const {pathes, fileStructure, staticFiles, alias} = require('../main-config');
const {p} = require('./helper');
const isDev = process.env.NODE_ENV === 'dev';


// webpack setup
const entry = {};
const html = [];

fileStructure.forEach((struct)=>{
  const chunks = [];
  let filename;
  struct.js.forEach((jsFile)=>{
    filename = p(jsFile.path).filename;
    chunks.push(filename);
    entry[filename] = jsFile.path;
  });
  struct.css.forEach((cssFile)=>{
    filename = p(cssFile.path).filename;
    chunks.push(filename);
    fs.writeFile(
        `${pathes.src}\\${filename}.js`,
        `import '${cssFile.path}';`,
        ()=>{}
    );
    entry[filename] = `${pathes.src}\\${filename}.js`;
  });

  html.push(new HtmlWebpackPlugin({
    template: struct.html.path,
    filename: `${p(struct.html.path).filename}.html`,
    chunks,
  }));
});

const copy = staticFiles.length ? new CopyPlugin({patterns: staticFiles}) : {apply:()=> null};
const or = (dev, prod) => isDev ? dev : prod;

module.exports = {
  mode: or('development', 'production'),
  context: pathes.src,
  entry,
  output: {
    path: pathes.dist,
    filename: or('[name].[hash].js', '[name].js'),
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: pathes.dist,
    },
    watchFiles: ['src/**/*'],
    open: true,
    compress: true,
    port: 8080,
  },
  devtool: or('eval-source-map', 'source-map'),
  resolve: {
    alias,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ESLintPlugin({fix: true}),
    new CleanWebpackPlugin(),
    ...html,
    new MiniCssExtractPlugin(),
    copy,
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('afterEmit', () => {
          if (!isDev) {
            fileStructure.forEach((struct)=>{
              struct.css.forEach((cssFile)=>{
                const filename = p(cssFile.path).filename;
                fs.unlink(
                    `${pathes.src}\\${filename}.js`,
                    ()=>{}
                );
                fs.unlink(
                    `${pathes.dist}\\${filename}.js`,
                    ()=>{}
                );
                fs.unlink(
                    `${pathes.dist}\\${filename}.js.map`,
                    ()=>{}
                );

                const pathToHTML =pathes.src + p(struct.html.path).fullpath;
                console.log(pathToHTML);
                fs.readFile(
                    pathToHTML,
                    'utf-8',
                    (_, data)=> {
                      fs.writeFile(pathToHTML, data.replace(
                          `<script defer="defer" src="${filename}.js"></script>`,
                          ''
                      ),
                      'utf-8',
                      ()=>{});
                    });
              });
            });
          }
        });
      },
    },
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // Images
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: ({module})=> {
            return (pathes.images +
              module.context.split(pathes.images.split('./')[1])[1] +
              '/[name][ext]'
            );
          },
        },
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    'imagemin-gifsicle',
                    'imagemin-mozjpeg',
                    'imagemin-pngquant',
                    'imagemin-svgo',
                  ],
                },
              },
            },
          },
        ],
      },
      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/resource',
        generator: {
          filename: ({module})=> (pathes.fonts +
            module.context.split(pathes.fonts.split('./')[1])[1] +
            '/[name][ext]'
          ),
        },
      },
    ],
  },
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       filename: 'chunks/vendors.js',
    //       test: /node_modules/,
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //   },
    // },
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: 'webp',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ['imagemin-webp'],
            },
          },
        ],
      }),
    ],
  },
};
