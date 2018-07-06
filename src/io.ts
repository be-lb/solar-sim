
interface roof {
    'area': number;
    'productivity': number;
}

interface inputs {
    'roofs':  roof[];
    'typology': string; // enum
    'nYears': number;
    'currentYear': number;
    // 'pvTechnology': string; // enum
    // 'pvSetup': string; // enum



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
