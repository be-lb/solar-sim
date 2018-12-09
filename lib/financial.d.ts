import { Building } from './building';
import { Constants } from './io';
declare class Financial {
    readonly constants: Constants;
    meterCost: number;
    redevanceCost: number;
    inflationRate: number;
    elecBuyingPrice: number;
    elecIndex: number;
    discountRate: number;
    onduleurReplacementRate: number;
    CVTime: number;
    productionYearlyLossIndex: number;
    onduleurCost: number;
    elecSellingPrice: number;
    CVPrice: number;
    CVRate: number;
    PVCost: number;
    VATrate: number;
    annualMaintenanceCost: number;
    loan: boolean;
    loanPeriod: number;
    loanRate: number;
    cv_end: number;
    otherCost: number;
    building: Building;
    constructor(constants: Constants, the_VAT_rate: number, the_annual_maintenance_cost: number, has_loan: boolean, the_loan_period: number, the_loan_rate: number);
    computePVCost(): number;
    computeOnduleurCost(): number;
    computeOtherCost(): number;
    computeAnnualMaintenanceCost(): number;
    computeCVRate(): number;
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
declare const computeLoanCosts: (fin: Financial, nYears: number) => number;
declare const getFinancialYearN: (building: Building, fin: Financial, nYears: number, currentYear: number) => financialYearN;
declare const computeSimplifiedFinancialAmortization: (fin: Financial, production: number, selfConsumptionAmountYear1: number, CVAmountYear1: number, nYears: number) => simplifiedFinancialAmortization;
declare const computeActualFinancialAmortization: (fin: Financial, balance: number[], actualReturnTimeByYear: number[], marginalActualReturnTimeByYear: number[]) => actualFinancialAmortization;
declare const computeActualReturnTime: (actualReturnTimeByYear: number[], marginalActualReturnTimeByYear: number[]) => number;
declare const getInstallationCost: (fin: Financial) => number;
declare const computeActualPrice: (price: number, index: number, time: number) => number;
declare const computeNetPresentValue: (discountRate: number, values: number[]) => number;
export { Financial };
export { computeActualAnnualProduction, getFinancialYearN, computeFinancialBenefit, computeFinancialAmortization, computeSimplifiedFinancialAmortization, computeActualFinancialAmortization, computeActualReturnTime, computeActualPrice, computeNetPresentValue, getInstallationCost, computeLoanCosts };
