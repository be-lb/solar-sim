"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Thermic = (function () {
    function Thermic(the_household_person, the_liter_by_person_by_day, the_hot_water_producer, the_cost, the_annual_maintenance_cost, the_maintenance_rate, the_grant) {
        this.householdPerson = the_household_person;
        this.literByPersonByDay = the_liter_by_person_by_day;
        this.hotWaterProducer = the_hot_water_producer;
        this.cost = the_cost;
        this.annualMaintenanceCost = the_annual_maintenance_cost;
        this.maintenanceRate = the_maintenance_rate;
        this.grant = the_grant;
    }
    return Thermic;
}());
exports.Thermic = Thermic;
;
