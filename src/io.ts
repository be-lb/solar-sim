
interface roof {
    'area': number;
    'productivity': number;
}

interface inputs {
    'nYears': number;
    'currentYear': number;
    'typology': string;
    'roofs':  roof[];
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


export {roof, inputs, outputs};
