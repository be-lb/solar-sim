"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var building_1 = require("./building");
var roof_1 = require("./roof");
var user_1 = require("./user");
var financial_1 = require("./financial");
var environmental_1 = require("./environmental");
var solarSim = function (inputs) {
    var b = new building_1.Building(inputs.obstacleRate);
    for (var _i = 0, _a = inputs.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        var roof = new roof_1.Roof(r.area, r.productivity, r.tilt, inputs.pvTechnology, b);
        b.roofs.push(roof);
    }
    b.pvArea = inputs.pvArea;
    b.computePVArea();
    b.computePower();
    b.computeProduction();
    var u = new user_1.User(inputs.energySobriety, inputs.chargeShift, inputs.pvHeater, inputs.battery, b);
    u.computeAnnualElecConsumption();
    u.computeSelfConsumptionRate();
    b.user = u;
    var f = new financial_1.Financial(inputs.elecSellingPrice, inputs.CVPrice, inputs.VATrate, inputs.annualMaintenanceCost);
    f.building = b;
    f.computePVCost();
    f.computeAnnualMaintenanceCost();
    f.computeCVRate();
    var financialYearN = financial_1.getFinancialYearN(b, f, inputs.nYears, inputs.currentYear);
    var financialYear25 = financial_1.getFinancialYearN(b, f, 25, inputs.currentYear);
    var financialAmortization = financial_1.computeFinancialAmortization(b, f, inputs.nYears, inputs.currentYear);
    var actualReturnTimeByYear = financialAmortization.actualReturnTimeByYear;
    var marginalActualReturnTimeByYear = financialAmortization.marginalActualReturnTimeByYear;
    var actualReturnTime = financial_1.computeActualReturnTime(actualReturnTimeByYear, marginalActualReturnTimeByYear);
    var installationCost = financial_1.getInstallationCost(f);
    var actualProduction = financial_1.computeActualAnnualProduction(b.production, f, inputs.nYears);
    var savedCO2emissions = environmental_1.computeSavedCO2Emissions(actualProduction);
    return {
        'installationCost': installationCost,
        'CVAmountYearN': financialYearN.CVAmountYearN,
        'selfConsumptionAmountYearN': financialYearN.selfConsumptionAmountYearN,
        'savedCO2emissions': savedCO2emissions,
        'area': b.pvArea,
        'power': b.power,
        'obstacleRate': b.obstacleRate,
        'annualProduction': b.production,
        'annualConsumption': u.annualElectricityConsumption,
        'autonomy': 9999,
        'totalGain25Y': financialYear25.CVAmountYearN + financialYear25.selfConsumptionAmountYearN,
        'returnTime': actualReturnTime,
    };
};
exports.solarSim = solarSim;