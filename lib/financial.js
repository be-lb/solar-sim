"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environmental_1 = require("./environmental");
var financejs_1 = require("financejs");
var constants = require("./constants");
var Financial = (function () {
    function Financial(the_elec_selling_price, the_CV_price, the_VAT_rate, the_annual_maintenance_cost, has_loan, the_loan_period, the_loan_rate) {
        this.meterCost = constants.METER_COST;
        this.onduleurCost = constants.ONDULEUR_COST;
        this.onduleurReplacementRate = constants.ONDULEUR_REPLACEMENT_RATE;
        this.redevanceCost = constants.REDEVANCE_COST;
        this.inflationRate = constants.INFLATION_RATE;
        this.elecBuyingPrice = constants.ELEC_BUYING_PRICE;
        this.elecIndex = constants.ELEC_INDEX;
        this.discountRate = constants.DISCOUNT_RATE;
        this.productionYearlyLossIndex = constants.PRODUCTION_YEARLY_LOSS_INDEX;
        this.CVTime = constants.CV_TIME;
        this.elecSellingPrice = the_elec_selling_price;
        this.CVPrice = the_CV_price;
        this.VATrate = the_VAT_rate;
        this.annualMaintenanceCost = the_annual_maintenance_cost;
        this.loan = has_loan;
        this.loanPeriod = the_loan_period;
        this.loanRate = the_loan_rate;
    }
    Financial.prototype.computePVCost = function () {
        if (this.PVCost === undefined) {
            return this.PVCost = this.building.power * 1500 * (1 + this.VATrate) / (1.06);
        }
        else {
            return this.PVCost;
        }
    };
    Financial.prototype.computeAnnualMaintenanceCost = function () {
        if (this.annualMaintenanceCost === -9999) {
            return this.annualMaintenanceCost = this.PVCost * constants.MAINTENANCE_COST_FACTOR;
        }
        else {
            return this.annualMaintenanceCost;
        }
    };
    Financial.prototype.computeCVRate = function () {
        if (this.building.power > constants.CV_RATE_SWITCH_POWER) {
            return this.CVRate = constants.CV_RATE_HIGH_POWER;
        }
        else {
            return this.CVRate = constants.CV_RATE_LOW_POWER;
        }
    };
    return Financial;
}());
exports.Financial = Financial;
;
;
;
;
var computeActualAnnualProduction = function (production, fin, nYears) {
    var actualProduction = [];
    for (var i = 1; i <= nYears; i++) {
        actualProduction.push(production * Math.pow((1 - fin.productionYearlyLossIndex), (i - 1)));
    }
    return actualProduction;
};
exports.computeActualAnnualProduction = computeActualAnnualProduction;
var computeFinancialBenefit = function (building, fin, nYears, currentYear) {
    var selfConsumptionAmount = [];
    var CVAmount = [];
    var u = building.user;
    for (var i = 1; i <= nYears; i++) {
        var actualElecBuyingPrice = computeActualPrice(fin.elecBuyingPrice, fin.elecIndex, i);
        var actualProduction = building.production * Math.pow((1 - fin.productionYearlyLossIndex), (i - 1));
        var selfConsumption = 0;
        if (currentYear + i <= constants.CV_END_OF_COMPENSATION_YEAR) {
            selfConsumption = u.annualElectricityConsumption > actualProduction ? actualProduction : u.annualElectricityConsumption;
        }
        else {
            selfConsumption = u.selfProductionRate * actualProduction;
        }
        selfConsumptionAmount.push(selfConsumption * actualElecBuyingPrice);
        if (i <= fin.CVTime) {
            CVAmount.push(fin.CVPrice * (fin.CVRate * actualProduction / 1000));
        }
        else {
            CVAmount.push(0);
        }
    }
    return {
        'selfConsumptionAmount': selfConsumptionAmount,
        'CVAmount': CVAmount
    };
};
exports.computeFinancialBenefit = computeFinancialBenefit;
var computeFinancialAmortization = function (building, fin, nYears, currentYear) {
    var selfConsumptionAmount = [];
    var CVAmount = [];
    var balance = [];
    var actualReturnTimeByYear = [];
    var netActualValueByYear = [];
    var marginalActualReturnTimeByYear = [];
    var u = building.user;
    for (var i = 1; i <= nYears; i++) {
        var actualElecBuyingPrice = computeActualPrice(fin.elecBuyingPrice, fin.elecIndex, i);
        var actualElecSellingPrice = computeActualPrice(fin.elecSellingPrice, fin.elecIndex, i);
        var actualProduction = building.production * Math.pow((1 - fin.productionYearlyLossIndex), (i - 1));
        var selfConsumption = 0;
        if (currentYear + i <= constants.CV_END_OF_COMPENSATION_YEAR) {
            selfConsumption = u.annualElectricityConsumption > actualProduction ? actualProduction : u.annualElectricityConsumption;
        }
        else {
            selfConsumption = u.selfProductionRate * actualProduction;
        }
        selfConsumptionAmount.push(selfConsumption * actualElecBuyingPrice);
        if (i <= fin.CVTime) {
            CVAmount.push(fin.CVPrice * (fin.CVRate * actualProduction / 1000));
        }
        else {
            CVAmount.push(0);
        }
        var elecBuying = -(u.annualElectricityConsumption - selfConsumption) * actualElecBuyingPrice - fin.redevanceCost;
        var elecSelling = 0;
        if (currentYear + i <= constants.CV_END_OF_COMPENSATION_YEAR) {
            elecSelling = 0;
        }
        else {
            elecSelling = (actualProduction - selfConsumption) * actualElecSellingPrice;
        }
        var OMCosts = -1 * computeActualPrice(fin.annualMaintenanceCost, fin.inflationRate, i);
        console.log(OMCosts);
        var finance = new financejs_1.Finance();
        var loanCosts = 0;
        if (fin.loan) {
            if (i <= fin.loanPeriod) {
                loanCosts = -1 * finance.PMT(fin.loanRate, fin.loanPeriod, -fin.PVCost);
            }
        }
        var totalCost = 0;
        if (i === fin.onduleurReplacementRate) {
            var actualOnduleurCost = computeActualPrice(fin.onduleurCost, fin.inflationRate, i);
            totalCost = loanCosts + OMCosts + CVAmount[i - 1] + elecBuying + elecSelling - actualOnduleurCost;
        }
        else {
            totalCost = loanCosts + OMCosts + CVAmount[i - 1] + elecBuying + elecSelling;
        }
        var baseCost = -u.annualElectricityConsumption * actualElecBuyingPrice - fin.redevanceCost;
        balance.push(totalCost - baseCost);
        netActualValueByYear.push(computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost));
        actualReturnTimeByYear.push(netActualValueByYear[i - 1] < 0 ? 1 : 0);
        if (i === 1) {
            marginalActualReturnTimeByYear.push(Math.abs(-(fin.PVCost + fin.meterCost) / (netActualValueByYear[i - 1] + (fin.PVCost + fin.meterCost))));
        }
        else {
            marginalActualReturnTimeByYear.push(Math.abs(netActualValueByYear[i - 2] / (netActualValueByYear[i - 1] - netActualValueByYear[i - 2])));
        }
    }
    return {
        'selfConsumptionAmount': selfConsumptionAmount,
        'CVAmount': CVAmount,
        'balance': balance,
        'netActualValueByYear': netActualValueByYear,
        'actualReturnTimeByYear': actualReturnTimeByYear,
        'marginalActualReturnTimeByYear': marginalActualReturnTimeByYear
    };
};
exports.computeFinancialAmortization = computeFinancialAmortization;
var getFinancialYearN = function (building, fin, nYears, currentYear) {
    var selfConsumptionAmountYearN = 0;
    var CVAmountYearN = 0;
    var financialBenefit = computeFinancialBenefit(building, fin, nYears, currentYear);
    for (var i = 1; i <= nYears; i++) {
        selfConsumptionAmountYearN = selfConsumptionAmountYearN + financialBenefit.selfConsumptionAmount[i - 1];
        CVAmountYearN = CVAmountYearN + financialBenefit.CVAmount[i - 1];
    }
    return {
        'selfConsumptionAmountYearN': selfConsumptionAmountYearN,
        'CVAmountYearN': CVAmountYearN
    };
};
exports.getFinancialYearN = getFinancialYearN;
var computeSimplifiedFinancialAmortization = function (fin, production, selfConsumptionAmountYear1, CVAmountYear1, nYears) {
    var productionPrice = (fin.PVCost + fin.meterCost) / nYears / production;
    var simpleReturnTime = (fin.PVCost + fin.meterCost) / (selfConsumptionAmountYear1 + CVAmountYear1);
    return {
        'productionPrice': productionPrice,
        'simpleReturnTime': simpleReturnTime
    };
};
exports.computeSimplifiedFinancialAmortization = computeSimplifiedFinancialAmortization;
var computeActualFinancialAmortization = function (fin, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear) {
    var finance = new financejs_1.Finance();
    var actualReturnTime = environmental_1.sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[environmental_1.sum(actualReturnTimeByYear)];
    var netActualValue = computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost);
    var returnInternalRate = finance.IRR.apply(finance, [-(fin.PVCost + fin.meterCost)].concat(balance)) / 100;
    var modifiedReturnInternalRate = MIRR([-(fin.PVCost + fin.meterCost)].concat(balance), 0.1, fin.discountRate);
    return {
        'actualReturnTime': actualReturnTime,
        'netActualValue': netActualValue,
        'returnInternalRate': returnInternalRate,
        'modifiedReturnInternalRate': modifiedReturnInternalRate
    };
};
exports.computeActualFinancialAmortization = computeActualFinancialAmortization;
var computeActualReturnTime = function (actualReturnTimeByYear, marginalActualReturnTimeByYear) {
    var actualReturnTime = environmental_1.sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[environmental_1.sum(actualReturnTimeByYear)];
    if (isNaN(actualReturnTime)) {
        actualReturnTime = 25;
    }
    return actualReturnTime;
};
exports.computeActualReturnTime = computeActualReturnTime;
var getInstallationCost = function (fin) {
    return fin.PVCost + fin.meterCost;
};
exports.getInstallationCost = getInstallationCost;
var computeActualPrice = function (price, index, time) {
    return price * Math.pow((1 + index), time);
};
exports.computeActualPrice = computeActualPrice;
var computeNetPresentValue = function (discountRate, values) {
    var ii = 1;
    var npv = 0;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var v = values_1[_i];
        npv = npv + v / Math.pow((1 + discountRate), ii);
        ii++;
    }
    return npv;
};
exports.computeNetPresentValue = computeNetPresentValue;
var MIRR = function (values, financeRate, discountRate) {
    var n = values.length;
    var payments = [];
    var incomes = [];
    for (var i = 0; i < n; i++) {
        if (values[i] < 0) {
            payments.push(values[i]);
        }
        else {
            incomes.push(values[i]);
        }
    }
    var num = -computeNetPresentValue(discountRate, incomes) * Math.pow(1 + discountRate, n - 1);
    var den = computeNetPresentValue(financeRate, payments) * (1 + financeRate);
    return Math.pow(num / den, 1 / (n - 1)) - 1;
};
