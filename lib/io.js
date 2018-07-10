"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var inputsFactory = function (roofs, typology, nYears, currentYear, pvSetup, pvTechnology, elecSellingPrice, CVPrice, pvArea) {
    if (typology === void 0) { typology = 'closed'; }
    if (nYears === void 0) { nYears = 10; }
    if (currentYear === void 0) { currentYear = 2018; }
    if (pvSetup === void 0) { pvSetup = 'default'; }
    if (pvTechnology === void 0) { pvTechnology = 'poly'; }
    if (elecSellingPrice === void 0) { elecSellingPrice = 0.03; }
    if (CVPrice === void 0) { CVPrice = 85; }
    if (pvArea === void 0) { pvArea = -9999; }
    return {
        roofs: roofs,
        typology: typology,
        nYears: nYears,
        currentYear: currentYear,
        pvSetup: pvSetup,
        pvTechnology: pvTechnology,
        elecSellingPrice: elecSellingPrice,
        CVPrice: CVPrice,
        pvArea: pvArea,
    };
};
exports.inputsFactory = inputsFactory;
