"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var inputsFactory = function (roofs, pvTechnology, nYears, currentYear, elecSellingPrice, CVPrice, pvArea, annualConsumptionKWh, installationPrice, obstacleRate, VATrate, annualMaintenanceCost, loanPeriod, loanRate, loan, energySobriety, chargeShift, pvHeater, battery, thermicHouseholdPerson, thermicLiterByPersonByDay, thermicLiterByDay, thermicHotWaterProducer, thermicCost, thermicAnnualMaintenanceCost, thermicMaintenanceRate, thermicGrant) {
    if (pvTechnology === void 0) { pvTechnology = 'mono'; }
    if (nYears === void 0) { nYears = 10; }
    if (currentYear === void 0) { currentYear = 2018; }
    if (elecSellingPrice === void 0) { elecSellingPrice = 0.03; }
    if (CVPrice === void 0) { CVPrice = 85; }
    if (pvArea === void 0) { pvArea = -9999; }
    if (annualConsumptionKWh === void 0) { annualConsumptionKWh = 2036; }
    if (installationPrice === void 0) { installationPrice = -9999; }
    if (obstacleRate === void 0) { obstacleRate = 0.182; }
    if (VATrate === void 0) { VATrate = 0.06; }
    if (annualMaintenanceCost === void 0) { annualMaintenanceCost = -9999; }
    if (loanPeriod === void 0) { loanPeriod = 5; }
    if (loanRate === void 0) { loanRate = 0.01; }
    if (loan === void 0) { loan = false; }
    if (energySobriety === void 0) { energySobriety = false; }
    if (chargeShift === void 0) { chargeShift = false; }
    if (pvHeater === void 0) { pvHeater = false; }
    if (battery === void 0) { battery = false; }
    if (thermicHouseholdPerson === void 0) { thermicHouseholdPerson = 5; }
    if (thermicLiterByPersonByDay === void 0) { thermicLiterByPersonByDay = 30; }
    if (thermicLiterByDay === void 0) { thermicLiterByDay = 150; }
    if (thermicHotWaterProducer === void 0) { thermicHotWaterProducer = 'electric'; }
    if (thermicCost === void 0) { thermicCost = -9999; }
    if (thermicAnnualMaintenanceCost === void 0) { thermicAnnualMaintenanceCost = -9999; }
    if (thermicMaintenanceRate === void 0) { thermicMaintenanceRate = 3; }
    if (thermicGrant === void 0) { thermicGrant = 2500; }
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
        thermicHouseholdPerson: thermicHouseholdPerson,
        thermicLiterByPersonByDay: thermicLiterByPersonByDay,
        thermicLiterByDay: thermicLiterByDay,
        thermicHotWaterProducer: thermicHotWaterProducer,
        thermicCost: thermicCost,
        thermicAnnualMaintenanceCost: thermicAnnualMaintenanceCost,
        thermicMaintenanceRate: thermicMaintenanceRate,
        thermicGrant: thermicGrant
    };
};
exports.inputsFactory = inputsFactory;
