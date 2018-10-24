import { Building } from './building';
import { User } from './user';
import { sum } from './environmental';
import { Finance } from 'financejs';
import { Constants } from './io';

class Financial {
    meterCost: number;
    redevanceCost: number;
    inflationRate: number;
    elecBuyingPrice: number;
    elecIndex : number;
    discountRate : number;
    onduleurReplacementRate: number;
    CVTime : number;
    productionYearlyLossIndex: number ;
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
    constructor(
        readonly constants: Constants,
        the_elec_selling_price: number,
        the_CV_price: number,
        the_VAT_rate: number,
        the_annual_maintenance_cost: number,
        has_loan: boolean,
        the_loan_period: number,
        the_loan_rate: number
    ) {
        this.elecSellingPrice = the_elec_selling_price;
        this.CVPrice = the_CV_price;
        this.VATrate = the_VAT_rate;
        this.annualMaintenanceCost = the_annual_maintenance_cost;
        this.loan = has_loan;
        this.loanPeriod = the_loan_period;
        this.loanRate = the_loan_rate;
        this.productionYearlyLossIndex = constants.production_yearly_loss_index;
        this.meterCost=constants.meter_cost;
        this.redevanceCost=constants.redevance_cost;
        this.inflationRate=constants.inflation_rate;
        this.elecBuyingPrice=constants.elec_buying_price;
        this.elecIndex=constants.elec_index;
        this.discountRate=constants.discount_rate;
        this.onduleurReplacementRate=constants.onduleur_replacement_rate;
        this.CVTime=constants.cv_time;
        this.cv_end=constants.cv_end_of_compensation_year;
    }
    computePVCost() {
        if (this.PVCost === undefined) {
            return this.PVCost = this.building.power * this.constants.pv_cost[this.building.roofs[0].technology] * (1 + this.VATrate);
        } else {
            return this.PVCost;
        }
    }
    computeOnduleurCost() {
        if (this.onduleurCost === undefined) {
            return this.onduleurCost = this.building.power * this.constants.onduleur_cost_factor * (1 + this.VATrate) / 1.06;
        } else {
            return this.onduleurCost;
        }
    }
    computeOtherCost() {
        /**
        * Add the costs of the pvHeater and/or the battery if present.
        */
        let otherCost: number = 0;
        if (this.building.user.hasPvHeater){
            otherCost = otherCost + this.constants.pvheater_cost;
        }
        if (this.building.user.hasBattery) {
            otherCost = otherCost + this.constants.battery_cost;
        }
        return this.otherCost = otherCost;
    }
    computeAnnualMaintenanceCost() {
        if (this.annualMaintenanceCost === -9999) {
            return this.annualMaintenanceCost = this.PVCost * this.constants.maintenance_cost_factor;
        } else {
            return this.annualMaintenanceCost;
        }
    }
    computeCVRate() {
        if (this.building.power > this.constants.cv_rate_switch_power) {
            return this.CVRate = this.constants.cv_rate_high_power;
        } else {
            return this.CVRate = this.constants.cv_rate_low_power;
        }
    }
};

interface financialBenefit {
    [key: string]: number[];
}

interface financialAmortization {
    [key: string]: number[];
};

interface simplifiedFinancialAmortization {
    'productionPrice': number;
    'simpleReturnTime': number;
};

interface actualFinancialAmortization {
    'actualReturnTime': number;
    'netActualValue': number;
    'returnInternalRate': number;
    'modifiedReturnInternalRate': number;
}

interface financialYearN {
    'selfConsumptionAmountYearN': number;
    'CVAmountYearN': number;
};


const computeActualAnnualProduction =
    (production: number, fin: Financial, nYears: number):
        number[] => {
        /**
        * @param production - annual photovoltaic production in kWh/year
        * @param fin - Financial
        * @param nYears - number n of years
        * Return a vector of n years of the actual annual photovoltaic production given a yearly loss of productivity and actual prices.
        * Match the line 10 of the Calculs sheet.
        */
        let actualProduction: number[] = [];

        for (let i = 1; i <= nYears; i++) {
            actualProduction.push(production * (1 - fin.productionYearlyLossIndex) ** (i - 1));
        }

        return actualProduction;
    };

