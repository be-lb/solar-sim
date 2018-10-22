import * as io from 'io-ts';


const energeticCostFactorIO = io.interface({
    Belgium: io.number,
    Europe: io.number,
    China: io.number,
}, 'energeticCostFactorIO')

export type EnergeticCostFactor = io.TypeOf<typeof energeticCostFactorIO>;

const breakdownCostFactorIO = io.interface({
    panels: io.number,
    setup: io.number,
    inverter: io.number,
    transportBE: io.number,
    transportEU: io.number,
    transportBoat: io.number,
}, 'breakdownCostFactorIO')

export type BreakdownCostFactor = io.TypeOf<typeof breakdownCostFactorIO>;
export type CostFactor = keyof BreakdownCostFactor;

const breakdownCostFactorOriginIO = io.interface({
    Belgium: breakdownCostFactorIO,
    Europe: breakdownCostFactorIO,
    China: breakdownCostFactorIO,
}, 'breakdownCostFactorOriginIO')

export type BreakdownCostFactorOrigin = io.TypeOf<typeof breakdownCostFactorOriginIO>;
export type CostFactorOrigin = keyof BreakdownCostFactorOrigin;

const pvTechnoIO = io.interface({
    poly: io.number,
    mono: io.number,
    mono_high: io.number,
}, 'pvTechnoIO')

export type PvTechInfo = io.TypeOf<typeof pvTechnoIO>;
export type PvTech = keyof PvTechInfo;

const selfProdValueIO = io.interface({
    "0.6": io.number,
    "1": io.number,
    "1.4": io.number,
    "1.8": io.number,
    "2.2": io.number,
    "2.6": io.number,
    "3": io.number,
}, 'selfProdValueIO')

export type SelfProductionValue = io.TypeOf<typeof selfProdValueIO>
export type SelfProductionValueKey = keyof SelfProductionValue;

const selfProductionIO = io.interface({
    default: selfProdValueIO,
    energySobriety: selfProdValueIO,
    chargeShift: selfProdValueIO,
    pvHeater: selfProdValueIO,
    battery: selfProdValueIO,
}, 'selfProductionIO')

export type SelfProduction = io.TypeOf<typeof selfProductionIO>;
export type SelfProductionChoice = keyof SelfProduction;


const thermalTechnoIO = io.interface({
    gas: io.number,
    fuel: io.number,
    electric: io.number,
}, 'thermalTechnoIO')

export type ThermalTechnoInfo = io.TypeOf<typeof thermalTechnoIO>;
export type ThermalTechno = keyof ThermalTechnoInfo;


const thermalProdValueIO = io.interface({
    "90": io.number,
    '112.5': io.number,
    "135": io.number,
    "157.5": io.number,
    "180": io.number,
    "202.5": io.number,
    "225": io.number,
    "247.5": io.number,
    "270": io.number,
}, 'thermalProdValueIO')

export type ThermalProductionValue = io.TypeOf<typeof thermalProdValueIO>;
export type ThermalProductioValueKey = keyof ThermalProductionValue;

const thermalProductionIO = io.interface({
    "60": thermalProdValueIO,
    "90": thermalProdValueIO,
    "120": thermalProdValueIO,
    "150": thermalProdValueIO,
    "180": thermalProdValueIO,
    "210": thermalProdValueIO,
}, 'thermalProductionIO')

export type ThermalProduction = io.TypeOf<typeof thermalProductionIO>;
export type ThermalProductionKey = keyof ThermalProduction;

export const ObstaclesIO = io.interface({
    velux: io.number,
    dormerWindow: io.number,
    flatRoofWindow: io.number,
    chimneySmoke: io.number,
    terraceInUse: io.number,
    lift: io.number,
    existingSolarPannel: io.number,
}, 'ObstaclesIO');

export type Obstacles = io.TypeOf<typeof ObstaclesIO>;
export type Obstacle = keyof Obstacles;


export const constantsIO = io.interface({
    max_power: io.number,
    co2_emissions_by_kwh: io.number,
    meter_cost: io.number,
    onduleur_cost_factor: io.number,
    onduleur_replacement_rate: io.number,
    redevance_cost: io.number,
    pvheater_cost: io.number,
    battery_cost: io.number,
    inflation_rate: io.number,
    elec_buying_price: io.number,
    elec_index: io.number,
    discount_rate: io.number,
    cv_rate_switch_power: io.number,
    cv_rate_low_power: io.number,
    cv_rate_high_power: io.number,
    cv_time: io.number,
    cv_end_of_compensation_year: io.number,
    production_yearly_loss_index: io.number,
    maintenance_cost_factor: io.number,
    max_solar_productivity: io.number,
    medium_solar_productivity: io.number,
    max_solar_irradiance: io.number,
    flat_roof_tilt: io.number,
    low_productivity_limit: io.number,
    annual_consumption_base: io.number,
    washing_machine_factor: io.number,
    electric_water_heater_factor: io.number,
    electric_heating_factor: io.number,
    thermic_installation_cost: io.number,
    thermic_maintenance_cost: io.number,
    max_liter_per_day: io.number,
    min_thermic_area: io.number,

    obstacle_default_rate: io.number,
    obstacle: ObstaclesIO,
    lost_space_rate: io.number,

    energetic_cost_factor: energeticCostFactorIO,
    breakdown_cost_factor: breakdownCostFactorOriginIO,
    pv_yield: pvTechnoIO,
    pv_cost: pvTechnoIO,
    self_production: selfProductionIO,
    hot_water_producer_yield: thermalTechnoIO,
    hot_water_energy_cost: thermalTechnoIO,
    hot_water_energy_cost_index: thermalTechnoIO,
    co2_emissions_by_kwh_thermic: thermalTechnoIO,
    thermic_production: thermalProductionIO,
}, 'constantsIO')

export type Constants = io.TypeOf<typeof constantsIO>;


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
    'CVAmountYear10': number,
    'selfConsumptionAmountYear10': number,
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
    'CVAmountYear25': number,
    'selfConsumptionAmountYear25': number,
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
    'savedCO2emissions': number,
    'annualProduction': number,
    'annualConsumption': number,
    'autonomyRate': number,
    'productionPriceWithSubsidies': number,
    'productionPriceWithoutSubsidies': number,
    'returnTime': number
};

const inputsFactory = (
    roofs: roof[], /* required */
    pvTechnology: PVTechnologyEnum = 'mono',  /* required */
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
    loan = false, /*default */
    energySobriety = false, /*default */
    chargeShift = false, /*default */
    pvHeater = false, /*default */
    battery = false, /*default */
    thermicHouseholdPerson = 5, /*default */
    thermicLiterByPersonByDay = 30, /*default */
    thermicLiterByDay = 150, /*default */
    thermicHotWaterProducer: thermicHotWaterProducerEnum = 'gas', /*default */
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
        roofs,
        pvTechnology: pvTechnology,
        nYears,
        currentYear,
        elecSellingPrice,
        CVPrice,
        pvArea,
        annualConsumptionKWh,
        installationPrice,
        obstacleRate,
        VATrate,
        annualMaintenanceCost,
        loanPeriod,
        loanRate,
        loan,
        energySobriety,
        chargeShift,
        pvHeater,
        battery,
        thermicHouseholdPerson,
        thermicLiterByPersonByDay,
        thermicLiterByDay,
        thermicHotWaterProducer,
        thermicCost,
        thermicAnnualMaintenanceCost,
        thermicMaintenanceRate,
        thermicGrant
    };
};

export { inputs, outputs, thermicOutputs, inputsFactory, roof };
