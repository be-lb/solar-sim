/*
 * src/run.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import {Building} from './building';
import {Roof} from './roof';
import {User} from './user';
import {Financial, computeActualAnnualProduction, computeFinancialAmortization, getFinancialYear1, computeActualFinancialAmortization} from './financial';
import {Environmental, computeCO2Emissions, getEnvironmentalCosts, computeEnergeticReturn} from './environmental';
import {inputs, outputs} from './index';

const solarSim =
    (inputs: inputs):
    outputs => {
    /**
    * @param inputs
    * @return outputs
    * Main function
    */
    let b = new Building(inputs.typology);

    // for (let r of roofs) {
    //
    // }
    let r1 = new Roof(30, 950, 'default', 'poly', b);
    b.roofs = [r1];

    b.computeProduction();

    // User information
    let u = new User();
    u.hasWashingMachine = true;
    u.hasElectricWaterHeater = true;
    u.hasElectricHeating = false;
    u.computeAnnualElecConsumption();
    b.user = u;

    // Financial information
    let f = new Financial();
    f.building = b;
    f.computePVCost();

    // 1) Financial results
    // 1.1) Compute results Year 1
    let financialAmortization = computeFinancialAmortization(b, f, inputs.nYears, inputs.currentYear);
    let selfConsumptionAmount = financialAmortization.selfConsumptionAmount;
    let CVAmount = financialAmortization.CVAmount;
    let financialYear1 = getFinancialYear1(selfConsumptionAmount, CVAmount);
    console.log('selfConsumption Year 1 (€): ' + financialYear1.selfConsumptionAmountYear1);
    console.log('CV selling Year 1 (€): ' + financialYear1.CVAmountYear1);
    // 1.2) Compute actualized results
    let balance = financialAmortization.balance;
    let actualReturnTimeByYear = financialAmortization.actualReturnTimeByYear;
    let marginalActualReturnTimeByYear = financialAmortization.marginalActualReturnTimeByYear;
    let actualFinancialAmortization = computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear);
    console.log('actualReturnTime (year): ' +  actualFinancialAmortization.actualReturnTime);
    console.log('netActualValue (€): ' +  actualFinancialAmortization.netActualValue);
    console.log('returnInternalRate (): ' +  actualFinancialAmortization.returnInternalRate);
    console.log('modifiedReturnInternalRate (): ' +  actualFinancialAmortization.modifiedReturnInternalRate);

    // 2) Environmental results
    // 2.1) CO2 emissions
    let actualProduction = computeActualAnnualProduction(b.production, r1.productionYearlyLossIndex, inputs.nYears);
    let CO2emissions = computeCO2Emissions(actualProduction);
    console.log('CO2 emissions (kg CO2) : ' + CO2emissions);
    // 2.2) Energetic costs
    let e = new Environmental('Belgium');
    let environmentalCosts = getEnvironmentalCosts(e, b);
    console.log('energetic cost (kWh): ' + environmentalCosts.energeticCost);  // wrong result because inconsistence dans maquette xls sur la puissance utilisée
    // 2.3) Environmental return
    let energeticReturn = computeEnergeticReturn(environmentalCosts.energeticCost, b.production, actualProduction);
    console.log('Energetic return time (year): ' + energeticReturn.energeticReturnTime);
    console.log('Energetic return factor (year): ' + energeticReturn.energeticReturnFactor);

    return {
        'energeticCost': environmentalCosts.energeticCost,
        // more outputs as defined in the output interface can come here
    }
}

export { solarSim };
