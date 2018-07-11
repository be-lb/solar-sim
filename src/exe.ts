import axios from 'axios';
import {solarSim} from './run';
import {inputs} from './io';

axios.get('../src/data.json')
    .then(function (response) {
        let roofs = response.data;

        let input: inputs = {
            roofs: roofs,
            pvTechnology: 'poly',
            nYears: 25,
            currentYear: 2018,
            elecSellingPrice: 0.03,
            CVPrice: 85,
            pvArea: -9999,
            annualConsumptionKWh: -9999,
            installationPrice: -9999,
            obstacleRate: 0.2,
            VATrate: 0.21,
            annualMaintenanceCost: -9999,
            loanPeriod: 5,
            loanRate: 0.01,
            loan: false,
            energySobriety: false,
            chargeShift: false,
            pvHeater: false,
            battery: false,
        }

        let results = solarSim(input);
        console.log(results);

        let res_energeticCost = document.getElementById("res_energeticCost");
        console.log(results.main.savedCO2emissions);

        if(res_energeticCost) {
            res_energeticCost.innerHTML = results.main.savedCO2emissions.toString();
        }
    })
    .catch((error) => {
        console.log(error);
    });
