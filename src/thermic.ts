import { Financial, computeActualPrice, computeNetPresentValue } from './financial';
import { Building } from './building';
import { Finance } from 'financejs';
import { sum } from './environmental';
import * as debug from 'debug';
import { Constants, ThermalTechno, ThermalProductionKey, ThermalProductioValueKey } from './io';

const logger = debug('solar-sim:thermic');

class Thermic {
    householdPerson: number;
    literByPersonByDay: number;
    hotWaterProducer: ThermalTechno;
    cost: number;
    annualMaintenanceCost: number;
    maintenanceRate: number;
    grant: number;  /* € */
    VATrate: number;
    literByDay: number; /* L/year */
    producerYield: number;
    netDemand: number;  /* kWh/year */
    hotWaterEnergyCost: number;
    hotWaterEnergyCostIndex: number;
    solarProduction: number; /* kWh/year */
    pumpConsumption: number; /* kWh/year */
    building: Building;
    constructor(
        readonly constants: Constants,
        the_household_person: number,
        the_liter_by_person_by_day: number,
        the_liter_by_day: number,
        the_hot_water_producer: ThermalTechno,
        the_cost: number,
        the_annual_maintenance_cost: number,
        the_maintenance_rate: number,
        the_grant: number,
        the_VAT_rate: number
    ) {
        this.householdPerson = the_household_person;
        this.literByPersonByDay = the_liter_by_person_by_day;
        this.literByDay = the_liter_by_day;
        this.hotWaterProducer = the_hot_water_producer;
        this.cost = the_cost;
        this.annualMaintenanceCost = the_annual_maintenance_cost;
        this.maintenanceRate = the_maintenance_rate;
        this.grant = the_grant;
        this.VATrate = the_VAT_rate;
        this.producerYield = this.computeProducerYield();
        this.netDemand = this.computeNetDemand();
        this.hotWaterEnergyCost = this.computeHotWaterEnergyCost();
        this.hotWaterEnergyCostIndex = this.computeHotWaterEnergyCostIndex();
    }
    computeCost() {
        if (this.cost === -9999) {
            return this.cost = this.constants.thermic_installation_cost * (1 + this.VATrate);
        } else {
            return this.cost;
        }
    }
    computeAnnualMaintenanceCost() {
        if (this.annualMaintenanceCost === -9999) {
            return this.annualMaintenanceCost = this.constants.thermic_maintenance_cost * (1 + this.VATrate);
        } else {
            return this.annualMaintenanceCost;
        }
    }
    computeLiterByDay() {
        if (this.literByDay === undefined) {
            return this.literByDay = Math.min(this.householdPerson * this.literByPersonByDay, this.constants.max_liter_per_day);
        } else {
            return this.literByDay;
        }
    }
    computeProducerYield() {
        return this.producerYield = this.constants.hot_water_producer_yield[this.hotWaterProducer];
    }
    computeNetDemand() {
        return this.netDemand = this.literByDay * 365 * 4.18 / 3600 * (50 - 10);
    }
    computeHotWaterEnergyCost() {
        return this.hotWaterEnergyCost = this.constants.hot_water_energy_cost[this.hotWaterProducer];
    }
    computeHotWaterEnergyCostIndex() {
        return this.hotWaterEnergyCostIndex = this.constants.hot_water_energy_cost_index[this.hotWaterProducer];
    }
    computeSolarProduction() {
        /*
        * annual solar production in kWh/an
        */
        let solarProduction: number = 0;
        let azimuth = getAzimuthBestRoof(this.constants,this.building);
        if (azimuth === -9999) {
            logger(`No solar thermic production is possible because there are no roof with a minimal area and with azimuth between East and West.`);
        } else {
            // get the literByday key
            let keys1 = Object.keys(this.constants.thermic_production).map(x => x as ThermalProductionKey);
            let diff1: number[] = keys1.map(x => Math.abs(Number(x) - this.literByDay));
            let literKey: ThermalProductionKey = '60';
            for (let d of diff1) {
                if (d === Math.min(...diff1)) {
                    literKey = keys1[diff1.indexOf(d)];
                }
            }
            // get the azimuth key
            let keys2 = Object.keys(this.constants.thermic_production['60']).map(x => x as ThermalProductioValueKey);
            let diff2: number[] = keys2.map(x => Math.abs(Number(x) - azimuth));
            let azimuthKey: ThermalProductioValueKey = '90';
            for (let d of diff2) {
                if (d === Math.min(...diff2)) {
                    azimuthKey = keys2[diff2.indexOf(d)];
                }
            }
            solarProduction = this.constants.thermic_production[literKey][azimuthKey];
        }
        return this.solarProduction = solarProduction;
    }
    computePumpConsumption() {
        return this.pumpConsumption = this.solarProduction * 0.03;
    }
};


