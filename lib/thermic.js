"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var financial_1 = require("./financial");
var financejs_1 = require("financejs");
var environmental_1 = require("./environmental");
var debug = require("debug");
var logger = debug('solar-sim:thermic');
var Thermic = (function () {
    function Thermic(constants, the_household_person, the_liter_by_person_by_day, the_liter_by_day, the_hot_water_producer, the_cost, the_annual_maintenance_cost, the_maintenance_rate, the_grant, the_VAT_rate) {
        this.constants = constants;
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
    Thermic.prototype.computeCost = function () {
        if (this.cost === -9999) {
            return this.cost = this.constants.thermic_installation_cost * (1 + this.VATrate);
        }
        else {
            return this.cost;
        }
    };
    Thermic.prototype.computeAnnualMaintenanceCost = function () {
        if (this.annualMaintenanceCost === -9999) {
            return this.annualMaintenanceCost = this.constants.thermic_maintenance_cost * (1 + this.VATrate);
        }
        else {
            return this.annualMaintenanceCost;
        }
    };
    Thermic.prototype.computeLiterByDay = function () {
        if (this.literByDay === undefined) {
            return this.literByDay = Math.min(this.householdPerson * this.literByPersonByDay, this.constants.max_liter_per_day);
        }
        else {
            return this.literByDay;
        }
    };
    Thermic.prototype.computeProducerYield = function () {
        return this.producerYield = this.constants.hot_water_producer_yield[this.hotWaterProducer];
    };
    Thermic.prototype.computeNetDemand = function () {
        return this.netDemand = this.literByDay * 365 * 4.18 / 3600 * (50 - 10);
    };
    Thermic.prototype.computeHotWaterEnergyCost = function () {
        return this.hotWaterEnergyCost = this.constants.hot_water_energy_cost[this.hotWaterProducer];
    };
    Thermic.prototype.computeHotWaterEnergyCostIndex = function () {
        return this.hotWaterEnergyCostIndex = this.constants.hot_water_energy_cost_index[this.hotWaterProducer];
    };
    Thermic.prototype.computeSolarProduction = function () {
        var _this = this;
        var solarProduction = 0;
        var azimuth = getAzimuthBestRoof(this.constants, this.building);
        if (azimuth === -9999) {
            logger("No solar thermic production is possible because there are no roof with a minimal area and with azimuth between East and West.");
        }
        else {
            var keys1 = Object.keys(this.constants.thermic_production).map(function (x) { return x; });
            var diff1 = keys1.map(function (x) { return Math.abs(Number(x) - _this.literByDay); });
            var literKey = '60';
            for (var _i = 0, diff1_1 = diff1; _i < diff1_1.length; _i++) {
                var d = diff1_1[_i];
                if (d === Math.min.apply(Math, diff1)) {
                    literKey = keys1[diff1.indexOf(d)];
                }
            }
            var keys2 = Object.keys(this.constants.thermic_production['60']).map(function (x) { return x; });
            var diff2 = keys2.map(function (x) { return Math.abs(Number(x) - azimuth); });
            var azimuthKey = '90';
            for (var _a = 0, diff2_1 = diff2; _a < diff2_1.length; _a++) {
                var d = diff2_1[_a];
                if (d === Math.min.apply(Math, diff2)) {
                    azimuthKey = keys2[diff2.indexOf(d)];
                }
            }
            solarProduction = this.constants.thermic_production[literKey][azimuthKey];
        }
        return this.solarProduction = solarProduction;
    };
    Thermic.prototype.computePumpConsumption = function () {
        return this.pumpConsumption = this.solarProduction * 0.03;
    };
    return Thermic;
}());
exports.Thermic = Thermic;
;
var getAzimuthBestRoof = function (constants, b) {
    var azimuth = -9999;
    var roofProductivities = [];
    for (var _i = 0, _a = b.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        if (r.usableArea >= constants.min_thermic_area && r.azimuth > 78.75 && r.azimuth < 281.25) {
            roofProductivities.push(r.productivity);
        }
    }
    for (var _b = 0, _c = b.roofs; _b < _c.length; _b++) {
        var r = _c[_b];
        if (r.usableArea >= constants.min_thermic_area && r.azimuth > 78.75 && r.azimuth < 281.25) {
            if (r.productivity === Math.max.apply(Math, roofProductivities)) {
                azimuth = r.azimuth;
            }
        }
    }
    return azimuth;
};
exports.getAzimuthBestRoof = getAzimuthBestRoof;
var computeBalances = function (t, fin, nYears) {
    var hotWaterConsumption = [];
    var hotWaterConsumptionSolar = [];
    var VANminusConsoWithoutSolar = [];
    var VANminusConsoWithSolar = [];
    for (var i = 1; i <= nYears; i++) {
        var actualEnergyBuyingPrice = financial_1.computeActualPrice(t.hotWaterEnergyCost, t.hotWaterEnergyCostIndex, i);
        hotWaterConsumption.push(-t.netDemand / t.producerYield * actualEnergyBuyingPrice);
        VANminusConsoWithoutSolar.push(financial_1.computeNetPresentValue(t.constants.discount_rate, hotWaterConsumption));
        var maintenanceCosts = 0;
        if (i % t.maintenanceRate === 0) {
            maintenanceCosts = -1 * financial_1.computeActualPrice(t.annualMaintenanceCost, fin.inflationRate, i);
        }
        var installationCost = -t.cost;
        var loanCosts = 0;
        var finance = new financejs_1.Finance();
        if (fin.loan) {
            if (i <= fin.loanPeriod) {
                loanCosts = -1 * finance.PMT(fin.loanRate, fin.loanPeriod, -t.cost);
            }
            installationCost = 0;
        }
        var grant = 0;
        if (i === 1) {
            grant = t.grant;
        }
        ;
        var hotWaterProducerCosts = -1 * ((t.netDemand - t.solarProduction) / t.producerYield) * actualEnergyBuyingPrice;
        var hotWaterElectricCosts = -1 * t.pumpConsumption * actualEnergyBuyingPrice;
        hotWaterConsumptionSolar.push(maintenanceCosts + loanCosts + grant + hotWaterProducerCosts + hotWaterElectricCosts);
        VANminusConsoWithSolar.push(financial_1.computeNetPresentValue(t.constants.discount_rate, hotWaterConsumptionSolar) + installationCost);
    }
    return {
        'VANminusConsoWithSolar': VANminusConsoWithSolar,
        'VANminusConsoWithoutSolar': VANminusConsoWithoutSolar
    };
};
exports.computeBalances = computeBalances;
var computeThermicGain = function (t, nYears) {
    var annualGains = [];
    var gain;
    for (var i = 1; i <= nYears; i++) {
        var actualEnergyBuyingPrice = financial_1.computeActualPrice(t.hotWaterEnergyCost, t.hotWaterEnergyCostIndex, i);
        var annualGain = t.solarProduction / t.producerYield * actualEnergyBuyingPrice;
        annualGains.push(annualGain);
    }
    gain = environmental_1.sum(annualGains) + t.grant;
    return gain;
};
exports.computeThermicGain = computeThermicGain;
var computeThermicEnvironmentalGain = function (t, nYears) {
    return t.solarProduction * nYears * t.constants.co2_emissions_by_kwh_thermic[t.hotWaterProducer];
};
exports.computeThermicEnvironmentalGain = computeThermicEnvironmentalGain;
var computeActualReturnTimeThermic = function (t, fin, nYears) {
    var actualReturnTimeByYear = [];
    var marginalActualReturnTimeByYear = [];
    var diff = [];
    var balances = computeBalances(t, fin, nYears);
    for (var i = 1; i <= nYears; i++) {
        diff.push(balances.VANminusConsoWithSolar[i - 1] - balances.VANminusConsoWithoutSolar[i - 1]);
        if (i === 1) {
            if (fin.loan) {
                marginalActualReturnTimeByYear.push(0);
            }
            else {
                marginalActualReturnTimeByYear.push(Math.abs(-t.cost / (diff[i - 1] + t.cost)));
            }
        }
        else {
            marginalActualReturnTimeByYear.push(Math.abs(diff[i - 2] / (diff[i - 1] - diff[i - 2])));
        }
        actualReturnTimeByYear.push(diff[i - 1] < 0 ? 1 : 0);
    }
    var actualReturnTime = environmental_1.sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[environmental_1.sum(actualReturnTimeByYear)];
    if (isNaN(actualReturnTime)) {
        actualReturnTime = 50;
    }
    return actualReturnTime;
};
exports.computeActualReturnTimeThermic = computeActualReturnTimeThermic;
var computeProductionPrices = function (t, nYears) {
    var annualSaving = (t.netDemand / t.producerYield) - ((t.netDemand - t.solarProduction) / t.producerYield);
    var productionPriceWithSubsidies = (t.cost - t.grant) / nYears / annualSaving;
    var productionPriceWithoutSubsidies = t.cost / nYears / annualSaving;
    return {
        'productionPriceWithSubsidies': productionPriceWithSubsidies,
        'productionPriceWithoutSubsidies': productionPriceWithoutSubsidies
    };
};
exports.computeProductionPrices = computeProductionPrices;
