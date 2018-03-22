# lookup
[![Build Status](https://travis-ci.org/air-breathing/lookup.svg?branch=master)](https://travis-ci.org/air-breathing/lookup)
Tool for searching configs files and joining it or choosing more specified config.

## Usage

```bash
npm i config-lookuper --save
```

```javascript
'use strict'
const lookuper = new Lookuper(configName, isMixedConfigs, parsingTyper);
```

`configName` - String, name of config which we look up.

`isMixedConfigs` - Boolean, configs should or not should be mixed.

`parsingTyper` - String, have two values: `'json'` or `'js'`, by default it has `'js'` value.
 
## Methods
 
Looking for configs in the directories from dir to root directory.
```javascript
const dir = '/path/to/dir';
const result = lookuper.lookup(dir).resultConfig;
```

Looking for plugin which starts with prefix in node_modules of directories from dir to root directory. 
 ```javascript
const prefix = 'your-plugin-start-name';
const result2 = lookuper.lookupNPM(dir, prefix).resultConfig;
```
 
Looking for plugin which starts with prefix in global node_modules. 
```javascript
const prefix = 'your-plugin-start-name';
const result2 = lookuper.lookupGlobalModules(prefix).resultConfig;
```