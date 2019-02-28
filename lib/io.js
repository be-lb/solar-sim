"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("io-ts");
var energeticCostFactorIO = io.interface({
    Belgium: io.number,
    Europe: io.number,
    China: io.number,
}, 'energeticCostFactorIO');
var breakdownCostFactorIO = io.interface({
    panels: io.number,
    setup: io.number,
    inverter: io.number,
    transportBE: io.number,
    transportEU: io.number,
    transportBoat: io.number,
}, 'breakdownCostFactorIO');
var breakdownCostFactorOriginIO = io.interface({
    Belgium: breakdownCostFactorIO,
    Europe: breakdownCostFactorIO,
    China: breakdownCostFactorIO,
}, 'breakdownCostFactorOriginIO');
var pvTechnoIO = io.interface({
    poly: io.number,
    mono: io.number,
    mono_high: io.number,
}, 'pvTechnoIO');
var selfProdValueIO = io.interface({
    "0.6": io.number,
    "1": io.number,
    "1.4": io.number,
    "1.8": io.number,
    "2.2": io.number,
    "2.6": io.number,
    "3": io.number,
}, 'selfProdValueIO');
var selfProductionIO = io.interface({
    default: selfProdValueIO,
    energySobriety: selfProdValueIO,
    chargeShift: selfProdValueIO,
    pvHeater: selfProdValueIO,
    battery: selfProdValueIO,
}, 'selfProductionIO');
var thermalTechnoIO = io.interface({
    gas: io.number,
    fuel: io.number,
    electric: io.number,
}, 'thermalTechnoIO');
var thermalProdValueIO = io.interface({
    "90": io.number,
    '112.5': io.number,
    "135": io.number,
    "157.5": io.number,
    "180": io.number,
    "202.5": io.number,
    "225": io.number,
    "247.5": io.number,
    "270": io.number,
}, 'thermalProdValueIO');
var thermalProductionIO = io.interface({
    "60": thermalProdValueIO,
    "90": thermalProdValueIO,
    "120": thermalProdValueIO,
    "150": thermalProdValueIO,
    "180": thermalProdValueIO,
    "210": thermalProdValueIO,
}, 'thermalProductionIO');
exports.ObstaclesIO = io.interface({
    velux: io.number,
    dormerWindow: io.number,
    flatRoofWindow: io.number,
    chimneySmoke: io.number,
    terraceInUse: io.number,
    lift: io.number,
    existingSolarPannel: io.number,
}, 'ObstaclesIO');
var cvRateClassesIO = io.interface({
    lower_limit: io.number,
    upper_limit: io.number,
    cv_rate: io.number,
}, 'cvRateClassesIO');
var cvRateClassesIOArray = io.array(cvRateClassesIO, 'cvRateClassesIOArray');
exports.constantsIO = io.interface({
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
    elec_selling_price: io.number,
    cv_price: io.number,
    cv_time: io.number,
    cv_end_of_compensation_year: io.number,
    production_yearly_loss_index: io.number,
    maintenance_cost_factor: io.number,
    max_solar_productivity: io.number,
    medium_solar_productivity: io.number,
    max_solar_irradiance: io.number,
    flat_roof_tilt: io.number,
    low_productivity_limit: io.number,
    energy_sobriety_factor: io.number,
    electric_water_heater_factor: io.number,
    electric_water_heater_min_consumption: io.number,
    electric_heating_factor: io.number,
    thermic_installation_cost: io.number,
    thermic_maintenance_cost: io.number,
    max_liter_per_day: io.number,
    min_thermic_area: io.number,
    obstacle_default_rate: io.number,
    obstacle: exports.ObstaclesIO,
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
    cv_rate_classes: cvRateClassesIOArray
}, 'constantsIO');
;
var inputsFactory = function (roofs, pvTechnology, nYears, currentYear, pvArea, annualConsumptionKWh, installationPrice, obstacleRate, VATrate, annualMaintenanceCost, loanPeriod, loanRate, loan, energySobriety, chargeShift, pvHeater, battery, thermicHouseholdPerson, thermicLiterByPersonByDay, thermicLiterByDay, thermicHotWaterProducer, thermicCost, thermicAnnualMaintenanceCost, thermicMaintenanceRate, thermicGrant) {
    if (pvTechnology === void 0) { pvTechnology = 'mono'; }
    if (nYears === void 0) { nYears = 10; }
    if (currentYear === void 0) { currentYear = 2018; }
    if (pvArea === void 0) { pvArea = -9999; }
    if (annualConsumptionKWh === void 0) { annualConsumptionKWh = 2036; }
    if (installationPrice === void 0) { installationPrice = -9999; }
    if (obstacleRate === void 0) { obstacleRate = 0.182; }
    if (VATrate === void 0) { VATrate = 0.06; }
    if (annualMaintenanceCost === void 0) { annualMaintenanceCost = -9999; }
    if (loanPeriod === void 0) { loanPeriod = 5; }
    if (loanRate === void 0) { loanRate = 0.01; }
    if (loan === void 0) { loan = false; }
    if (energySobriety === void 0) { energySobriety = false; }
    if (chargeShift === void 0) { chargeShift = false; }
    if (pvHeater === void 0) { pvHeater = false; }
    if (battery === void 0) { battery = false; }
    if (thermicHouseholdPerson === void 0) { thermicHouseholdPerson = 5; }
    if (thermicLiterByPersonByDay === void 0) { thermicLiterByPersonByDay = 30; }
    if (thermicLiterByDay === void 0) { thermicLiterByDay = 150; }
    if (thermicHotWaterProducer === void 0) { thermicHotWaterProducer = 'gas'; }
    if (thermicCost === void 0) { thermicCost = -9999; }
    if (thermicAnnualMaintenanceCost === void 0) { thermicAnnualMaintenanceCost = -9999; }
    if (thermicMaintenanceRate === void 0) { thermicMaintenanceRate = 3; }
    if (thermicGrant === void 0) { thermicGrant = 2500; }
    return {
        roofs: roofs,
        pvTechnology: pvTechnology,
        nYears: nYears,
        currentYear: currentYear,
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
    };
};
exports.inputsFactory = inputsFactory;
