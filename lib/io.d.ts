interface roof {
    'area': number;
    'productivity': number;
    'tilt': number;
    [key: string]: any;
}
export declare type PVTechnologyEnum = 'poly' | 'mono' | 'mono_high';
export declare type thermicHotWaterProducerEnum = 'electric' | 'fuel' | 'gas';
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
    'loanPeriod': number;
    'loanRate': number;
    'loan': boolean;
    'energySobriety': boolean;
    'chargeShift': boolean;
    'pvHeater': boolean;
    'battery': boolean;
    'thermicHouseholdPerson': number;
    'thermicLiterByPersonByDay': number;
    'thermicLiterByDay': number;
    'thermicHotWaterProducer': thermicHotWaterProducerEnum;
    'thermicCost': number;
    'thermicAnnualMaintenanceCost': number;
    'thermicMaintenanceRate': number;
    'thermicGrant': number;
}
interface mainOutputs {
    'installationCost': number;
    'CVAmountYearN': number;
    'selfConsumptionAmountYearN': number;
    'savedCO2emissions': number;
}
interface setupOutputs {
    'area': number;
    'maxArea': number;
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
interface thermicOutputs {
    'installationCost': number;
    'grant': number;
    'gain': number;
    'savedCO2emissions': number;
    'annualProduction': number;
    'productionPriceWithSubsidies': number;
    'productionPriceWithoutSubsidies': number;
    'returnTime': number;
}
declare const inputsFactory: (roofs: roof[], pvTechnology?: PVTechnologyEnum, nYears?: number, currentYear?: number, elecSellingPrice?: number, CVPrice?: number, pvArea?: number, annualConsumptionKWh?: number, installationPrice?: number, obstacleRate?: number, VATrate?: number, annualMaintenanceCost?: number, loanPeriod?: number, loanRate?: number, loan?: boolean, energySobriety?: boolean, chargeShift?: boolean, pvHeater?: boolean, battery?: boolean, thermicHouseholdPerson?: number, thermicLiterByPersonByDay?: number, thermicLiterByDay?: number, thermicHotWaterProducer?: thermicHotWaterProducerEnum, thermicCost?: number, thermicAnnualMaintenanceCost?: number, thermicMaintenanceRate?: number, thermicGrant?: number) => inputs;
export { inputs, outputs, thermicOutputs, inputsFactory, roof };
