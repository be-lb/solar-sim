"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inputsFactory = function (roofs, pvTechnology, nYears, currentYear, elecSellingPrice, CVPrice, pvArea, annualConsumptionKWh, installationPrice, obstacleRate, VATrate, annualMaintenanceCost, loanPeriod, loanRate, loan, energySobriety, chargeShift, pvHeater, battery) {
    if (pvTechnology === void 0) { pvTechnology = 'poly'; }
    if (nYears === void 0) { nYears = 10; }
    if (currentYear === void 0) { currentYear = 2018; }
    if (elecSellingPrice === void 0) { elecSellingPrice = 0.03; }
    if (CVPrice === void 0) { CVPrice = 85; }
    if (pvArea === void 0) { pvArea = -9999; }
    if (annualConsumptionKWh === void 0) { annualConsumptionKWh = -9999; }
    if (installationPrice === void 0) { installationPrice = -9999; }
    if (obstacleRate === void 0) { obstacleRate = 0.2; }
    if (VATrate === void 0) { VATrate = 0.06; }
    if (annualMaintenanceCost === void 0) { annualMaintenanceCost = -9999; }
    if (loanPeriod === void 0) { loanPeriod = 5; }
    if (loanRate === void 0) { loanRate = 0.01; }
    if (loan === void 0) { loan = false; }
    if (energySobriety === void 0) { energySobriety = false; }
    if (chargeShift === void 0) { chargeShift = false; }
    if (pvHeater === void 0) { pvHeater = false; }
    if (battery === void 0) { battery = false; }
    return {
        roofs: roofs,
        pvTechnology: pvTechnology,
        nYears: nYears,
        currentYear: currentYear,
        elecSellingPrice: elecSellingPrice,
        CVPrice: CVPrice,
        pvArea: pvArea,
        annualConsumptionKWh: annualConsumptionKWh,
        installationPrice: installationPrice,
        obstacleRate: obstacleRate,
        VATrate: VATrate,
        annualMaintenanceCost: annualMaintenanceCost,
        loanPeriod: loanPeriod,
        loanRate: loanRate,
        loan: loan,
        energySobriety: energySobriety,
        chargeShift: chargeShift,
        pvHeater: pvHeater,
        battery: battery,
    };
};
exports.inputsFactory = inputsFactory;