const computeFinancialBenefit =
    (building: Building, fin: Financial, nYears: number, currentYear: number):
        financialBenefit => {
        /**
        * @param building - Building
        * @param fin - Financial
        * @param nYears - number of years
        * @param currentYear - current year, e.g., 2018
        * Make the main yearly computation.
        */

        // Instantiate vectors
        let selfConsumptionAmount: number[] = [];
        let CVAmount: number[] = [];

        // Get objects
        let u: User = building.user;

        for (let i = 1; i <= nYears; i++) {
            let actualElecBuyingPrice: number = computeActualPrice(fin.elecBuyingPrice, fin.elecIndex, i);
            let actualProduction: number = building.production * (1 - fin.productionYearlyLossIndex) ** (i - 1);
            let selfConsumption: number = 0;
            if (currentYear + i <= fin.cv_end) {
                selfConsumption = u.annualElectricityConsumption > actualProduction ? actualProduction : u.annualElectricityConsumption
            } else {
                selfConsumption = u.selfProductionRate * actualProduction
            }
            selfConsumptionAmount.push(selfConsumption * actualElecBuyingPrice);
            if (i <= fin.CVTime) {
                CVAmount.push(fin.CVPrice * (fin.CVRate * actualProduction / 1000));
            } else {
                CVAmount.push(0);
            }
        }

        return {
            'selfConsumptionAmount': selfConsumptionAmount,
            'CVAmount': CVAmount
        }
    };


const computeFinancialAmortization =
    (building: Building, fin: Financial, nYears: number, currentYear: number):
        financialAmortization => {
        /**
        * @param building - Building
        * @param fin - Financial
        * @param nYears - number of years
        * @param currentYear - current year, e.g., 2018
        * Make the main yearly computation.
        */

        // Instantiate vectors
        let selfConsumptionAmount: number[] = [];
        let CVAmount: number[] = [];
        let balance: number[] = [];
        let actualReturnTimeByYear: number[] = [];
        let netActualValueByYear: number[] = [];
        let marginalActualReturnTimeByYear: number[] = [];

        // Get objects
        let u: User = building.user;

        for (let i = 1; i <= nYears; i++) {
            let actualElecBuyingPrice: number = computeActualPrice(fin.elecBuyingPrice, fin.elecIndex, i);
            let actualElecSellingPrice: number = computeActualPrice(fin.elecSellingPrice, fin.elecIndex, i);
            //console.log(actualElecBuyingPrice); //OK line 3
            //console.log(actualElecSellingPrice); //OK line 4
            let actualProduction: number = building.production * (1 - fin.productionYearlyLossIndex) ** (i - 1);
            //console.log(actualProduction); //OK line 10
            let selfConsumption: number = 0;
            if (currentYear + i <= fin.cv_end) {
                selfConsumption = u.annualElectricityConsumption > actualProduction ? actualProduction : u.annualElectricityConsumption
            } else {
                selfConsumption = u.selfProductionRate * actualProduction
            }
            //console.log(selfConsumption); //OK line 12
            selfConsumptionAmount.push(selfConsumption * actualElecBuyingPrice);
            //console.log(selfConsumptionAmount); //OK line 27
            // Certificats verts (only < 2028 or year_start + 10? )
            if (i <= fin.CVTime) {
                CVAmount.push(fin.CVPrice * (fin.CVRate * actualProduction / 1000));
            } else {
                CVAmount.push(0);
            }
            //console.log(CVAmount); // line 30 OK

            // Electricity buying and selling
            let elecBuying: number = -(u.annualElectricityConsumption - selfConsumption) * actualElecBuyingPrice - fin.redevanceCost;
            //console.log(elecBuying); // line 31 OK
            let elecSelling: number = 0
            if (currentYear + i <= fin.cv_end) {
                elecSelling = 0;
            } else {
                elecSelling = (actualProduction - selfConsumption) * actualElecSellingPrice;
            }
            //console.log(elecSelling); // line 32 OK

            // Operation & maintenance costs
            let OMCosts: number = -1 * computeActualPrice(fin.annualMaintenanceCost, fin.inflationRate, i);
            //console.log(OMCosts); // new line 21 OK

            // Loan costs
            let finance = new Finance();
            let loanCosts: number = 0;
            if (fin.loan) {
                if (i <= fin.loanPeriod) {
                    loanCosts = -1 * finance.PMT(fin.loanRate, fin.loanPeriod, -fin.PVCost-fin.meterCost);
                }
            }
            //console.log(loanCosts); // new line 23

            // Total PV cost
            let totalCost: number = 0;
            if (i === fin.onduleurReplacementRate) {
                let actualOnduleurCost = computeActualPrice(fin.onduleurCost, fin.inflationRate, i);
                totalCost = loanCosts + OMCosts + CVAmount[i - 1] + elecBuying + elecSelling - actualOnduleurCost;
            } else {
                totalCost = loanCosts + OMCosts + CVAmount[i - 1] + elecBuying + elecSelling;
            }
            //console.log(totalCost); // line 33 OK

            let baseCost: number = -u.annualElectricityConsumption * actualElecBuyingPrice - fin.redevanceCost;
            //console.log(baseCost); // line 23 OK

            balance.push(totalCost - baseCost);

            if (fin.loan){
                netActualValueByYear.push(computeNetPresentValue(fin.discountRate, balance) - (fin.otherCost));
            } else {
                netActualValueByYear.push(computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost + fin.otherCost));
            }
            actualReturnTimeByYear.push(netActualValueByYear[i - 1] < 0 ? 1 : 0);

            if (i === 1) {
                marginalActualReturnTimeByYear.push(Math.abs(- (fin.PVCost + fin.meterCost + fin.otherCost) / (netActualValueByYear[i - 1] + (fin.PVCost + fin.meterCost + fin.otherCost))));
            } else {
                marginalActualReturnTimeByYear.push(Math.abs(netActualValueByYear[i - 2] / (netActualValueByYear[i - 1] - netActualValueByYear[i - 2])));
            }

        }
        //console.log(balance); // line 37 OK
        //console.log(netActualValueByYear); //line 38
        //console.log(actualReturnTimeByYear); //line 42 OK
        //console.log(marginalActualReturnTimeByYear); //line 44 new line 48

        return {
            'selfConsumptionAmount': selfConsumptionAmount,
            'CVAmount': CVAmount,
            'balance': balance,
            'netActualValueByYear': netActualValueByYear,
            'actualReturnTimeByYear': actualReturnTimeByYear,
            'marginalActualReturnTimeByYear': marginalActualReturnTimeByYear
        }
    };


