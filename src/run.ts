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
import {Financial, computeActualAnnualProduction, computeFinancialAmortization, getFinancialYearN, computeActualFinancialAmortization, getInstallationCost} from './financial';
import {Environmental, computeSavedCO2Emissions, getEnvironmentalCosts, computeEnergeticReturn} from './environmental';
import {inputs, outputs} from './io';

const solarSim =
    (inputs: inputs):
    outputs => {
    /**
    * @param inputs
    * @return outputs
    * Main function
    */
    let b = new Building(inputs.typology);

    for (let r of inputs.roofs) {
        let roof = new Roof(r.area, r.productivity, r.tilt, inputs.pvSetup, inputs.pvTechnology, b);
        b.roofs.push(roof);
    }
    b.computePVArea();
    b.computeProduction();
    b.computePower();

    // User information
    let u = new User();
    u.hasWashingMachine = true;
    u.hasElectricWaterHeater = true;
    u.hasElectricHeating = false;
    u.computeAnnualElecConsumption();
    b.user = u;

    // Financial information
    let f = new Financial(inputs.elecSellingPrice, inputs.CVPrice);
    f.building = b;
    f.computePVCost();

    // 1) Financial results
    // 1.1) Compute results Year 1
    let financialAmortization = computeFinancialAmortization(b, f, inputs.nYears, inputs.currentYear);
    let selfConsumptionAmount = financialAmortization.selfConsumptionAmount;
    let CVAmount = financialAmortization.CVAmount;
    let financialYear1 = getFinancialYearN(selfConsumptionAmount, CVAmount, 1);
    console.log('selfConsumption Year 1 (€): ' + financialYear1.selfConsumptionAmountYearN);
    console.log('CV selling Year 1 (€): ' + financialYear1.CVAmountYearN);
    let financialYear10 = getFinancialYearN(selfConsumptionAmount, CVAmount, 10);
    let financialYear25 = getFinancialYearN(selfConsumptionAmount, CVAmount, 25);
    // 1.2) Compute actualized results
    let balance = financialAmortization.balance;
    let actualReturnTimeByYear = financialAmortization.actualReturnTimeByYear;
    let marginalActualReturnTimeByYear = financialAmortization.marginalActualReturnTimeByYear;
    let actualFinancialAmortization = computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear);
    console.log('actualReturnTime (year): ' +  actualFinancialAmortization.actualReturnTime);
    console.log('netActualValue (€): ' +  actualFinancialAmortization.netActualValue);
    console.log('returnInternalRate (): ' +  actualFinancialAmortization.returnInternalRate);
    console.log('modifiedReturnInternalRate (): ' +  actualFinancialAmortization.modifiedReturnInternalRate);
    // 1.3) installation costs
    let installationCost = getInstallationCost(f);

    // 2) Environmental results
    // 2.1) CO2 emissions
    let actualProduction = computeActualAnnualProduction(b.production, f, inputs.nYears);
    let savedCO2emissions = computeSavedCO2Emissions(actualProduction);
    console.log('Saved CO2 emissions (kg CO2) : ' + savedCO2emissions);
    // 2.2) Energetic costs
    let e = new Environmental('Belgium');
    let environmentalCosts = getEnvironmentalCosts(e, b);
    console.log('energetic cost (kWh): ' + environmentalCosts.energeticCost);
    // 2.3) Environmental return
    let energeticReturn = computeEnergeticReturn(environmentalCosts.energeticCost, b.production, actualProduction);
    console.log('Energetic return time (year): ' + energeticReturn.energeticReturnTime);
    console.log('Energetic return factor (year): ' + energeticReturn.energeticReturnFactor);

    return {
        'main' : {
            'installationCost' : installationCost,
            'CVAmountYearN' : financialYear10.CVAmountYearN,
            'selfConsumptionAmountYearN' : financialYear10.selfConsumptionAmountYearN,
            'savedCO2emissions' : savedCO2emissions
        },
        'setup': {
            'area': b.pvArea,
            'power': b.power,
            'obstacleRate': b.obstacleRate
        },
        'energy': {
            'annualProduction': b.production,
            'annualConsumption': u.annualElectricityConsumption,
            'autonomy': 9999 //TODO, u.annualElectricityConsumption/b.production ?
        },
        'finance': {
            'totalGain25Y': financialYear25.CVAmountYearN + financialYear25.selfConsumptionAmountYearN,
            'returnTime': actualFinancialAmortization.actualReturnTime
        }
    }
}

export { solarSim };
