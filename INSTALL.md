# Installing PostCSS Time Machine

[PostCSS Time Machine] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Time Machine] to your project:

```bash
npm install postcss-time-machine --save-dev
```

Use [PostCSS Time Machine] to process your CSS:

```js
const postcssTimeMachine = require('postcss-time-machine');

postcssTimeMachine.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssTimeMachine = require('postcss-time-machine');

postcss([
  postcssTimeMachine(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Time Machine] in your `postcss.config.js` configuration file:

```js
const postcssTimeMachine = require('postcss-time-machine');

module.exports = {
  plugins: [
    postcssTimeMachine(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Time Machine] in your Webpack configuration:

```js
const postcssTimeMachine = require('postcss-time-machine');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssTimeMachine(/* pluginOptions */)
            ]
          } }
        ]
      }
    ]
  }
}
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Time Machine] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssTimeMachine = require('postcss-time-machine');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssTimeMachine(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Time Machine] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssTimeMachine = require('postcss-time-machine');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssTimeMachine(/* pluginOptions */)
  ])
).pipe(
  gulp.dest('.')
));
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Time Machine] in your Gruntfile:

```js
const postcssTimeMachine = require('postcss-time-machine');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssTimeMachine(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Time Machine]: https://github.com/jonathantneal/postcss-time-machine
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
