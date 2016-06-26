# Time Machine

<a href="https://github.com/postcss/postcss"><img src="http://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="80" height="80" align="right"></a>

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[Time Machine] fixes mistakes in the design of CSS itself, as [described by the CSSWG](https://wiki.csswg.org/ideas/mistakes).

They specifically requested that these should be corrected “*if anyone invents a time machine*”.

---

### no-wrap

> In `white-space`, `nowrap` should be called `no-wrap`.

```css
/* before */

h1 {
	white-space: no-wrap;
}

/* after */

h1 {
	white-space: nowrap;
}
```

### text-middle

> In `vertical-align`, `middle` should be called `text-middle`.

```css
/* before */

button {
	vertical-align: text-middle;
}

/* after */

button {
	vertical-align: middle;
}
```

### background-size

> In `background-size`, having one value should duplicate its value, not default the second one to `auto`.

```css
/* before */

header {
	background-size: 75%;
}

/* after */

header {
	background-size: 75% 75%;
}
```

### background-position

> `background-position` and `border-spacing` (all 2-axis properties) should take *vertical* first, to match with the 4-direction properties like `margin`.

```css
/* before */

body {
	background-position: 0% 50%;
}

table {
	border-spacing: 10px 5px;
}

/* after */

body {
	background-position: 50% 0%;
}

table {
	border-spacing: 5px 10px;
}
```

### z-order

> `z-index` should be called `z-order`.

```css
/* before */

aside {
	z-order: 10;
}

/* after */

aside {
	z-index: 10;
}
```

### overflow-wrap

> `word-wrap`/`overflow-wrap` should not exist, and `overflow-wrap` should be a keyword on `white-space`.

```css
/* before */

a {
	white-space: overflow-wrap;
}

/* after */

a {
	word-wrap: break-word;
}
```

### corner-radius

> `border-radius` should be `corner-radius`.

```css
/* before */

button {
	corner-radius: 3px;
}

/* after */

button {
	border-radius: 3px;
}
```

### current-color

> `currentcolor` should be `current-color`.

```css
/* before */

button {
	box-shadow: 0 0 5px solid current-color;
}

/* after */

button {
	box-shadow: 0 0 5px solid currentColor;
}
```

### rgb & hsl

> `rgba()` and `hsla()` should not exist, and `rgb()` and `hsl()` should have an optional fourth *alpha* parameter (which should use the same format as R, G, and B or S and L).

```css
/* before */

header {
	background-color: rgb(0, 0, 255, 102);
	color: hsl(170, 50%, 45%, 80%);
}

/* after */

header {
	background-color: rgba(0, 0, 255, .4);
	color: hsla(170, 50%, 45%, .8);
}
```

### :link

> `:link` should have had the `:any-link` semantics all along.

```css
/* before */

:link {
	color: blue;
}

/* after */

:link, :visited {
	color: blue;
}
```

### border-box

> Box-sizing should be `border-box` by default.

```css
/* prepended to css */

html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
```

## Usage

Add [Time Machine] to your build tool:

```bash
npm install postcss-time-machine --save-dev
```

#### Node

```js
require('postcss-time-machine')({ /* options */ }).process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [Time Machine] as a PostCSS plugin:

```js
postcss([
	require('postcss-time-machine')({ /* options */ })
]);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [Time Machine] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./css/src/*.css').pipe(
		postcss([
			require('postcss-time-machine')({ /* options */ })
		])
	).pipe(
		gulp.dest('./css')
	);
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [Time Machine] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('postcss-time-machine')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

## Options

Any feature of [Time Machine] may be disabled by passing a `false` value to its feature key.

Example:
```js
require('postcss-time-machine')({
    rgb: false
})
```

Features include `background-position`, `background-size`, `border-spacing`, `box-sizing`, `corner-radius`, `current-color`, `hsl`, `rgb`, `vertical-align`, `white-space`, `z-order`, and `:link`.

[ci]:      https://travis-ci.org/jonathantneal/postcss-time-machine
[ci-img]:  https://img.shields.io/travis/jonathantneal/postcss-time-machine.svg
[npm]:     https://www.npmjs.com/package/postcss-time-machine
[npm-img]: https://img.shields.io/npm/v/postcss-time-machine.svg

[Gulp PostCSS]:  https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]:       https://github.com/postcss/postcss
[Time Machine]:  https://github.com/jonathantneal/postcss-time-machine
