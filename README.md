## PostCSS custom props

A PostCSS plugin to enable
[CSS Custom Properties (CSS variables)](http://www.w3.org/TR/css-variables/).

## Features

- Custom property definitions can use variables.
- Works with
  [postcss-import plugin](https://github.com/postcss/postcss-import)
  when this plugin is defined **after** it in the chain.
- Works with
  [postcss-color-function plugin](https://github.com/postcss/postcss-color-function)
  when this plugin is defined **before** it in the chain.

## Limitations

This will only work as the spec sets out if you define
your custom properties on `:root`. See the following
discussions on pre-processing CSS properties from the
[postcss-custom-properties plugin repository](https://github.com/postcss/postcss-custom-properties):

- [The cascade](https://github.com/postcss/postcss-custom-properties/issues/1)
- [Media queries](https://github.com/postcss/postcss-custom-properties/issues/9)

## Installation

```
npm install postcss-custom-props
```

## Usage

### Webpack

```js
...
import atImport from 'postcss-import';
import colorFunction from 'postcss-color-function';
import customProps from 'postcss-custom-props';

export default {
  ...
  postcss: [
    atImport(),
    customProps(),
    colorFunction(),
  ],
};
```

### Input

```css
/* config.css */
:root {
  --brand-color: #f05;
}

/* component.css */
@import "./config.css";

:root {
  --compoment-bg-color: var( --brand-color );
  --component-font-color: color( var( --brand-color ) lighten( 30% ));
}

.component {
  background-color: var( --compoment-bg-color );
  color: var( --component-font-color );
}
```

### Output

```css
.component {
  background-color: #f05;
  color: #fcd;
}
```
