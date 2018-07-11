interface roof {
    'area': number;
    'productivity': number;
    'tilt': number;
    [key: string]: any;
}
export declare type PVTechnologyEnum = 'poly' | 'mono' | 'mono_high';
interface inputs {
    'roofs': roof[];
    'pvTechnology': PVTechnologyEnum;
    'nYears': number;
    'currentYear': number;
    'elecSellingPrice': number;
    'CVPrice': number;
    'pvArea': number;
    'annualConsumptionKWh': number;
    'installationPrice': number;
    'obstacleRate': number;
    'VATrate': number;
    'annualMaintenanceCost': number;
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
declare type outputs = mainOutputs & setupOutputs & energyOutputs & financeOutputs;
declare const inputsFactory: (roofs: roof[], pvTechnology?: PVTechnologyEnum, nYears?: number, currentYear?: number, elecSellingPrice?: number, CVPrice?: number, pvArea?: number, annualConsumptionKWh?: number, installationPrice?: number, obstacleRate?: number, VATrate?: number, annualMaintenanceCost?: number) => inputs;
export { inputs, outputs, inputsFactory, roof };
