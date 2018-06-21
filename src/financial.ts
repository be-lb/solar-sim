import {Building} from './building';
import {PV} from './pv';
import {User} from './user';

const ELEC_INDEX = 0.03;

class Financial {
    PVCost: number;
    meterCost: number;
    elecBuyingPrice: number;
    elecIndex : number = ELEC_INDEX;
    computeElecBuyingPrice () {
        //TODO
        return this.elecBuyingPrice = 0.23;
    }
};


const computeFinancialAmortization =
    (building: Building, fin: Financial, year_start: number, year_end: number):
    number[] => {

    // Instantiate variables
    let elecPrice : number = 0;
    let actualAnnualProduction : number = 0;
    let selfConsumption : number = 0;
    let selfConsumptionAmount: number = 0;
    let selfConsumptionAmountYear1: number = 0;
    let trim: number = 0;

    // Get objects
    let p : PV = building.pv;
    let u : User = building.user;

    const years: number[] = [];
    for (let i = 1; i <= year_end-year_start; i++) {
       years.push(i);
    }

    for (let year of years){

        // compute electricity buying price
        elecPrice = fin.elecBuyingPrice * (1 + fin.elecIndex)**year;
        //console.log(elecPrice); //OK
        // compute selfConsumption
        actualAnnualProduction = p.annualProduction * (1-p.productionYearlyLossIndex)**(year-1);
        //console.log(actualAnnualProduction); //OK
        selfConsumption = u.annualElectricityConsumption > actualAnnualProduction ? actualAnnualProduction : u.annualElectricityConsumption
        // TODO: check pq le calcul change après 2 ans???
        // Après 2 ans, selfConsumption = selfProductionRate * actualAnnualProduction
        //console.log(selfConsumption); //KO
        // Compute selfConsumptionAmount
        selfConsumptionAmount = selfConsumption * elecPrice;
        console.log(selfConsumptionAmount);
        if (year === 1) {
            selfConsumptionAmountYear1 = Math.round(selfConsumptionAmount);
        }



    }
    return [selfConsumptionAmountYear1, trim];
}


export { Financial };
export { computeFinancialAmortization };

// VATrate	float	/		computeVATRate()	a.buildingUse
// PVCost	money/float	€		computePVCost()	p.power
// meterCost	money/float	€		CONSTANT
// ondulerCost	money/float	€		CONSTANT
// frequency	int/year	an		CONSTANT
// otherCosts	money/float	€		CONSTANT
// inflationRate	float	/		CONSTANT
// discountRate	float	/		CONSTANT
// CVCost	money/float	€		CONSTANT
// CVTime	int/year	an		CONSTANT
// CVRate	float	/		computeCVRate()	p.power
// compensationYear	int/year	an		CONSTANT
// elecPrice	float	€/kWh		computeElecPrice()	u.annualElecConsumption, u.annualElecAmount
// elecPriceRate	float	/		CONSTANT
// elecInjectionPrice	float	€/kWh		CONSTANT
//
// computeVATRate()
// computePVCost()
// computeCVRate()
// computeElecPrice()
