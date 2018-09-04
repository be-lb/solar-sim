
interface roof {
    'area': number;
    'productivity': number;
    'tilt': number;
    [key: string]: any;
}

export type PVTechnologyEnum =
    | 'poly'
    | 'mono'
    | 'mono_high'
    ;

export type thermicHotWaterProducerEnum =
    | 'electric'
    | 'fuel'
    | 'gas'
    ;

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
    'installationCost': number,
    'CVAmountYearN': number,
    'selfConsumptionAmountYearN': number,
    'savedCO2emissions': number;
}

interface setupOutputs {
    'area': number,
    'maxArea': number,
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

// interface outputs {
//     'main': mainOutputs,
//     'setup': setupOutputs,
//     'energy': energyOutputs,
//     'finance': financeOutputs
// };

type outputs = mainOutputs & setupOutputs & energyOutputs & financeOutputs;

interface thermicOutputs {
    'installationCost': number,
    'grant': number,
    'gain': number,
    'annualProduction': number,
    'productionPriceWithSubsidies': number,
    'productionPriceWithoutSubsidies': number,
    'returnTime': number
};

const inputsFactory = (
    roofs: roof[], /* required */
    pvTechnology: PVTechnologyEnum = 'poly',  /* required */
    nYears = 10, /* default */
    currentYear = 2018, /* default */
    elecSellingPrice = 0.03, /* default */
    CVPrice = 85, /* default */
    pvArea = -9999, /* computed or inputed */
    annualConsumptionKWh = 2036, /* average according to brugel */
    installationPrice = -9999, /* computed or inputed */
    obstacleRate = 0.182, /*default */
    VATrate = 0.06, /*default */
    annualMaintenanceCost = -9999, /* computed or inputed */
    loanPeriod = 5, /*default */
    loanRate = 0.01, /*default */
    loan = true, /*default */
    energySobriety = false, /*default */
    chargeShift = false, /*default */
    pvHeater = false, /*default */
    battery = false, /*default */
    thermicHouseholdPerson = 5, /*default */
    thermicLiterByPersonByDay = 30, /*default */
    thermicLiterByDay = 150, /*default */
    thermicHotWaterProducer: thermicHotWaterProducerEnum = 'electric', /*default */
    thermicCost = -9999, /* computed or inputed */
    thermicAnnualMaintenanceCost = -9999, /* computed or inputed */
    thermicMaintenanceRate = 3, /*default */
    thermicGrant = 2500 /*default */
): inputs => {
    /**
    * @param roofs - Array of roof objects
    * Build the inputs for solarSim with default and required values
    */
    return {
        roofs: roofs,
        pvTechnology: pvTechnology,
        nYears: nYears,
        currentYear: currentYear,
        elecSellingPrice: elecSellingPrice,
        CVPrice: CVPrice,
        pvArea: pvArea,
        annualConsumptionKWh: annualConsumptionKWh,
        installationPrice: installationPrice,
        obstacleRate: obstacleRate,
        VATrate: VATrate,
        annualMaintenanceCost: annualMaintenanceCost,
        loanPeriod: loanPeriod,
        loanRate: loanRate,
        loan: loan,
        energySobriety: energySobriety,
        chargeShift: chargeShift,
        pvHeater: pvHeater,
        battery: battery,
        thermicHouseholdPerson: thermicHouseholdPerson,
        thermicLiterByPersonByDay: thermicLiterByPersonByDay,
        thermicLiterByDay: thermicLiterByDay,
        thermicHotWaterProducer: thermicHotWaterProducer,
        thermicCost: thermicCost,
        thermicAnnualMaintenanceCost: thermicAnnualMaintenanceCost,
        thermicMaintenanceRate: thermicMaintenanceRate,
        thermicGrant: thermicGrant
    }
};

export { inputs, outputs, thermicOutputs, inputsFactory, roof };
