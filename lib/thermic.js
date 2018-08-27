"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var financial_1 = require("./financial");
var financejs_1 = require("financejs");
var environmental_1 = require("./environmental");
var constants = require("./constants");
var Thermic = (function () {
    function Thermic(the_household_person, the_liter_by_person_by_day, the_liter_by_day, the_hot_water_producer, the_cost, the_annual_maintenance_cost, the_maintenance_rate, the_grant, the_VAT_rate) {
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
            return this.cost = constants.THERMIC_INSTALLATION_COST * (1 + this.VATrate);
        }
        else {
            return this.cost;
        }
    };
    Thermic.prototype.computeAnnualMaintenanceCost = function () {
        if (this.annualMaintenanceCost === -9999) {
            return this.annualMaintenanceCost = constants.THERMIC_MAINTENANCE_COST * (1 + this.VATrate);
        }
        else {
            return this.annualMaintenanceCost;
        }
    };
    Thermic.prototype.computeLiterByDay = function () {
        if (this.literByDay === undefined) {
            return this.literByDay = Math.min(this.householdPerson * this.literByPersonByDay, constants.MAX_LITER_PER_DAY);
        }
        else {
            return this.literByDay;
        }
    };
    Thermic.prototype.computeProducerYield = function () {
        return this.producerYield = constants.HOT_WATER_PRODUCER_YIELD[this.hotWaterProducer];
    };
    Thermic.prototype.computeNetDemand = function () {
        return this.netDemand = this.literByDay * 365 * 4.18 / 3600 * (50 - 10);
    };
    Thermic.prototype.computeHotWaterEnergyCost = function () {
        return this.hotWaterEnergyCost = constants.HOT_WATER_ENERGY_COST[this.hotWaterProducer];
    };
    Thermic.prototype.computeHotWaterEnergyCostIndex = function () {
        return this.hotWaterEnergyCostIndex = constants.HOT_WATER_ENERGY_COST_INDEX[this.hotWaterProducer];
    };
    Thermic.prototype.computeSolarProduction = function () {
        var _this = this;
        var solarProduction = 0;
        var azimuth = getAzimuthBestRoof(this.building);
        if (azimuth === -9999) {
            console.log('No solar thermic production is possible.');
        }
        else {
            var keys1 = Object.keys(constants.THERMIC_PRODUCTION).map(function (x) { return Number(x); });
            var diff1 = keys1.map(function (x) { return Math.abs(x - _this.literByDay); });
            var literKey = -1;
            for (var _i = 0, diff1_1 = diff1; _i < diff1_1.length; _i++) {
                var d = diff1_1[_i];
                if (d === Math.min.apply(Math, diff1)) {
                    literKey = keys1[diff1.indexOf(d)];
                }
            }
            var keys2 = Object.keys(constants.THERMIC_PRODUCTION['60']).map(function (x) { return Number(x); });
            var diff2 = keys2.map(function (x) { return Math.abs(x - azimuth); });
            var azimuthKey = -1;
            for (var _a = 0, diff2_1 = diff2; _a < diff2_1.length; _a++) {
                var d = diff2_1[_a];
                if (d === Math.min.apply(Math, diff2)) {
                    azimuthKey = keys2[diff2.indexOf(d)];
                }
            }
            solarProduction = constants.THERMIC_PRODUCTION[literKey][azimuthKey];
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
var getAzimuthBestRoof = function (b) {
    var azimuth = -9999;
    var roofProductivities = [];
    for (var _i = 0, _a = b.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        if (r.usableArea >= constants.MIN_THERMIC_AREA && r.azimuth > 78.75 && r.azimuth < 281.25) {
            roofProductivities.push(r.productivity);
        }
    }
    for (var _b = 0, _c = b.roofs; _b < _c.length; _b++) {
        var r = _c[_b];
        if (r.usableArea >= constants.MIN_THERMIC_AREA && r.azimuth > 78.75 && r.azimuth < 281.25) {
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
        VANminusConsoWithoutSolar.push(financial_1.computeNetPresentValue(constants.DISCOUNT_RATE, hotWaterConsumption));
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
        VANminusConsoWithSolar.push(financial_1.computeNetPresentValue(constants.DISCOUNT_RATE, hotWaterConsumptionSolar) + installationCost);
    }
    return {
        'VANminusConsoWithSolar': VANminusConsoWithSolar,
        'VANminusConsoWithoutSolar': VANminusConsoWithoutSolar
    };
};
exports.computeBalances = computeBalances;
var computeThermicGain = function (t, fin, nYears) {
    var balances = computeBalances(t, fin, nYears);
    return balances.VANminusConsoWithSolar[nYears - 1] - balances.VANminusConsoWithoutSolar[nYears - 1];
};
exports.computeThermicGain = computeThermicGain;
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
        actualReturnTime = 25;
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
