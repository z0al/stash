# @stash/logger

![Travis (.org)](https://img.shields.io/travis/z0al/stash.svg)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@stash/logger.svg)

> A pretty logger for [Stash](https://github.com/z0al/stash)

## Install

```sh
$ npm i -D @stash/logger
```

## Usage

```javascript
import { createStore } from '@stash/core';
import { createLogger } from '@stash/logger';

const store = createStore();

// Add logger
createLogger(/* options */)(store);
```

## Options

- **console**: override the default log functions (e.g. `console.log`)

  Example:

  ```javascript
  {
    console: {
      log: (...data) => {
        /* Your code */
      };
      group: (...data) => {
        /* Your code */
      };
      groupEnd: (...data) => {
        /* Your code */
      };
    }
  }
  ```

## Examples

See [examples](../../examples).

## License

MIT © Ahmed T. Ali
