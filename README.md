# solar-sim

## Installer & compiler

Commencer par un ```npm install``` pour recuperer typescript, puis commencer a bosser dans src/index.ts, puis lancer ```npm run build``` pour compiler sous lib/index.js.

## Example typescript & test via mocha

### Compiler `src/index.ts` -> `lib/index.js`

```
$ npm run build
```

### Exécuter `lib/index.js`

```
$ node lib/index.js
```

### Tester

Les tests se trouvent dans `test/`

```
$ ./node_modules/mocha/bin/mocha
```

## Documentation

We use `typedoc` to compile a documentation based on jsdoc annotations.

### Installation
```
$ npm install typedoc –save
```

### Make the doc
```
$ typedoc --out docs --mode modules src
```

The documentation is available as HTML pages in /docs/.
