
interface roof {
    'area': number;
    'productivity': number;
    'tilt': number;
}

interface inputs {
    'roofs':  roof[];
    'typology': string; // enum
    'nYears': number;
    'currentYear': number;
    'pvSetup': string; // enum
    'pvTechnology': string; // enum
    'elecSellingPrice': number;
    'CVPrice': number;
}

interface mainOutputs {
    'installationCost': number,
    'CVAmountYearN': number,
    'selfConsumptionAmountYearN': number,
    'savedCO2emissions': number;
}

interface setupOutputs {
    'area': number,
    'power': number,
    'obstacleRate': number
}

interface energyOutputs {
    'annualProduction': number,
    'annualConsumption': number,
    'autonomy': number
}

interface financeOutputs {
    'totalGain25Y': number,
    'returnTime': number
}

interface outputs {
    'main': mainOutputs,
    'setup': setupOutputs,
    'energy': energyOutputs,
    'finance': financeOutputs
};


const inputsFactory = (
        roofs: roof[], /* required */
        typology = 'closed', /* default */
        nYears = 10, /* default */
        currentYear = 2018, /* default */
        pvSetup = 'default',  /* default */
        pvTechnology = 'poly',  /* default */
        elecSellingPrice = 0.03, /* default */
        CVPrice = 85, /* default */
    ): inputs => {
    /**
    * @param roofs - Array of roof objects
    * Build the inputs for solarSim with default and required values
    */
    return {
        roofs: roofs,
        typology: typology,
        nYears: nYears,
        currentYear: currentYear,
        pvSetup: pvSetup,
        pvTechnology: pvTechnology,
        elecSellingPrice: elecSellingPrice,
        CVPrice: CVPrice,
    }
};

export {inputs, outputs, inputsFactory, roof};
