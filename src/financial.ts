import {Building} from './building';
import {PV} from './pv';
import {User} from './user';

const METER_COST = 289;
const ONDULEUR_COST = 1500;
const ONDULEUR_REPLACEMENT_RATE = 15; // year
const REDEVANCE_COST = 65; // €
const INFLATION_RATE = 0.02 // %
const ELEC_BUYING_PRICE = 0.23;
const ELEC_SELLING_PRICE = 0.03;
const ELEC_INDEX = 0.03;
const DISCOUNT_RATE = 0.04;
const CV_PRICE = 85;
const CV_RATE = 3;
const CV_TIME = 10;

class Financial {
    PVCost: number;
    meterCost: number = METER_COST;
    onduleurCost: number = ONDULEUR_COST;
    onduleurReplacementRate: number = ONDULEUR_REPLACEMENT_RATE;
    redevanceCost: number = REDEVANCE_COST;
    inflationRate: number = INFLATION_RATE;
    elecBuyingPrice: number = ELEC_BUYING_PRICE;
    elecSellingPrice: number = ELEC_SELLING_PRICE;
    elecIndex : number = ELEC_INDEX;
    discountRate : number = DISCOUNT_RATE
    CVPrice : number = CV_PRICE;
    CVRate : number = CV_RATE;
    CVTime : number = CV_TIME;
    building: Building;
    computePVCost () {
        if (this.PVCost === undefined) {
            let totalPower: number = 0;
            for (let r of this.building.roofs) {
                totalPower = totalPower + r.rawPeakPower;
            }
            //return this.PVCost = totalPower * 1500;
            // TODO incoherence maquette xls
            return this.PVCost = 8550;
        } else {
            return this.PVCost;
        }
    }
};

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

interface financialYear1 {
    'selfConsumptionAmountYear1': number;
    'CVAmountYear1': number;
};


const computeActualAnnualProduction =
    (production: number, productionYearlyLossIndex: number, nYears: number):
    number[] => {
    /**
    * @param production - annual photovoltaic production in kWh/year
    * @param productionYearlyLossIndex - annual loss in photovoltaic production due to solar panels degradation
    * @param nYears - number n of years
    * Return a vector of n years of the actual annual photovoltaic production given a yearly loss of productivity and actual prices.
    * Match the line 10 of the Calculs sheet.
    */
    let actualProduction: number[] = [];

    for (let i = 1; i <= nYears; i++) {
        actualProduction.push(production * (1-productionYearlyLossIndex)**(i-1));
    }

    return actualProduction;
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

    // Get objects
    let p : PV = building.pv;
    let u : User = building.user;

    for (let i = 1; i <= nYears; i++) {
        let actualElecBuyingPrice: number = computeActualPrice(fin.elecBuyingPrice, fin.elecIndex, i);
        let actualElecSellingPrice: number = computeActualPrice(fin.elecSellingPrice, fin.elecIndex, i);
        //console.log(actualElecBuyingPrice); //OK line 3
        //console.log(actualElecSellingPrice); //OK line 4
        let actualProduction: number = p.production * (1-p.productionYearlyLossIndex)**(i-1);
        //console.log(actualProduction); //OK line 10
        let selfConsumption: number = 0;
        if (currentYear + i <= 2020) {
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
        if (currentYear + i <= 2020) {
            elecSelling = 0;
        } else {
            elecSelling = (actualProduction - selfConsumption) * actualElecSellingPrice;
        }
        //console.log(elecSelling); // line 32 OK

        // Total PV cost
        let totalCost: number = 0;
        if (i === fin.onduleurReplacementRate) {
            let actualOnduleurCost = computeActualPrice(fin.onduleurCost, fin.inflationRate, i);
            totalCost = CVAmount[i-1] + elecBuying + elecSelling - actualOnduleurCost;
        } else {
            totalCost = CVAmount[i-1] + elecBuying + elecSelling;
        }
        //console.log(totalCost); // line 33 OK

        // Without PV
        let baseCost: number = -u.annualElectricityConsumption * actualElecBuyingPrice - fin.redevanceCost;
        //console.log(baseCost); // line 23 OK

        balance.push(totalCost-baseCost);
    }
    //console.log(balance); // line 37 OK
    return {
        'selfConsumptionAmount': selfConsumptionAmount,
        'CVAmount': CVAmount,
        'balance': balance,
    }
};


const getFinancialYear1 =
    (selfConsumptionAmount: number[], CVAmount: number[]): financialYear1 => {
    /**
    * @param selfConsumptionAmount €
    * @param CVAmount €
    * Return the self consumption amount and the "Certificat vert" selling amount in €
    */

    return {
        'selfConsumptionAmountYear1': selfConsumptionAmount[0],
        'CVAmountYear1': CVAmount[0]
    }
}

const computeSimplifiedFinancialAmortization =
    (fin: Financial, production: number, selfConsumptionAmountYear1: number, CVAmountYear1:number, nYears: number):
    simplifiedFinancialAmortization => {
    /**
    * @param Financial
    * @param production kWh/an
    * @param selfConsumptionAmountYear1 €
    * @param CVAmountYear1 €
    * Returns the production price in €/kWh and the simple return time in years
    */

    const productionPrice: number = Math.round(((fin.PVCost + fin.meterCost)/nYears/production)*10)/10;
    const simpleReturnTime: number = (fin.PVCost + fin.meterCost)/(selfConsumptionAmountYear1+CVAmountYear1);
    // NB: incoherence avec maquette xls sur PVCost

    return {
        'productionPrice': productionPrice,
        'simpleReturnTime': simpleReturnTime
    }
};

const computeActualFinancialAmortization =
    (fin: Financial, balance: number[]): actualFinancialAmortization => {
    /**
    * @param fin - Financial
    * @param balance TODO describe
    * TODO description
    */
    let actualReturnTime: number = 1;
    let netActualValue: number = computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost);  // VAN
    // TODO more
    let returnInternalRate: number = 1;
    let modifiedReturnInternalRate: number = 1;
    return {
        'actualReturnTime': actualReturnTime,
        'netActualValue' : netActualValue,
        'returnInternalRate': returnInternalRate,
        'modifiedReturnInternalRate': modifiedReturnInternalRate
    }
};

const computeActualPrice = (price: number, index: number, time: number): number => {
    return price * (1 + index)**time;
};

const computeNetPresentValue = (discountRate: number, values: number[]): number => {
    let ii: number = 1;
    let npv: number = 0;
    for (let v of values) {
        npv = npv + v/(1+discountRate)**ii
        ii++;
    }
    return npv;
};



export { Financial };
export { computeActualAnnualProduction, getFinancialYear1, computeFinancialAmortization, computeSimplifiedFinancialAmortization, computeActualFinancialAmortization, computeActualPrice, computeNetPresentValue };

// VATrate	float	/		computeVATRate()	a.buildingUse
// otherCosts	money/float	€		CONSTANT
// inflationRate	float	/		CONSTANT
// compensationYear	int/year	an		CONSTANT
// elecPrice	float	€/kWh		computeElecPrice()	u.annualElecConsumption, u.annualElecAmount
// elecPriceRate	float	/		CONSTANT
// elecInjectionPrice	float	€/kWh		CONSTANT
//
// computeVATRate()
// computePVCost()
// computeCVRate()
// computeElecPrice()
