"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var building_1 = require("./building");
var roof_1 = require("./roof");
var user_1 = require("./user");
var financial_1 = require("./financial");
var environmental_1 = require("./environmental");
var thermic_1 = require("./thermic");
var solarSim = function (inputs) {
    var b = new building_1.Building(inputs.obstacleRate);
    for (var _i = 0, _a = inputs.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        var roof = new roof_1.Roof(r.area, r.productivity, r.tilt, r.azimuth, inputs.pvTechnology, b);
        b.roofs.push(roof);
    }
    b.pvArea = inputs.pvArea;
    b.computePVArea();
    b.computePower();
    b.computeMaxPvArea();
    b.computeProduction();
    var u = new user_1.User(inputs.annualConsumptionKWh, inputs.energySobriety, inputs.chargeShift, inputs.pvHeater, inputs.battery, b);
    u.computeAnnualElecConsumption();
    u.computeSelfConsumptionRate();
    b.user = u;
    var f = new financial_1.Financial(inputs.elecSellingPrice, inputs.CVPrice, inputs.VATrate, inputs.annualMaintenanceCost, inputs.loan, inputs.loanPeriod, inputs.loanRate);
    f.building = b;
    f.computePVCost();
    f.computeOnduleurCost();
    f.computeAnnualMaintenanceCost();
    f.computeCVRate();
    var financialYearN = financial_1.getFinancialYearN(b, f, inputs.nYears, inputs.currentYear);
    var financialYear25 = financial_1.getFinancialYearN(b, f, 25, inputs.currentYear);
    var financialAmortization = financial_1.computeFinancialAmortization(b, f, 25, inputs.currentYear);
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
        'maxArea': b.maxPvArea,
        'power': b.power,
        'obstacleRate': b.obstacleRate,
        'annualProduction': b.production,
        'annualConsumption': u.annualElectricityConsumption,
        'autonomy': u.selfProductionRate,
        'totalGain25Y': financialYear25.CVAmountYearN + financialYear25.selfConsumptionAmountYearN,
        'returnTime': actualReturnTime,
    };
};
exports.solarSim = solarSim;
var thermicSolarSim = function (inputs) {
    var b = new building_1.Building(inputs.obstacleRate);
    for (var _i = 0, _a = inputs.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        var roof = new roof_1.Roof(r.area, r.productivity, r.tilt, r.azimuth, 'NA', b);
        b.roofs.push(roof);
    }
    var t = new thermic_1.Thermic(inputs.thermicHouseholdPerson, inputs.thermicLiterByPersonByDay, inputs.thermicLiterByDay, inputs.thermicHotWaterProducer, inputs.thermicCost, inputs.thermicAnnualMaintenanceCost, inputs.thermicMaintenanceRate, inputs.thermicGrant, inputs.VATrate);
    t.computeCost();
    t.computeAnnualMaintenanceCost();
    t.building = b;
    t.computeSolarProduction();
    t.computePumpConsumption();
    var f = new financial_1.Financial(-9999, -9999, inputs.VATrate, -9999, inputs.loan, 3, 0.018);
    var gain = thermic_1.computeThermicGain(t, f, 25);
    var productionPrices = thermic_1.computeProductionPrices(t, 25);
    var actualReturnTime = thermic_1.computeActualReturnTimeThermic(t, f, 25);
    return {
        'installationCost': t.cost,
        'grant': t.grant,
        'gain': gain,
        'annualProduction': t.solarProduction,
        'productionPriceWithSubsidies': productionPrices.productionPriceWithSubsidies,
        'productionPriceWithoutSubsidies': productionPrices.productionPriceWithoutSubsidies,
        'returnTime': actualReturnTime
    };
};
exports.thermicSolarSim = thermicSolarSim;
