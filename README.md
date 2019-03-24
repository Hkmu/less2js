# less2js

Read variable from your less file and export them as JavaScript Object.

## Features

- Support less `@import`(comma seperated options eg. `(less, optional)` will be ignored)

## Getting Started

### Install

Install less2js using `yarn` :

```
yarn install less2js
```

Or using `npm` :

```
npm install less2js
```

### Usage

```javascript
import less2js from 'less2js';

less2js('./theme.less').then(res => {
    // res is like { '@color-brand': 'yellow', '@width': '100px' }
});
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| stripPrefix | Remove the `@` prefix from returned object keys | false |
| camelCase | Convert dash/dot/underscore/space separated keys to camelCase | false |