const computeLoanCosts = (fin: Financial, nYears: number): number => {
    let loanCosts: number = 0;
    let finance = new Finance();
    for (let i = 1; i <= nYears; i++) {
        if (fin.loan) {
            if (i <= fin.loanPeriod) {
                loanCosts = loanCosts + finance.PMT(fin.loanRate, fin.loanPeriod, -fin.PVCost-fin.meterCost);
            }
        }
    }
    return loanCosts;
}


const getFinancialYearN =
    (building: Building, fin: Financial, nYears: number, currentYear: number): financialYearN => {
        /**
        * @param building Building
        * @param fin Financial
        * @param nYears number of years to be considered
        * @param currentYear
        * Return the self consumption amount and the "Certificat vert" selling amount in €
        */

        let selfConsumptionAmountYearN: number = 0;
        let CVAmountYearN: number = 0;

        let financialBenefit = computeFinancialBenefit(building, fin, nYears, currentYear)

        for (let i = 1; i <= nYears; i++) {
            selfConsumptionAmountYearN = selfConsumptionAmountYearN + financialBenefit.selfConsumptionAmount[i - 1];
            CVAmountYearN = CVAmountYearN + financialBenefit.CVAmount[i - 1];
        }

        return {
            'selfConsumptionAmountYearN': selfConsumptionAmountYearN,
            'CVAmountYearN': CVAmountYearN
        }
    }

const computeSimplifiedFinancialAmortization =
    (fin: Financial, production: number, selfConsumptionAmountYear1: number, CVAmountYear1: number, nYears: number):
        simplifiedFinancialAmortization => {
        /**
        * @param Financial
        * @param production kWh/an
        * @param selfConsumptionAmountYear1 €
        * @param CVAmountYear1 €
        * Returns the production price in €/kWh and the simple return time in years
        */

        const productionPrice: number = (fin.PVCost + fin.meterCost + fin.otherCost) / nYears / production;
        const simpleReturnTime: number = (fin.PVCost + fin.meterCost + fin.otherCost) / (selfConsumptionAmountYear1 + CVAmountYear1);

        return {
            'productionPrice': productionPrice,
            'simpleReturnTime': simpleReturnTime
        }
    };

