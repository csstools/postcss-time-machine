# PostCSS Time Machine [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Time Machine] fixes mistakes in the design of CSS itself, as
[described by the CSSWG](https://wiki.csswg.org/ideas/mistakes).

They specifically requested that these should be corrected
“*if anyone invents a time machine*”.

```bash
npx postcss-time-machine SOURCE.css TRANSFORMED.css
```

## Safe Fixes

These fixes do not change the way CSS normally works. They can be individually
disabled by passing their short name into the [`fixes` option](#fixes).

### border-box

> Box-sizing should be `border-box` by default.

```css
/* prepended to your css */

* {
  box-sizing: border-box;
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

### display-type

> The `display` property should be called `display-type`.

```css
.some-component {
  display-type: grid;
}

/* becomes */

.some-component {
  display: grid;
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

### rgb-hsl

> `rgb()` and `hsl()` should have an optional fourth *alpha* parameter
  (which should use the same format as R, G, and B or S and L).

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

## Unsafe Fixes

These fixes change the way CSS normally works. They can be individually
enabled or disabled by passing their short name into the
[`fixes` option](#fixes), or by setting the
[`useUnsafeFixes`](#useunsafefixes) option to `false`.

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

### link-pseudo

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

## Advanced Usage

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

[PostCSS Time Machine] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### fixes

The `fixes` option lets you individually enable or disable individual fixes.

```js
postcssTimeMachine({
  fixes: {
    'border-box': false // disables adding * { box-sizing: border-box; }
  }
})
```

### useUnsafeFixes

The `useUnsafeFixes` option determines whether unsafe fixes will be applied or
not. Individual features passed into the `fixes` option will override this. By
default, unsafe features are enabled.

```js
postcssTimeMachine({
  useUnsafeFixes: false // disables background-position, background-size, and line-height
})
```

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-time-machine.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-time-machine
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-time-machine.svg
[npm-url]: https://www.npmjs.com/package/postcss-time-machine

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Time Machine]: https://github.com/jonathantneal/postcss-time-machine
