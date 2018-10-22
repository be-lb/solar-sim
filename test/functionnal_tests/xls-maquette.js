// Mock the maquette xls
// run with node as node ./test/xls-maquette.js

/*jshint esversion: 6 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run = require("../../lib/run");
var building = require("../../lib/building");
var roof = require("../../lib/roof");
var user = require("../../lib/user");
var financial = require("../../lib/financial");
var environmental = require("../../lib/environmental");

var constants = {
    max_power: 12,
    co2_emissions_by_kwh: 0.456,
    meter_cost: 289,
    onduleur_cost_factor: 250,
    onduleur_replacement_rate: 15,
    redevance_cost: 65,
    pvheater_cost: 1700,
    battery_cost: 7000,
    inflation_rate: 0.02,
    elec_buying_price: 0.23,
    elec_index: 0.03,
    discount_rate: 0.04,
    cv_rate_switch_power: 5,
    cv_rate_low_power: 3,
    cv_rate_high_power: 2.4,
    cv_time: 10,
    cv_end_of_compensation_year: 2020,
    production_yearly_loss_index: 0.0005,
    maintenance_cost_factor: 0.0075,
    max_solar_productivity: 1300,
    flat_roof_tilt: 5,
    low_productivity_limit: 800,
    annual_consumption_base: 600,
    washing_machine_factor: 600,
    electric_water_heater_factor: 2336,
    electric_heating_factor: 16500,
    thermic_installation_cost: 6000,
    thermic_maintenance_cost: 100,
    max_liter_per_day: 210,
    min_thermic_area: 5,
    lost_space_rate: 0,
    energetic_cost_factor: { 'Belgium': 2500, 'Europe': 2600, 'China': 2750 },
    breakdown_cost_factor: {
        'Belgium': { 'panels': 0.85, 'setup': 0.04, 'inverter': 0.09, 'transportBE': 0.02, 'transportEU': 0, 'transportBoat': 0 },
        'Europe': { 'panels': 0.81, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.05, 'transportBoat': 0 },
        'China': { 'panels': 0.77, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.02, 'transportBoat': 0.08 },
    },
    pv_yield: {
        'poly': 0.13,
        'mono': 0.155,
        'mono_high': 0.22
    },
    pv_cost: {
        'poly': 1400 / 1.06,
        'mono': 1500 / 1.06,
        'mono_high': 1600 / 1.06
    },
    self_production: {
        "default": {
            "0.6": 0.25,
            "1": 0.3,
            "1.4": 0.34,
            "1.8": 0.36,
            "2.2": 0.38,
            "2.6": 0.39,
            "3": 0.4,
        },
        "energySobriety": {
            "0.6": 0.28,
            "1": 0.32,
            "1.4": 0.35,
            "1.8": 0.37,
            "2.2": 0.38,
            "2.6": 0.39,
            "3": 0.4,
        },
        "chargeShift": {
            "0.6": 0.3,
            "1": 0.34,
            "1.4": 0.36,
            "1.8": 0.38,
            "2.2": 0.39,
            "2.6": 0.4,
            "3": 0.41,
        },
        "pvHeater": {
            "0.6": 0.43,
            "1": 0.49,
            "1.4": 0.54,
            "1.8": 0.55,
            "2.2": 0.57,
            "2.6": 0.58,
            "3": 0.6,
        },
        "battery": {
            "0.6": 0.48,
            "1": 0.54,
            "1.4": 0.59,
            "1.8": 0.62,
            "2.2": 0.64,
            "2.6": 0.66,
            "3": 0.69,
        }
    },
    hot_water_producer_yield: {
        'gas': 0.70,
        'fuel': 0.55,
        'electric': 0.95
    },
    hot_water_energy_cost: {
        'gas': 0.080,
        'fuel': 0.081,
        'electric': 0.267
    },
    hot_water_energy_cost_index: {
        'gas': 0.054,
        'fuel': 0.099,
        'electric': 0.04
    },
    co2_emissions_by_kwh_thermic: {
        'gas': 0.201,
        'fuel': 0.263,
        'electric': 0.456
    },
    thermic_production: {
        "60": {
            "90": 519,
            "112.5": 534,
            "135": 546,
            "157.5": 553,
            "180": 555,
            "202.5": 553,
            "225": 546,
            "247.5": 534,
            "270": 519,
        },
        "90": {
            "90": 742,
            "112.5": 767,
            "135": 787,
            "157.5": 800,
            "180": 804,
            "202.5": 800,
            "225": 787,
            "247.5": 767,
            "270": 742,
        },
        "120": {
            "90": 932,
            "112.5": 968,
            "135": 997,
            "157.5": 1015,
            "180": 1022,
            "202.5": 1015,
            "225": 997,
            "247.5": 968,
            "270": 932,
        },
        "150": {
            "90": 1097,
            "112.5": 1145,
            "135": 1183,
            "157.5": 1207,
            "180": 1215,
            "202.5": 1207,
            "225": 1183,
            "247.5": 1145,
            "270": 1097,
        },
        "180": {
            "90": 1262,
            "112.5": 1321,
            135: 1368,
            157.5: 1398,
            "180": 1408,
            "202.5": 1398,
            "225": 1368,
            "247.5": 1321,
            "270": 1262,
        },
        210: {
            90: 1364,
            112.5: 1432,
            135: 1487,
            157.5: 1522,
            180: 1534,
            202.5: 1522,
            225: 1487,
            247.5: 1432,
            270: 1364,
        }
    },
};

var roofs = [
    {'area': 30, 'productivity': 950, 'tilt': 35}
];
var inputs = {
    roofs: roofs,
    pvTechnology: 'poly',
    nYears: 25,
    currentYear: 2018,
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
    annualConsumptionKWh: -9999,
    installationPrice: -9999,
    obstacleRate: 0.2,
    VATrate: 0.06,
    annualMaintenanceCost: -9999,
    loanPeriod: 5,
    loanRate: 0.02,
    loan: false,
    energySobriety: false,
    chargeShift: false,
    pvHeater: false,
    battery: false,
    thermicHouseholdPerson: 5,
    thermicLiterByPersonByDay: 30,
    thermicLiterByDay: 80,
    thermicHotWaterProducer: 'fuel',
    thermicCost: -9999,
    thermicAnnualMaintenanceCost: -9999,
    thermicMaintenanceRate: 3,
    thermicGrant: 2500
};

var b = new building.Building(inputs.obstacleRate, constants.max_power, constants.max_solar_productivity);

for (var r of inputs.roofs) {
    var roof = new roof.Roof(constants, r.area, r.productivity, r.tilt, r.azimuth, inputs.pvTechnology, b);
    b.roofs.push(roof);
}

b.pvArea = inputs.pvArea;
// Compute the total pv area and optimize roof areas if needed
b.computePVArea();
// Compute the total power and optimize roof power if needed
b.computePower();
// Compute the total production
b.computeProduction();


// User information
var u = new user.User(constants, 3500, true, true, true, true, b);
//u.computeAnnualElecConsumption();
//u.computeSelfConsumptionRate();
u.selfProductionRate = 0.3; // must be hardcoded since the simulator has changed corresponding to the version of maquette xls.
b.user = u;

// Financial information
var f = new financial.Financial(constants, inputs.elecSellingPrice, inputs.CVPrice, inputs.VATrate, inputs.annualMaintenanceCost, inputs.loan, inputs.loanPeriod, inputs.loanRate)
f.building = b;
f.computePVCost();
f.computeAnnualMaintenanceCost();
f.computeCVRate();

// 1) Financial results
// 1.1) Compute results Year 1, 10 and 25
var financialYear1 = financial.getFinancialYearN(b, f, 1, inputs.currentYear);
console.log('$In.H85: selfConsumption Year 1 (€): ' + financialYear1.selfConsumptionAmountYearN);
console.log('$In.H86: CV selling Year 1 (€): ' + financialYear1.CVAmountYearN);
console.log('$In.H89: Gain d\'utilisation annuel: ' + (financialYear1.CVAmountYearN+financialYear1.selfConsumptionAmountYearN));

// 1.2) Actual production
var actualProduction = financial.computeActualAnnualProduction(b.production, f, inputs.nYears);
console.log('$Calculs.Line10: actual production (kWh/an): ' + actualProduction.map(x => Math.round(x)));

// 1.3) financial Benefit
var financialBenefit = financial.computeFinancialBenefit(b, f, inputs.nYears, inputs.currentYear);
console.log('$Calculs.Line27: autoconso - elec PV (€): ' + financialBenefit.selfConsumptionAmount.map(x => Math.round(x)));
console.log('$Calculs.Line30: Vente CV (€): ' + financialBenefit.CVAmount.map(x => Math.round(x)));

// 1.4) financialAmortization
var financialAmortization = financial.computeFinancialAmortization(b, f, inputs.nYears, inputs.currentYear);
console.log('$Calculs.Line37: CF-PV (€): ' + financialAmortization.balance.map(x => Math.round(x)));
console.log('$Calculs.Line38: VAN - investissement PV (€): ' + financialAmortization.netActualValueByYear.map(x => Math.round(x)));
console.log('$Calculs.Line42: TRA (year): ' + financialAmortization.actualReturnTimeByYear.map(x => Math.round(x)));
console.log('$Calculs.Line44: TRA marginal (year): ' + financialAmortization.marginalActualReturnTimeByYear.map(x => Math.round(x)));

// 1.5) Calcul simplifié
var simplifiedFinancialAmortization = financial.computeSimplifiedFinancialAmortization(f, b.production, financialYear1.selfConsumptionAmountYearN, financialYear1.CVAmountYearN, inputs.nYears);
console.log('$In.H92: prix de revient de production (€/kWh): ' + simplifiedFinancialAmortization.productionPrice);
console.log('$In.H94: TRS: ' + simplifiedFinancialAmortization.simpleReturnTime);

// 2) Environmental results
// 2.1) CO2 emissions
var savedCO2emissions = environmental.computeSavedCO2Emissions(actualProduction, constants);
console.log('$In.H105: Saved CO2 emissions (kg CO2) : ' + savedCO2emissions); // known issue, bad computation in the Maquette xls

// 2.2) Energetic costs
var e = new environmental.Environmental('Belgium');
var environmentalCosts = environmental.getEnvironmentalCosts(e, b, constants);
console.log('$In.H108: energetic cost (kWh): ' + environmentalCosts.energeticCost);

// 2.3) Environmental return
var energeticReturn = environmental.computeEnergeticReturn(environmentalCosts.energeticCost, b.production, actualProduction, constants);
console.log('$In.H117: Energetic return factor: ' + energeticReturn.energeticReturnFactor);
console.log('$In.H118: Energetic return time (year): ' + energeticReturn.energeticReturnTime);
