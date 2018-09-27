// Mock the maquette xls
// run with node as node ./test/xls-maquette.js

/*jshint esversion: 6 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run = require("../../lib/run");
var building = require("../../lib/building");
var roof = require("../../lib/roof");
var user = require("../../lib/user");
var financial = require("../../lib/financial");
var environmental = require("../../lib/environmental");

var roofs = [
    {'area': 30, 'productivity': 950, 'tilt': 35}
];
var inputs = {
    roofs: roofs,
    pvTechnology: 'poly',
    nYears: 25,
    currentYear: 2018,
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
    annualConsumptionKWh: -9999,
    installationPrice: -9999,
    obstacleRate: 0.2
};

var b = new building.Building(inputs.obstacleRate);

for (var r of inputs.roofs) {
    var roof = new roof.Roof(r.area, r.productivity, r.tilt, inputs.pvTechnology, b);
    b.roofs.push(roof);
}
b.pvArea = inputs.pvArea;
// Compute the total pv area and optimize roof areas if needed
b.computePVArea();
// Compute the total power and optimize roof power if needed
b.computePower();
// Compute the total production
b.computeProduction();


// User information
var u = new user.User(constants, 3500, true, true, true, true, b);
//u.computeAnnualElecConsumption();
u.computeSelfConsumptionRate();
b.user = u;

// Financial information
var f = new financial.Financial(inputs.elecSellingPrice, inputs.CVPrice);
f.building = b;
f.computePVCost();
f.computeAnnualMaintenanceCost();
f.computeCVRate();

//console.log(b)

// 1) Financial results
// 1.1) Compute results Year 1, 10 and 25
var financialYear1 = financial.getFinancialYearN(b, f, 1, inputs.currentYear);
console.log('$In.H85: selfConsumption Year 1 (€): ' + financialYear1.selfConsumptionAmountYearN);
console.log('$In.H86: CV selling Year 1 (€): ' + financialYear1.CVAmountYearN);
console.log('$In.H89: Gain d\'utilisation annuel: ' + (financialYear1.CVAmountYearN+financialYear1.selfConsumptionAmountYearN));

// 1.2) Actual production
var actualProduction = financial.computeActualAnnualProduction(b.production, f, inputs.nYears);
console.log('$Calculs.Line10: actual production (kWh/an): ' + actualProduction.map(x => Math.round(x)));

// 1.3) financial Benefit
var financialBenefit = financial.computeFinancialBenefit(b, f, inputs.nYears, inputs.currentYear);
console.log('$Calculs.Line27: autoconso - elec PV (€): ' + financialBenefit.selfConsumptionAmount.map(x => Math.round(x)));
console.log('$Calculs.Line30: Vente CV (€): ' + financialBenefit.CVAmount.map(x => Math.round(x)));

// 1.4) financialAmortization
var financialAmortization = financial.computeFinancialAmortization(b, f, inputs.nYears, inputs.currentYear);
console.log('$Calculs.Line37: CF-PV (€): ' + financialAmortization.balance.map(x => Math.round(x)));
console.log('$Calculs.Line38: VAN - investissement PV (€): ' + financialAmortization.netActualValueByYear.map(x => Math.round(x)));
console.log('$Calculs.Line42: TRA (year): ' + financialAmortization.actualReturnTimeByYear.map(x => Math.round(x)));
console.log('$Calculs.Line44: TRA marginal (year): ' + financialAmortization.marginalActualReturnTimeByYear.map(x => Math.round(x)));

// 1.5) Calcul simplifié
var simplifiedFinancialAmortization = financial.computeSimplifiedFinancialAmortization(f, b.production, financialYear1.selfConsumptionAmountYearN, financialYear1.CVAmountYearN, inputs.nYears);
console.log('$In.H92: prix de revient de production (€/kWh): ' + simplifiedFinancialAmortization.productionPrice);
console.log('$In.H94: TRS: ' + simplifiedFinancialAmortization.simpleReturnTime);

// 2) Environmental results
// 2.1) CO2 emissions
var savedCO2emissions = environmental.computeSavedCO2Emissions(actualProduction);
console.log('$In.H105: Saved CO2 emissions (kg CO2) : ' + savedCO2emissions); // known issue, bad computation in the Maquette xls

// 2.2) Energetic costs
var e = new environmental.Environmental('Belgium');
var environmentalCosts = environmental.getEnvironmentalCosts(e, b);
console.log('$In.H108: energetic cost (kWh): ' + environmentalCosts.energeticCost);

// 2.3) Environmental return
var energeticReturn = environmental.computeEnergeticReturn(environmentalCosts.energeticCost, b.production, actualProduction);
console.log('$In.H117: Energetic return factor: ' + energeticReturn.energeticReturnFactor);
console.log('$In.H118: Energetic return time (year): ' + energeticReturn.energeticReturnTime);
