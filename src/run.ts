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
import {computeSavedCO2Emissions} from './environmental';
import {inputs, outputs} from './io';

const solarSim =
    (inputs: inputs):
    outputs => {
    /**
    * @param inputs
    * @return outputs
    * Main function
    */
    let b = new Building(inputs.obstacleRate);

    for (let r of inputs.roofs) {
        let roof = new Roof(r.area, r.productivity, r.tilt, inputs.pvTechnology, b);
        b.roofs.push(roof);
    }
    b.pvArea = inputs.pvArea;
    // Compute the total pv area and optimize roof areas if needed
    b.computePVArea();
    // Compute the total power and optimize roof power if needed
    b.computePower();
    // Compute the total production
    b.computeProduction();


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

console.log(b)

    // 1) Financial results
    // 1.1) Compute results Year N and 25
    let financialYearN = getFinancialYearN(b, f, inputs.nYears, inputs.currentYear);
    let financialYear25 = getFinancialYearN(b, f, 25, inputs.currentYear);
    // 1.2) Compute actualized results
    let financialAmortization = computeFinancialAmortization(b, f, inputs.nYears, inputs.currentYear);
    let balance = financialAmortization.balance;
    let actualReturnTimeByYear = financialAmortization.actualReturnTimeByYear;
    let marginalActualReturnTimeByYear = financialAmortization.marginalActualReturnTimeByYear;
    let actualFinancialAmortization = computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear);

    // 1.3) installation costs
    let installationCost = getInstallationCost(f);

    // 2) Environmental results
    let actualProduction = computeActualAnnualProduction(b.production, f, inputs.nYears);
    let savedCO2emissions = computeSavedCO2Emissions(actualProduction);

    return {
        'main' : {
            'installationCost' : installationCost,
            'CVAmountYearN' : financialYearN.CVAmountYearN,
            'selfConsumptionAmountYearN' : financialYearN.selfConsumptionAmountYearN,
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
