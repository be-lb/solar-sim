# solar-sim

## Installer & compiler

Commencer par un ```npm install``` pour recuperer typescript, puis commencer a bosser dans src/index.ts, puis lancer ```npm run build``` pour compiler sous lib/index.js.

## Example typescript & test via mocha

### Compiler `src/example.ts` -> `lib/example.js`

```
$ npm run build
```

### Exécuter `lib/example.js`

```
$ node lib/example.js
```

### Tester

Le test se trouve dans `test\example.js`

```
$ ./node_modules/mocha/bin/mocha
```
