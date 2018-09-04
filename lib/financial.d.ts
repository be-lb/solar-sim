import { Building } from './building';
declare class Financial {
    meterCost: number;
    redevanceCost: number;
    inflationRate: number;
    elecBuyingPrice: number;
    elecSellingPrice: number;
    elecIndex: number;
    discountRate: number;
    productionYearlyLossIndex: number;
    CVPrice: number;
    onduleurCost: number;
    onduleurReplacementRate: number;
    CVRate: number;
    CVTime: number;
    PVCost: number;
    VATrate: number;
    annualMaintenanceCost: number;
    loan: boolean;
    loanPeriod: number;
    loanRate: number;
    building: Building;
    constructor(the_elec_selling_price: number, the_CV_price: number, the_VAT_rate: number, the_annual_maintenance_cost: number, has_loan: boolean, the_loan_period: number, the_loan_rate: number);
    computePVCost(): number;
    computeOnduleurCost(): number;
    computeAnnualMaintenanceCost(): number;
    computeCVRate(): 3 | 2.4;
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
declare const computeActualReturnTime: (actualReturnTimeByYear: number[], marginalActualReturnTimeByYear: number[]) => number;
declare const getInstallationCost: (fin: Financial) => number;
declare const computeActualPrice: (price: number, index: number, time: number) => number;
declare const computeNetPresentValue: (discountRate: number, values: number[]) => number;
export { Financial };
export { computeActualAnnualProduction, getFinancialYearN, computeFinancialBenefit, computeFinancialAmortization, computeSimplifiedFinancialAmortization, computeActualFinancialAmortization, computeActualReturnTime, computeActualPrice, computeNetPresentValue, getInstallationCost };
