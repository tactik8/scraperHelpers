# scraperHelpers

JS library for getting proxies

## Location

### Source code
https://github.com/tactik8/scraperHelpers

### repl.it
https://replit.com/@tactik8/scraperHelpers


## Install

### From github
```
git clone https://github.com/tactik8/scraperHelpers ./helpers
```

## Test and publish

```
npm install --save-dev jest

npm install --save-dev babel-jest @babel/core @babel/preset-env
npm install --save-dev jest-environment-jsdom

node --experimental-vm-modules node_modules/.bin/jest

npx parcel build
npm adduser
npm publish

```

git clone https://github.com/tactik8/jsonldHelpers ./helpers




## How to use

```
import { scraperHelpers as h } from 'https://tactik8.github.io/krakenJsSchema/kraken_schema/kraken_schema.js'


let proxies = new proxyHelpers.Proxies()


await proxies.getProxies()
await proxies.testProxies()

let proxy = getProxy(url)

proxies.setProxyActive(url) // On success
proxies.setProxyInactive(url) // On error




```

## Examples

```
let k = KrakenSchemas.get('Person')

let p = k.getProperty('givenName')

p.getLocalizedPropertyID('en-US')) --> 'first name'




```

## Tests

Prompt:
```
please write unit tests for all functions in arrayHelpers.js. Please separate the tests one file by function. Please consider edge cases.
```


## Running tests
node --experimental-vm-modules node_modules/.bin/jest

