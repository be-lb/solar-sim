"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var inputsFactory = function (roofs, pvTechnology, nYears, currentYear, elecSellingPrice, CVPrice, pvArea, annualConsumptionKWh, installationPrice, obstacleRate) {
    if (nYears === void 0) { nYears = 10; }
    if (currentYear === void 0) { currentYear = 2018; }
    if (elecSellingPrice === void 0) { elecSellingPrice = 0.03; }
    if (CVPrice === void 0) { CVPrice = 85; }
    if (pvArea === void 0) { pvArea = -9999; }
    if (annualConsumptionKWh === void 0) { annualConsumptionKWh = -9999; }
    if (installationPrice === void 0) { installationPrice = -9999; }
    if (obstacleRate === void 0) { obstacleRate = 0.2; }
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
        obstacleRate: obstacleRate
    };
};
exports.inputsFactory = inputsFactory;
