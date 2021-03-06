"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environmental_1 = require("./environmental");
var financejs_1 = require("financejs");
var Financial = (function () {
    function Financial(constants, the_VAT_rate, the_annual_maintenance_cost, has_loan, the_loan_period, the_loan_rate) {
        this.constants = constants;
        this.elecSellingPrice = constants.elec_selling_price;
        this.CVPrice = constants.cv_price;
        this.VATrate = the_VAT_rate;
        this.annualMaintenanceCost = the_annual_maintenance_cost;
        this.loan = has_loan;
        this.loanPeriod = the_loan_period;
        this.loanRate = the_loan_rate;
        this.productionYearlyLossIndex = constants.production_yearly_loss_index;
        this.meterCost = constants.meter_cost;
        this.redevanceCost = constants.redevance_cost;
        this.inflationRate = constants.inflation_rate;
        this.elecBuyingPrice = constants.elec_buying_price;
        this.elecIndex = constants.elec_index;
        this.discountRate = constants.discount_rate;
        this.onduleurReplacementRate = constants.onduleur_replacement_rate;
        this.CVTime = constants.cv_time;
        this.cv_end = constants.cv_end_of_compensation_year;
    }
    Financial.prototype.computePVCost = function () {
        if (this.PVCost === undefined) {
            return this.PVCost = this.building.power * this.constants.pv_cost[this.building.roofs[0].technology] * (1 + this.VATrate);
        }
        else {
            return this.PVCost;
        }
    };
    Financial.prototype.computeOnduleurCost = function () {
        if (this.onduleurCost === undefined) {
            return this.onduleurCost = this.building.power * this.constants.onduleur_cost_factor * (1 + this.VATrate) / 1.06;
        }
        else {
            return this.onduleurCost;
        }
    };
    Financial.prototype.computeOtherCost = function () {
        var otherCost = 0;
        if (this.building.user.hasPvHeater) {
            otherCost = otherCost + this.constants.pvheater_cost;
        }
        if (this.building.user.hasBattery) {
            otherCost = otherCost + this.constants.battery_cost;
        }
        return this.otherCost = otherCost;
    };
    Financial.prototype.computeAnnualMaintenanceCost = function () {
        if (this.annualMaintenanceCost === -9999) {
            return this.annualMaintenanceCost = this.PVCost * this.constants.maintenance_cost_factor;
        }
        else {
            return this.annualMaintenanceCost;
        }
    };
    Financial.prototype.computeCVRate = function () {
        var cvrate = this.constants.cv_rate_classes[this.constants.cv_rate_classes.length - 1].cv_rate;
        for (var i = 0; i <= this.constants.cv_rate_classes.length - 1; i++) {
            if (this.building.power > this.constants.cv_rate_classes[i].lower_limit && this.building.power <= this.constants.cv_rate_classes[i].upper_limit) {
                cvrate = this.constants.cv_rate_classes[i].cv_rate;
            }
        }
        return this.CVRate = cvrate;
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
        if (currentYear + i <= fin.cv_end) {
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
        if (currentYear + i <= fin.cv_end) {
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
        if (currentYear + i <= fin.cv_end) {
            elecSelling = 0;
        }
        else {
            elecSelling = (actualProduction - selfConsumption) * actualElecSellingPrice;
        }
        var OMCosts = -1 * computeActualPrice(fin.annualMaintenanceCost, fin.inflationRate, i);
        var finance = new financejs_1.Finance();
        var loanCosts = 0;
        if (fin.loan) {
            if (i <= fin.loanPeriod) {
                loanCosts = -1 * finance.PMT(fin.loanRate, fin.loanPeriod, -fin.PVCost - fin.meterCost);
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
        if (fin.loan) {
            netActualValueByYear.push(computeNetPresentValue(fin.discountRate, balance) - (fin.otherCost));
        }
        else {
            netActualValueByYear.push(computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost + fin.otherCost));
        }
        actualReturnTimeByYear.push(netActualValueByYear[i - 1] < 0 ? 1 : 0);
        if (i === 1) {
            marginalActualReturnTimeByYear.push(Math.abs(-(fin.PVCost + fin.meterCost + fin.otherCost) / (netActualValueByYear[i - 1] + (fin.PVCost + fin.meterCost + fin.otherCost))));
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
var computeLoanCosts = function (fin, nYears) {
    var loanCosts = 0;
    var finance = new financejs_1.Finance();
    for (var i = 1; i <= nYears; i++) {
        if (fin.loan) {
            if (i <= fin.loanPeriod) {
                loanCosts = loanCosts + finance.PMT(fin.loanRate, fin.loanPeriod, -fin.PVCost - fin.meterCost);
            }
        }
    }
    return loanCosts;
};
exports.computeLoanCosts = computeLoanCosts;
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
    var productionPrice = (fin.PVCost + fin.meterCost + fin.otherCost) / nYears / production;
    var simpleReturnTime = (fin.PVCost + fin.meterCost + fin.otherCost) / (selfConsumptionAmountYear1 + CVAmountYear1);
    return {
        'productionPrice': productionPrice,
        'simpleReturnTime': simpleReturnTime
    };
};
exports.computeSimplifiedFinancialAmortization = computeSimplifiedFinancialAmortization;
var computeActualFinancialAmortization = function (fin, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear) {
    var finance = new financejs_1.Finance();
    var actualReturnTime = environmental_1.sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[environmental_1.sum(actualReturnTimeByYear)];
    var netActualValue = computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost + fin.otherCost);
    var returnInternalRate = finance.IRR.apply(finance, [-(fin.PVCost + fin.meterCost + fin.otherCost)].concat(balance)) / 100;
    var modifiedReturnInternalRate = MIRR([-(fin.PVCost + fin.meterCost + fin.otherCost)].concat(balance), 0.1, fin.discountRate);
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
        actualReturnTime = 50;
    }
    return actualReturnTime;
};
exports.computeActualReturnTime = computeActualReturnTime;
var getInstallationCost = function (fin) {
    if (fin.PVCost === 0) {
        return 0;
    }
    else {
        return fin.PVCost + fin.meterCost + fin.otherCost;
    }
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
