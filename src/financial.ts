import {Building} from './building';
import {PV} from './pv';
import {User} from './user';

const METER_COST = 289;
const ELEC_BUYING_PRICE = 0.23;
const ELEC_INDEX = 0.03;
const CV_PRICE = 85;
const CV_RATE = 3;
const CV_TIME = 10;

class Financial {
    PVCost: number;
    meterCost: number = METER_COST;
    elecBuyingPrice: number = ELEC_BUYING_PRICE;
    elecIndex : number = ELEC_INDEX;
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

const currentYear: number = 2018; // TODO: get from the browser?

const computeFinancialAmortization =
    (building: Building, fin: Financial, year_start: number, year_end: number):
    number[] => {

    // Instantiate variables
    let elecPrice : number = 0;
    let actualProduction : number = 0;
    let selfConsumption : number = 0;
    let selfConsumptionAmount: number = 0;
    let selfConsumptionAmountYear1: number = 0;
    let CVAmount: number = 0;
    let CVAmountYear1: number = 0;
    let productionPrice: number = 0;
    let simpleReturnTime: number = 0;

    // Get objects
    let p : PV = building.pv;
    let u : User = building.user;

    const years: number[] = [];
    for (let i = 1; i <= year_end-year_start; i++) {
       years.push(i);
    }

    for (let ii of years){

        /// Compute electricity balance
        elecPrice = fin.elecBuyingPrice * (1 + fin.elecIndex)**ii;
        //console.log(elecPrice); //OK
        actualProduction = p.production * (1-p.productionYearlyLossIndex)**(ii-1);
        //console.log(actualAnnualProduction); //OK
        // Fin de la compensation en 2020
        if (currentYear + ii <= 2020) {
            selfConsumption = u.annualElectricityConsumption > actualProduction ? actualProduction : u.annualElectricityConsumption
        } else {
            selfConsumption = u.selfProductionRate * actualProduction
        }
        //console.log(selfConsumption); //OK
        selfConsumptionAmount = selfConsumption * elecPrice;
        //console.log(selfConsumptionAmount); //OK
        if (ii === 1) {
            selfConsumptionAmountYear1 = Math.round(selfConsumptionAmount);
        }

        // Certificats verts (only < 2028 or year_start + 10? )
        if (ii < fin.CVTime) {
            CVAmount = fin.CVPrice * (fin.CVRate * actualProduction / 1000);
            if (ii === 1) {
                CVAmountYear1 = Math.round(CVAmount);
            }
        } else {
            CVAmount = 0;
        }
        //console.log(CVAmount); // OK

        // Calcul simplifié
        productionPrice = Math.round(((fin.PVCost + fin.meterCost)/25/p.production)*10)/10;
        simpleReturnTime = Math.round((fin.PVCost + fin.meterCost)/(selfConsumptionAmountYear1+CVAmountYear1));
        // NB: incoherence avec maquette xls sur PVCost

        // Calcul actualisé


    }
    return [selfConsumptionAmountYear1, CVAmountYear1, productionPrice, simpleReturnTime];
}


export { Financial };
export { computeFinancialAmortization };

// VATrate	float	/		computeVATRate()	a.buildingUse
// ondulerCost	money/float	€		CONSTANT
// frequency	int/year	an		CONSTANT
// otherCosts	money/float	€		CONSTANT
// inflationRate	float	/		CONSTANT
// discountRate	float	/		CONSTANT
// compensationYear	int/year	an		CONSTANT
// elecPrice	float	€/kWh		computeElecPrice()	u.annualElecConsumption, u.annualElecAmount
// elecPriceRate	float	/		CONSTANT
// elecInjectionPrice	float	€/kWh		CONSTANT
//
// computeVATRate()
// computePVCost()
// computeCVRate()
// computeElecPrice()
