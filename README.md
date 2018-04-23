# Time Machine [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[Time Machine] fixes mistakes in the design of CSS itself, as
[described by the CSSWG](https://wiki.csswg.org/ideas/mistakes).

They specifically requested that these should be corrected
“*if anyone invents a time machine*”.

```bash
npm install postcss-time-machine --save-dev
```

## Fixes

### no-wrap

> In `white-space`, `nowrap` should be called `no-wrap`.

```css
h1 {
  white-space: no-wrap;
}

/* becomes */

h1 {
  white-space: nowrap;
}
```

### text-middle

> In `vertical-align`, `middle` should be called `text-middle`.

```css
button {
  vertical-align: text-middle;
}

/* becomes */

button {
  vertical-align: middle;
}
```

### background-size

> In `background-size`, having one value should duplicate its value, not
default the second one to `auto`.

```css
header {
  background-size: 75%;
}

/* becomes */

header {
  background-size: 75% 75%;
}
```

### background-position

> `background-position` and `border-spacing` (all 2-axis properties) should
  take *vertical* first, to match with the 4-direction properties like `margin`.

```css
body {
  background-position: 0% 50%;
}

table {
  border-spacing: 10px 5px;
}

/* becomes */

body {
  background-position: 50% 0%;
}

table {
  border-spacing: 5px 10px;
}
```

### z-order

> `z-index` should be called `z-order` or `depth`.

```css
aside {
  depth: 10;
}

figure {
  z-order: 10;
}

/* becomes */

aside {
  z-index: 10;
}

figure {
  z-index: 10;
}
```

### overflow-wrap

> `word-wrap`/`overflow-wrap` should not exist, and `overflow-wrap` should be a
  keyword on `white-space`.

```css
a {
  white-space: overflow-wrap;
}

/* becomes */

a {
  word-wrap: break-word;
}
```

### corner-radius

> `border-radius` should be `corner-radius`.

```css
button {
  corner-radius: 3px;
}

/* becomes */

button {
  border-radius: 3px;
}
```

### current-color

> `currentcolor` should be `current-color`.

```css
button {
  box-shadow: 0 0 5px solid current-color;
}

/* becomes */

button {
  box-shadow: 0 0 5px solid currentColor;
}
```

### rgb & hsl

> `rgba()` and `hsla()` should not exist, and `rgb()` and `hsl()` should have
  an optional fourth *alpha* parameter (which should use the same format as R,
  G, and B or S and L).

```css
header {
  background-color: rgb(0, 0, 255, 102);
  color: hsl(170, 50%, 45%, 80%);
}

/* becomes */

header {
  background-color: rgba(0, 0, 255, .4);
  color: hsla(170, 50%, 45%, .8);
}
```

### line-height

> `line-height: <percentage>` should compute to the equivalent
  `line-height: <number>`, so that it effectively inherits as a percentage not
  a length.

```css
p {
  line-height: 200%;
}

/* becomes */

p {
  line-height: 2;
}
```

### marker-style

> The `list-style` properties should be called `marker-style`.

```css
.georgian-list {
  marker-style: square;
}

/* becomes */

.georgian-list {
  list-style: square;
}
```

### :link

> `:link` should have had the `:any-link` semantics all along.

```css
:link {
  color: blue;
}

/* becomes */

:link, :visited {
  color: blue;
}
```

### border-box

> Box-sizing should be `border-box` by default.

```css
/* prepended to your css */

* {
  box-sizing: border-box;
}
```

## Usage

Add [Time Machine] to your build tool:

```bash
npm install postcss-time-machine --save-dev
```

#### Node

Use [Time Machine] to process your CSS:

```js
import timeMachine from 'postcss-time-machine';

timeMachine.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [Time Machine] as a plugin:

```js
import postcss from 'gulp-postcss';
import timeMachine from 'postcss-time-machine';

postcss([
  timeMachine(/* options */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [Time Machine] in your Webpack configuration:

```js
import timeMachine from 'postcss-time-machine';

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
              timeMachine(/* options */)
            ]
          } }
        ]
      }
    ]
  }
}
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [Time Machine] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import timeMachine from 'postcss-time-machine';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    timeMachine(/* options */)
  ])
).pipe(
  gulp.dest('.')
));
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [Time Machine] in your Gruntfile:

```js
import timeMachine from 'postcss-time-machine';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       timeMachine(/* options */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

Any feature of [Time Machine] may be disabled by passing a `false` value to its
feature key.

Example:
```js
require('postcss-time-machine')({
    rgb: false
})
```

Feature names include `background-position`, `background-size`,
`border-spacing`, `box-sizing`, `corner-radius`, `current-color`, `depth`,
`hsl`, `rgb`, `vertical-align`, `white-space`, `z-order`, and `:link`.

[npm-url]: https://www.npmjs.com/package/postcss-time-machine
[npm-img]: https://img.shields.io/npm/v/postcss-time-machine.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-time-machine
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-time-machine.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-time-machine
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-time-machine.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/support-chat-blue.svg

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Time Machine]: https://github.com/jonathantneal/postcss-time-machine
