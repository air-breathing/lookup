# lookup
Tool for searching configs files and joining it or choosing more specified config.

Using:

```bash
npm i config-lookuper --save
```

```javascript
'use strict'

const lookuper = new Lookuper(configName, isMixedConfigs, parsingTyper);
const result = lookuper.lookup();

```

`configName` - String, name of config which we look up
`isMixedConfigs` - Boolean, configs should or not should be mixed.
`parsingTyper` - String, have two values: `'json'` or `'js'`, by default it has `'js'` value
 