const getAzimuthBestRoof = (constants:Constants, b: Building): number => {
    /**
    * @param Building - Building
    * Get the azimuth value of the roof with higher productivity,
    * for roofs with a minimal area and with azimuth between East and West.
    */
    let azimuth: number = -9999;
    let roofProductivities: number[] = [];

    for (let r of b.roofs) {
        if (r.usableArea >= constants.min_thermic_area && r.azimuth > 78.75 && r.azimuth < 281.25) {
            roofProductivities.push(r.productivity);
        }
    }
    for (let r of b.roofs) {
        if (r.usableArea >= constants.min_thermic_area && r.azimuth > 78.75 && r.azimuth < 281.25) {
            if (r.productivity === Math.max(...roofProductivities)) {
                azimuth = r.azimuth;
            }
        }
    }
    return azimuth;
};


interface Balances {
    [key: string]: number[];
}

const computeBalances =
    (t: Thermic, fin: Financial, nYears: number):
        Balances => {
        /**
        * @param thermic - Thermic
        * @param financial - Financial
        * @param nYears - number of years
        * Make the main yearly computation.
        */

        let hotWaterConsumption: number[] = [];
        let hotWaterConsumptionSolar: number[] = [];
        let VANminusConsoWithoutSolar: number[] = [];
        let VANminusConsoWithSolar: number[] = [];

        for (let i = 1; i <= nYears; i++) {
            let actualEnergyBuyingPrice: number = computeActualPrice(t.hotWaterEnergyCost, t.hotWaterEnergyCostIndex, i); // line 3
            hotWaterConsumption.push(-t.netDemand / t.producerYield * actualEnergyBuyingPrice);
            VANminusConsoWithoutSolar.push(computeNetPresentValue(t.constants.discount_rate, hotWaterConsumption)); // line 26
            //console.log(VANminusConsoWithoutSolar); // line 26 OK OK

            // Costs with thermic solar system
            let maintenanceCosts: number = 0;
            if (i % t.maintenanceRate === 0) {
                maintenanceCosts = -1 * computeActualPrice(t.annualMaintenanceCost, fin.inflationRate, i); // line 17
            }
            // Loan & installation costs
            let installationCost: number = -t.cost;
            let loanCosts: number = 0;
            let finance = new Finance();
            if (fin.loan) {
                if (i <= fin.loanPeriod) {
                    loanCosts = -1 * finance.PMT(fin.loanRate, fin.loanPeriod, -t.cost);
                }
                installationCost = 0;
            }
            // Grant
            let grant: number = 0;
            if (i === 1) { grant = t.grant };

            let hotWaterProducerCosts: number = -1 * ((t.netDemand - t.solarProduction) / t.producerYield) * actualEnergyBuyingPrice; // line 28
            //console.log(hotWaterProducerCosts); // line 28 OK OK
            let hotWaterElectricCosts: number = -1 * t.pumpConsumption * actualEnergyBuyingPrice; // line 29
            //console.log(hotWaterElectricCosts); // line 29 OK OK
            hotWaterConsumptionSolar.push(maintenanceCosts + loanCosts + grant + hotWaterProducerCosts + hotWaterElectricCosts); // line 30
            //console.log(hotWaterConsumptionSolar); //line 30 OK sauf si loan
            VANminusConsoWithSolar.push(computeNetPresentValue(t.constants.discount_rate, hotWaterConsumptionSolar) + installationCost); // line 32
            //console.log(VANminusConsoWithSolar); // line 32 OK
        }

        return {
            'VANminusConsoWithSolar': VANminusConsoWithSolar,
            'VANminusConsoWithoutSolar': VANminusConsoWithoutSolar
        }
    };

