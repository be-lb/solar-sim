import axios from 'axios';
import {solarSim} from './run';

axios.get('../src/data.json')
    .then(function (response) {
        let roofs = response.data;

        let input = {
            nYears: 25,
            currentYear: 2018,
            typology: 'residential',
            roofs: roofs,
        }

        let results = solarSim(input);
        console.log(results);

        let res_energeticCost = document.getElementById("res_energeticCost");
        console.log(results.energeticCost);

        if(res_energeticCost) {
            res_energeticCost.innerHTML = results.energeticCost.toString();
        }
    });