const computeActualFinancialAmortization =
    (fin: Financial, balance: number[], actualReturnTimeByYear: number[], marginalActualReturnTimeByYear: number[]):
        actualFinancialAmortization => {
        /**
        * @param fin - Financial
        * @param balance Difference between electricity cost without and with the photovoltaic installation, in €
        * @param actualReturnTimeByYear Actual return time computed for each year, in years.
        * @param marginalActualReturnTimeByYear marginal actualized return time computed by year, in years.
        * Compute 4 indicators of the financial amortization of the photovoltaic installation.
        */

        let finance = new Finance();
        let actualReturnTime: number = sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[sum(actualReturnTimeByYear)];
        let netActualValue: number = computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost + fin.otherCost);
        let returnInternalRate: number = finance.IRR(-(fin.PVCost + fin.meterCost + fin.otherCost), ...balance) / 100;
        let modifiedReturnInternalRate: number = MIRR([-(fin.PVCost + fin.meterCost + fin.otherCost), ...balance], 0.1, fin.discountRate);

        return {
            'actualReturnTime': actualReturnTime,
            'netActualValue': netActualValue,
            'returnInternalRate': returnInternalRate,
            'modifiedReturnInternalRate': modifiedReturnInternalRate
        }
    };

const computeActualReturnTime =
    (actualReturnTimeByYear: number[], marginalActualReturnTimeByYear: number[]):
        number => {
        /**
        * @param actualReturnTimeByYear Actual return time computed for each year, in years.
        * @param marginalActualReturnTimeByYear marginal actualized return time computed by year, in years.
        * Compute the actualized return time of the photovoltaic installation.
        */

        let actualReturnTime: number = sum(actualReturnTimeByYear) + marginalActualReturnTimeByYear[sum(actualReturnTimeByYear)];

        if (isNaN(actualReturnTime)) {
            actualReturnTime = 50; // NaN value occurs when the actualReturnTime would be > than nYears. We consider 50 years as a maximum value.
        }

        return actualReturnTime;
    };

const getInstallationCost = (fin: Financial): number => {
    /**
    * @param fin - Financial
    * Compute the installation cost of the photovoltaic installation.
    */
    if (fin.PVCost === 0) {
        return 0;
    } else {
        return fin.PVCost + fin.meterCost + fin.otherCost;
    }

};

const computeActualPrice = (price: number, index: number, time: number): number => {
    /**
    * @param price - current amount, in €
    * @param index - indexation of price (or inflation rate), in year-1
    * @param time - period for computing the actual price, in year.
    * Compute an actualized price (in €) for a given time in the future, given an index
    */
    return price * (1 + index) ** time;
};

const computeNetPresentValue = (discountRate: number, values: number[]): number => {
    /**
    * @param discountRate - or actualisation rate, in year-1
    * @param values - vector of paiement values, in €
    * Compute the net present value, in €
    */
    let ii: number = 1;
    let npv: number = 0;
    for (let v of values) {
        npv = npv + v / (1 + discountRate) ** ii
        ii++;
    }
    return npv;
};

const MIRR = (values: number[], financeRate: number, discountRate: number): number => {
    // Copyright (c) 2012 Sutoiku, Inc. (MIT License)
    // From https://gist.github.com/ghalimi/4599848
    let n: number = values.length;

    // Lookup payments (negative values) and incomes (positive values)
    let payments: number[] = [];
    let incomes: number[] = [];
    for (let i = 0; i < n; i++) {
        if (values[i] < 0) {
            payments.push(values[i]);
        } else {
            incomes.push(values[i]);
        }
    }

    // Return modified internal rate of return
    var num = -computeNetPresentValue(discountRate, incomes) * Math.pow(1 + discountRate, n - 1);
    var den = computeNetPresentValue(financeRate, payments) * (1 + financeRate);
    return Math.pow(num / den, 1 / (n - 1)) - 1;
};

export { Financial };
export { computeActualAnnualProduction, getFinancialYearN, computeFinancialBenefit, computeFinancialAmortization, computeSimplifiedFinancialAmortization, computeActualFinancialAmortization, computeActualReturnTime, computeActualPrice, computeNetPresentValue, getInstallationCost, computeLoanCosts };