const computeThermicGain =
    (t: Thermic, nYears: number): number => {
        /**
        * @param thermic - Thermic
        * @param nYears - number of years
        * Compute the financial gain (€) of the thermic system which is the energy consumption avoided by the presence of solar panel
        */
        let annualGains: number[] = [];
        let gain: number;

        for (let i = 1; i <= nYears; i++) {
            let actualEnergyBuyingPrice: number = computeActualPrice(t.hotWaterEnergyCost, t.hotWaterEnergyCostIndex, i); // line 3
            let annualGain: number = t.solarProduction / t.producerYield * actualEnergyBuyingPrice;
            annualGains.push(annualGain);
        }

        gain = sum(annualGains);
        return gain;
    }

const computeThermicEnvironmentalGain =
    (t: Thermic, nYears: number): number => {
        /**
        * @param thermic - Thermic
        * @param nYears - number of years
        * Compute the environmental gain (T CO2) as a function of the hot water producer
        */
        return t.solarProduction * nYears * t.constants.co2_emissions_by_kwh_thermic[t.hotWaterProducer];
    }

const computeActualReturnTimeThermic =
    (t: Thermic, fin: Financial, nYears: number): number => {
        /**
        * @param thermic - Thermic
        * @param financial - Financial
        * @param nYears - number of years
        * Compute the financial gain (€).
        */

        let actualReturnTimeByYear: number[] = [];
        let marginalActualReturnTimeByYear: number[] = [];
        let diff: number[] = [];
        let balances = computeBalances(t, fin, nYears);

        for (let i = 1; i <= nYears; i++) {
            diff.push(balances.VANminusConsoWithSolar[i - 1] - balances.VANminusConsoWithoutSolar[i - 1]);
            if (i === 1) {
                if (fin.loan) {
                    marginalActualReturnTimeByYear.push(0);
                } else {
                    marginalActualReturnTimeByYear.push(Math.abs(-t.cost / (diff[i - 1] + t.cost)));
                }
            } else {
                marginalActualReturnTimeByYear.push(Math.abs(diff[i - 2] / (diff[i - 1] - diff[i - 2])));
            }
            actualReturnTimeByYear.push(diff[i - 1] < 0 ? 1 : 0);

        }
        //console.log(actualReturnTimeByYear); // line 37 OK
        //console.log(marginalActualReturnTimeByYear); // line 38 OK
        let actualReturnTime: number = sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[sum(actualReturnTimeByYear)];

        if (isNaN(actualReturnTime)) {
            actualReturnTime = 50; // NaN value occurs when the actualReturnTime would be > than nYears. We consider 50 years as a maximum value.
        }

        return actualReturnTime;
    }

interface productionPrices {
    [key: string]: number;
}

const computeProductionPrices =
    (t: Thermic, nYears: number): productionPrices => {
        /**
        * @param thermic - Thermic
        * Compute two production prices in €/kWh
        */
        let annualSaving: number = (t.netDemand / t.producerYield) - ((t.netDemand - t.solarProduction) / t.producerYield);
        let productionPriceWithSubsidies: number = (t.cost - t.grant) / nYears / annualSaving
        let productionPriceWithoutSubsidies: number = t.cost / nYears / annualSaving

        return {
            'productionPriceWithSubsidies': productionPriceWithSubsidies,
            'productionPriceWithoutSubsidies': productionPriceWithoutSubsidies
        }
    }

export { Thermic, getAzimuthBestRoof, computeBalances, computeThermicGain, computeThermicEnvironmentalGain, computeActualReturnTimeThermic, computeProductionPrices };
