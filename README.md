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

## Usage

Run the computation by running the `solarSim` function:

```
let my_outputs = solarSim(my_inputs);
```

where `my_inputs` are defined by the interface `input` and can be generated using the `inputsFactory` function. This function set some parameters with default values.  

```
const inputsFactory = (
        roofs: roof[], /* required */
        nYears = 25, /* default */
        currentYear = 2018, /* default */
        typology = 'residential' /* default */
        ...
    ): inputs => { ... }
```

Let's generate inputs with required `roofs` and optional `currentYear` parameters:

```
let my_inputs = inputsFactory(roofs, undefined, currentYear);
```

Note that putting the last optional argument (`typology`) as `undefined` is not mandatory.  

## Documentation

We use `typedoc` to compile a documentation based on jsdoc annotations.

### Installation
```
$ npm install typedoc --save
```

### Make the doc
```
$ typedoc --out docs --mode modules src
```

The documentation is available as HTML pages in /docs/.

## Web

### Compiler le module `src/index.ts` -> `lib/index.js`

```
$ npm run build
```

### Générer le js via webpack

```
web$ npx webpack --config webpack.config.js
```
