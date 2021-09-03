# compile-critical-css

[![npm](https://img.shields.io/npm/v/compile-critical-css.svg)](https://www.npmjs.com/package/compile-critical-css) [![Node.js CI status](https://github.com/fengzilong/compile-critical-css/workflows/Node.js%20CI/badge.svg)](https://github.com/fengzilong/compile-critical-css/actions)

Compile css to critical css function

# Installation

```bash
npm i compile-critical-css
```

or

```bash
yarn add compile-critical-css
```

# Usage

```js
const { compile } = require( 'compile-critical-css' )

const fnString = compile( `
  .a, .b { color: #000 }
  #c { color: #111 }
  div { color: #222 }

  @media print {
    .d {
      color: #ddd;
    }

    .e {
      color: #f2f2f2;
    }
  }

  @keyframes move {
    from { top: 0px; }
    to { top: 100px; }
  }
` )
```

Then write `fnString` to `./path/to/fn.js`, and `module.exports` it

In another file, require the compiled function

```js
const getCriticalCSS = require( './path/to/fn.js' )

const css = getCriticalCSS( [
  'a',
  'e',
] )
```

The `css` will be

```css
.a, .b { color: #000 }
#c { color: #111 }
div { color: #222 }

@media print {
  .e {
    color: #f2f2f2;
  }
}

@keyframes move {
  from { top: 0px; }
  to { top: 100px; }
}
```

Inline this in your html file, enjoy it!

# License

MIT
