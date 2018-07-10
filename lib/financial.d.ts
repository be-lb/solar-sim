import { Building } from './building';
declare class Financial {
    meterCost: number;
    onduleurCost: number;
    onduleurReplacementRate: number;
    redevanceCost: number;
    inflationRate: number;
    elecBuyingPrice: number;
    elecSellingPrice: number;
    elecIndex: number;
    discountRate: number;
    productionYearlyLossIndex: number;
    CVPrice: number;
    CVRate: number;
    CVTime: number;
    PVCost: number;
    building: Building;
    constructor(the_elec_selling_price: number, the_CV_price: number);
    computePVCost(): number;
}
interface financialBenefit {
    [key: string]: number[];
}
interface financialAmortization {
    [key: string]: number[];
}
interface simplifiedFinancialAmortization {
    'productionPrice': number;
    'simpleReturnTime': number;
}
interface actualFinancialAmortization {
    'actualReturnTime': number;
    'netActualValue': number;
    'returnInternalRate': number;
    'modifiedReturnInternalRate': number;
}
interface financialYearN {
    'selfConsumptionAmountYearN': number;
    'CVAmountYearN': number;
}
declare const computeActualAnnualProduction: (production: number, fin: Financial, nYears: number) => number[];
declare const computeFinancialBenefit: (building: Building, fin: Financial, nYears: number, currentYear: number) => financialBenefit;
declare const computeFinancialAmortization: (building: Building, fin: Financial, nYears: number, currentYear: number) => financialAmortization;
declare const getFinancialYearN: (building: Building, fin: Financial, nYears: number, currentYear: number) => financialYearN;
declare const computeSimplifiedFinancialAmortization: (fin: Financial, production: number, selfConsumptionAmountYear1: number, CVAmountYear1: number, nYears: number) => simplifiedFinancialAmortization;
declare const computeActualFinancialAmortization: (fin: Financial, balance: number[], actualReturnTimeByYear: number[], marginalActualReturnTimeByYear: number[]) => actualFinancialAmortization;
declare const getInstallationCost: (fin: Financial) => number;
declare const computeActualPrice: (price: number, index: number, time: number) => number;
declare const computeNetPresentValue: (discountRate: number, values: number[]) => number;
export { Financial };
export { computeActualAnnualProduction, getFinancialYearN, computeFinancialBenefit, computeFinancialAmortization, computeSimplifiedFinancialAmortization, computeActualFinancialAmortization, computeActualPrice, computeNetPresentValue, getInstallationCost };
