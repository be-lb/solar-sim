
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

// interface outputs {
//     'main': mainOutputs,
//     'setup': setupOutputs,
//     'energy': energyOutputs,
//     'finance': financeOutputs
// };

type outputs = mainOutputs & setupOutputs & energyOutputs & financeOutputs;

const inputsFactory = (
    roofs: roof[], /* required */
    pvTechnology: PVTechnologyEnum = 'poly',  /* required */
    nYears = 10, /* default */
    currentYear = 2018, /* default */
    elecSellingPrice = 0.03, /* default */
    CVPrice = 85, /* default */
    pvArea = -9999, /* default */
    annualConsumptionKWh = 2036, /* average according to brugel */
    installationPrice = -9999, /*default */
    obstacleRate = 0.2, /*default */
    VATrate = 0.06, /*default */
    annualMaintenanceCost = -9999, /*default */
    loanPeriod = 5, /*default */
    loanRate = 0.01, /*default */
    loan = false, /*default */
    energySobriety = false, /*default */
    chargeShift = false, /*default */
    pvHeater = false, /*default */
    battery = false, /*default */
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
    }
};

export { inputs, outputs, inputsFactory, roof };
