interface roof {
    'area': number;
    'productivity': number;
    'tilt': number;
    [key: string]: any;
}
interface inputs {
    'roofs': roof[];
    'typology': string;
    'nYears': number;
    'currentYear': number;
    'pvSetup': string;
    'pvTechnology': string;
    'elecSellingPrice': number;
    'CVPrice': number;
    'pvArea': number;
}
interface mainOutputs {
    'installationCost': number;
    'CVAmountYearN': number;
    'selfConsumptionAmountYearN': number;
    'savedCO2emissions': number;
}
interface setupOutputs {
    'area': number;
    'power': number;
    'obstacleRate': number;
}
interface energyOutputs {
    'annualProduction': number;
    'annualConsumption': number;
    'autonomy': number;
}
interface financeOutputs {
    'totalGain25Y': number;
    'returnTime': number;
}
interface outputs {
    'main': mainOutputs;
    'setup': setupOutputs;
    'energy': energyOutputs;
    'finance': financeOutputs;
}
declare const inputsFactory: (roofs: roof[], typology?: string, nYears?: number, currentYear?: number, pvSetup?: string, pvTechnology?: string, elecSellingPrice?: number, CVPrice?: number, pvArea?: number) => inputs;
export { inputs, outputs, inputsFactory, roof };
