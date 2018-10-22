/*
 * src/run.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import { Building } from './building';
import { Roof } from './roof';
import { User } from './user';
import { Financial, computeActualAnnualProduction, computeFinancialAmortization, getFinancialYearN, computeActualReturnTime, getInstallationCost } from './financial';
import { computeSavedCO2Emissions} from './environmental';
import { Constants, inputs, outputs, thermicOutputs } from './io';
import { Thermic, computeThermicGain, computeThermicEnvironmentalGain, computeProductionPrices, computeActualReturnTimeThermic } from './thermic';

const solarSim =
    (inputs: inputs, constants: Constants):
        outputs => {
        /**
        * @param inputs
        * @return outputs
        * Main function
        */

        let b = new Building(inputs.obstacleRate, constants.max_power, constants.max_solar_productivity);

        for (let r of inputs.roofs) {
            let roof = new Roof(constants, r.area, r.productivity, r.tilt, r.azimuth, inputs.pvTechnology, b);
            b.roofs.push(roof);
        }
        b.pvArea = inputs.pvArea;
        // Compute the total pv area and optimize roof areas if needed
        b.computePVArea();
        // Compute the total power and optimize roof power if needed
        b.computePower();
        // Compute the total power and optimize roof power if needed
        b.computeMaxPvArea();
        // Compute the total production
        b.computeProduction();

        // User information
        let u = new User(constants, inputs.annualConsumptionKWh, inputs.energySobriety, inputs.chargeShift, inputs.pvHeater, inputs.battery, b);
        u.computeAnnualElecConsumption();
        u.computeSelfConsumptionRate();
        b.user = u;

        // Financial information
        let f = new Financial(constants, inputs.elecSellingPrice, inputs.CVPrice, inputs.VATrate, inputs.annualMaintenanceCost, inputs.loan, inputs.loanPeriod, inputs.loanRate);
        f.building = b;
        f.computePVCost();
        f.computeOtherCost();
        f.computeOnduleurCost();
        f.computeAnnualMaintenanceCost();
        f.computeCVRate();

        // 1) Financial results
        // 1.1) Compute results Year N and 25
        let financialYear10 = getFinancialYearN(b, f, 10, inputs.currentYear);
        let financialYear25 = getFinancialYearN(b, f, 25, inputs.currentYear);

        // 1.2) Compute actualized results (counted on 50 years)
        let financialAmortization = computeFinancialAmortization(b, f, 50, inputs.currentYear);
        let actualReturnTimeByYear = financialAmortization.actualReturnTimeByYear;
        let marginalActualReturnTimeByYear = financialAmortization.marginalActualReturnTimeByYear;
        let actualReturnTime = computeActualReturnTime(actualReturnTimeByYear, marginalActualReturnTimeByYear);

        // 1.3) installation costs
        let installationCost = getInstallationCost(f);

        // 2) Environmental results
        let actualProduction = computeActualAnnualProduction(b.production, f, 10);
        let savedCO2emissions = computeSavedCO2Emissions(actualProduction, constants);

        return {
            // 'main' : {
            'installationCost': installationCost,
            'CVAmountYear10': financialYear10.CVAmountYearN,
            'selfConsumptionAmountYear10': financialYear10.selfConsumptionAmountYearN,
            'savedCO2emissions': savedCO2emissions,
            'area': b.pvArea,
            'maxArea': b.maxPvArea,
            'power': b.power,
            'obstacleRate': b.obstacleRate,
            // 'energy': {
            'annualProduction': b.production,
            'annualConsumption': u.annualElectricityConsumption,
            'autonomy': u.selfProductionRate,
            // 'finance': {
            'CVAmountYear25': financialYear25.CVAmountYearN,
            'selfConsumptionAmountYear25': financialYear25.selfConsumptionAmountYearN,
            'totalGain25Y': financialYear25.CVAmountYearN + financialYear25.selfConsumptionAmountYearN - installationCost,
            'returnTime': actualReturnTime,
      }
}


const thermicSolarSim =
    (inputs: inputs, constants:Constants):
        thermicOutputs => {
        /**
        * @param inputs
        * @return thermicOutputs
        * Main function for thermic panels
        */

        let b = new Building(inputs.obstacleRate, constants.max_power, constants.max_solar_productivity);

        for (let r of inputs.roofs) {
            let roof = new Roof(constants,r.area, r.productivity, r.tilt, r.azimuth, 'mono', b); // FIXME 'mono' here is a place holder, but hoonestly it stinks -pm
            b.roofs.push(roof);
        }

        let t = new Thermic(constants, inputs.thermicHouseholdPerson, inputs.thermicLiterByPersonByDay, inputs.thermicLiterByDay, inputs.thermicHotWaterProducer, inputs.thermicCost, inputs.thermicAnnualMaintenanceCost, inputs.thermicMaintenanceRate, inputs.thermicGrant, inputs.VATrate)
        t.computeCost();
        t.computeAnnualMaintenanceCost();
        t.building = b;
        t.computeSolarProduction();
        t.computePumpConsumption();
        let f = new Financial(constants, -9999, -9999, inputs.VATrate, -9999, inputs.loan, 3, 0.018);

        let gain = computeThermicGain(t, inputs.nYears);
        let productionPrices = computeProductionPrices(t, 25);
        let actualReturnTime = computeActualReturnTimeThermic(t, f, 50);

        let savedCO2emissions = computeThermicEnvironmentalGain(t, inputs.nYears);
        return {
            'installationCost': t.cost,
            'grant': t.grant,
            'gain': gain,
            'savedCO2emissions': savedCO2emissions,
            'annualProduction': t.solarProduction, // in kWh/an
            'annualConsumption': t.netDemand, // in kWh/an
            'autonomyRate': t.solarProduction/t.netDemand,
            'productionPriceWithSubsidies': productionPrices.productionPriceWithSubsidies,
            'productionPriceWithoutSubsidies': productionPrices.productionPriceWithoutSubsidies,
            'returnTime': actualReturnTime
        }
}


export { solarSim, thermicSolarSim };
