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

interface simplifiedFinancialAmortization {
    'productionPrice': number;
    'simpleReturnTime': number;
};


const currentYear: number = 2018; // TODO: get from the browser?

const computeFinancialAmortization =
    (building: Building, fin: Financial, nYears: number):
    number[] => {

    // Instantiate variables
    let actualProduction : number = 0;
    let selfConsumption : number = 0;
    let selfConsumptionAmount: number = 0;
    let selfConsumptionAmountYear1: number = 0;
    let CVAmount: number = 0;
    let CVAmountYear1: number = 0;
    let actualReturnTime: number = 0;
    let elecBuying: number = 0;
    let elecSelling: number = 0;
    let totalCost: number = 0;
    let balance: number[] = [];
    let returnInternalRate: number = 0;
    let modifiedReturnInternalRate: number = 0;

    // Get objects
    let p : PV = building.pv;
    let u : User = building.user;

    const years: number[] = [];
    for (let i = 1; i <= nYears; i++) {
       years.push(i);
    }

    // TODO put this year loop in a dedicated function
    for (let i of years){

        /// Compute actual electricity balance
        let actualElecBuyingPrice: number = computeActualPrice(fin.elecBuyingPrice, fin.elecIndex, i);
        let actualElecSellingPrice: number = computeActualPrice(fin.elecSellingPrice, fin.elecIndex, i);
        //console.log(actualElecBuyingPrice); //OK line 3
        //console.log(actualElecSellingPrice); //OK line 4
        actualProduction = p.production * (1-p.productionYearlyLossIndex)**(i-1);
        //console.log(actualAnnualProduction); //OK
        // Fin de la compensation en 2020
        if (currentYear + i <= 2020) {
            selfConsumption = u.annualElectricityConsumption > actualProduction ? actualProduction : u.annualElectricityConsumption
        } else {
            selfConsumption = u.selfProductionRate * actualProduction
        }
        //console.log(selfConsumption); //OK
        selfConsumptionAmount = selfConsumption * actualElecBuyingPrice;
        //console.log(selfConsumptionAmount); //OK
        if (i === 1) {
            selfConsumptionAmountYear1 = Math.round(selfConsumptionAmount);
        }

        // Certificats verts (only < 2028 or year_start + 10? )
        if (i <= fin.CVTime) {
            CVAmount = fin.CVPrice * (fin.CVRate * actualProduction / 1000);
            if (i === 1) {
                CVAmountYear1 = Math.round(CVAmount);
            }
        } else {
            CVAmount = 0;
        }
        //console.log(CVAmount); // line 30 OK



        // Electricity buying and selling
        elecBuying = -(u.annualElectricityConsumption - selfConsumption) * actualElecBuyingPrice - fin.redevanceCost;
        //console.log(elecBuying); // line 31 OK
        if (currentYear + i <= 2020) {
            elecSelling = 0;
        } else {
            elecSelling = (actualProduction - selfConsumption) * actualElecSellingPrice;
        }
        //console.log(elecSelling); // line 32 OK

        // Total PV cost
        if (i === fin.onduleurReplacementRate) {
            let actualOnduleurCost = computeActualPrice(fin.onduleurCost, fin.inflationRate, i);
            totalCost = CVAmount + elecBuying + elecSelling - actualOnduleurCost;
        } else {
            totalCost = CVAmount + elecBuying + elecSelling;
        }
        console.log(totalCost); // line 33 OK

        // Without PV
        let baseCost: number = -u.annualElectricityConsumption * actualElecBuyingPrice - fin.redevanceCost;
        //console.log(baseCost); // line 23 OK

        balance.push(totalCost-baseCost);
        actualReturnTime = 1;
        returnInternalRate = 1;
        modifiedReturnInternalRate = 1;

    }
    //console.log(balance); // line 37 OK
    let netActualValue: number = computeNetPresentValue(fin.discountRate, balance) - (fin.PVCost + fin.meterCost);  // VAN
    // netActualValue OK


    return [
      selfConsumptionAmountYear1,
      CVAmountYear1,
      actualReturnTime,
      netActualValue,
      returnInternalRate,
      modifiedReturnInternalRate
    ]; //TODO: return an array instead of object
};


const computeSimplifiedFinancialAmortization =
    (pv: PV, fin: Financial, selfConsumptionAmountYear1: number, CVAmountYear1:number, nYears: number):
    simplifiedFinancialAmortization => {
    /**
    * @param PV
    * @param Financial
    * @param selfConsumptionAmountYear1
    * @param CVAmountYear1
    * Returns the production price in €/kWh and the simple return time in years
    */

    const productionPrice: number = Math.round(((fin.PVCost + fin.meterCost)/nYears/pv.production)*10)/10;
    const simpleReturnTime: number = Math.round((fin.PVCost + fin.meterCost)/(selfConsumptionAmountYear1+CVAmountYear1));
    // NB: incoherence avec maquette xls sur PVCost

    return {
        'productionPrice': productionPrice,
        'simpleReturnTime': simpleReturnTime
    }

}

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
export { computeFinancialAmortization, computeSimplifiedFinancialAmortization, computeActualPrice, computeNetPresentValue };

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
