/*
 * src/index.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import { solarSim, thermicSolarSim } from './run';
import { roof, inputs, Constants } from './io';

// Example with required parameters only
// let roofs: roof[] = [
//     {'area': 5, 'productivity': 1050, 'tilt': 30, 'azimuth': 120},
//     {'area': 70, 'productivity': 1850, 'tilt': 30, 'azimuth': 110},
//     {'area': 300, 'productivity': 50, 'tilt': 30, 'azimuth': 150}
// ];
let roofs: roof[] = [
    {
        "azimuth": 226.64372931979185,
        "irradiance": 1030737.6313046628,
        "productivity": 832.0663151682604,
        "tilt": 45.715942499876064,
        "area": 75.63444978318674,
    },
    {
        "azimuth": 136.89979573840384,
        "irradiance": 1604299.3389477243,
        "productivity": 1295.075874638895,
        "tilt": 44.753653469108045,
        "area": 48.19293945427856,
    },
    {
        "azimuth": 316.8702121694432,
        "irradiance": 928861.0791845283,
        "productivity": 749.8261361448635,
        "tilt": 45.42177889268702,
        "area": 51.885964717689745,
    },
    {
        "azimuth": 46.79341108357369,
        "irradiance": 1266483.8292450996,
        "productivity": 1022.3732024669615,
        "tilt": 87.49675635001802,
        "area": 14.898711878537437,
    },
    {
        "azimuth": 46.76585555446808,
        "irradiance": 930939.016047624,
        "productivity": 751.5035574558909,
        "tilt": 45.36122939443447,
        "area": 109.52514071996171,
    },
    {
        "azimuth": 46.79341108357369,
        "irradiance": 799293.4988399845,
        "productivity": 645.2322842583342,
        "tilt": 45.40167784879384,
        "area": 20.903824548749242,
    }
];

// let inputs = inputsFactory(roofs);
//
// let outputs = solarSim(inputs);
// console.log(outputs);

// Example with all input parameters with the same roof collection
let fullInputs: inputs = {
    roofs: roofs,
    pvTechnology: 'poly',
    nYears: 10,
    currentYear: 2018,
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
    annualConsumptionKWh: 2036,
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
}

let constants: Constants = {
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
    cv_rate_low_power: 2.4,
    cv_rate_high_power: 1.8,
    cv_time: 10,
    cv_end_of_compensation_year: 2020,
    production_yearly_loss_index: 0.0005,
    maintenance_cost_factor: 0.0075,
    max_solar_productivity: 940,
    max_solar_irradiance: 1300,
    medium_solar_productivity: 940,
    flat_roof_tilt: 5,
    low_productivity_limit: 722.5,
    annual_consumption_base: 600,
    washing_machine_factor: 600,
    electric_water_heater_factor: 2336,
    electric_heating_factor: 16500,
    thermic_installation_cost: 6000,
    thermic_maintenance_cost: 100,
    max_liter_per_day: 210,
    min_thermic_area: 5,

    obstacle_default_rate: 0.177,
    obstacle: {
        chimneySmoke:  0.8719,
        velux: 1.409,
        dormerWindow: 5.339,
        flatRoofWindow: 4.192,
        terraceInUse: 26.09,
        lift: 10.93,
        existingSolarPannel: 36.05,
    },
    lost_space_rate: 0.15,

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
        'electric': 0.456 // NB: should be equal to CO2_EMISSIONS_BY_KWH
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

const outputs = solarSim(fullInputs, constants);
console.log(outputs);

const thermic_outputs = thermicSolarSim(fullInputs, constants);
console.log(thermic_outputs);
