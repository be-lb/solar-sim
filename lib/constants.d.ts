import { EnergeticCostFactor, BreakdownCostFactorByOrigin } from './environmental';
import { PVYieldObject } from './roof';
import { selfProduction } from './user';
export declare const MAX_POWER = 12;
export declare const CO2_EMISSIONS_BY_KWH = 0.456;
export declare const ENERGETIC_COST_FACTOR: EnergeticCostFactor;
export declare const BREAKDOWN_COST_FACTOR: BreakdownCostFactorByOrigin;
export declare const METER_COST = 289;
export declare const ONDULEUR_COST = 1500;
export declare const ONDULEUR_REPLACEMENT_RATE = 15;
export declare const REDEVANCE_COST = 65;
export declare const INFLATION_RATE = 0.02;
export declare const ELEC_BUYING_PRICE = 0.23;
export declare const ELEC_INDEX = 0.03;
export declare const DISCOUNT_RATE = 0.04;
export declare const CV_RATE_SWITCH_POWER = 5;
export declare const CV_RATE_LOW_POWER = 3;
export declare const CV_RATE_HIGH_POWER = 2.4;
export declare const CV_TIME = 10;
export declare const CV_END_OF_COMPENSATION_YEAR = 2020;
export declare const PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;
export declare const MAINTENANCE_YEARLY_COST_INDEX = 0.0075;
export declare const FLAT_ROOF_TILT: number;
export declare const PV_YIELD: PVYieldObject;
export declare const ANNUAL_CONSUMPTION_BASE = 600;
export declare const WASHING_MACHINE_FACTOR = 600;
export declare const ELECTRIC_WATER_HEATER_FACTOR = 2300;
export declare const ELECTRIC_HEATING_FACTOR = 16500;
export declare const SELF_PRODUCTION: selfProduction;