# solar-sim

## Installation & compilation

Install typescript and all dependencies (listed in `package.json`):

```
$ npm run install
```

Compile the typescript files into `lib/*.js`:

```
$ npm run build
```

Execute compiled file by running, e.g.,

```
$ node lib/example.js
```

Units tests are written in `/test`. Run them using:

```
$ ./node_modules/mocha/bin/mocha
```

There are also other scripts for testing the simulator:

* `/test/live-testing.js` to test the whole simulator with a full input configuration
* `/test/xls-maquette.js` to mimic the original xls maquette of the simulator with the same parameters as in the xls file `503_Simulateur_Maquette_20180508.xls`.

## Usage

See an example in `example.ts` Run the computation by running the `solarSim` function:

```
let my_outputs = solarSim(my_inputs);
```

where `my_inputs` are defined by the interface `input` and **can** be generated using the `inputsFactory` function. This function set the parameters with default values.  

```
const inputsFactory = (
        roofs: roof[], /* required */
        pvTechnology = 'poly',  /* default */
        nYears = 10, /* default */
        currentYear = 2018, /* default */
        elecSellingPrice = 0.03, /* default */
        CVPrice = 85, /* default */
    ): inputs => { ... }
```

Let's generate inputs with required `roofs` and optional `currentYear` parameters (which is at the third position):

```
let my_inputs = inputsFactory(roofs, undefined, currentYear);
```

Note that putting the last optional arguments as `undefined` in the `inputsFactory` function are not mandatory.  

## Settings

This simulator uses a lot of constant values to make the computations, such as the electricity price, the inflation rate or an average obstacle rate per building typology. Whenever needed, any constant values can be changed in `constants.ts`.

## Documentation

We use `typedoc` to compile a documentation based on jsdoc annotations.

### Installation
```
$ npm install typedoc --save
```

### Make the doc
```
$ typedoc --out gen_docs --mode modules src
```

The documentation is available as HTML pages in /gen_docs/.

## Web

We set up a small web page to see the simulator in action.

### Compile the module `src/exe.ts` -> `lib/exe.js`

```
$ npm run build
```

### Generate js via webpack

In order to generate the file `web/main.js` from `lib/exe.js`, go in `web` and type the following command:

```
web$ npx webpack --config webpack.config.js
```

### Make a light-weight webserver running

Launch the webserver at the root of the project :

```
$ python3 -m http.server
```

and the website is visible on  `http://localhost:8000/web`
