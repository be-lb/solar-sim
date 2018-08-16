
class Thermic {
    householdPerson: number;
    literByPersonByDay: number;
    hotWaterProducer: string;
    cost: number;
    annualMaintenanceCost: number;
    maintenanceRate: number;
    grant: number;
    constructor(the_household_person: number, the_liter_by_person_by_day:number, the_hot_water_producer: string, the_cost: number, the_annual_maintenance_cost: number, the_maintenance_rate: number, the_grant: number) {
        this.householdPerson = the_household_person;
        this.literByPersonByDay = the_liter_by_person_by_day;
        this.hotWaterProducer = the_hot_water_producer;
        this.cost = the_cost;
        this.annualMaintenanceCost = the_annual_maintenance_cost;
        this.maintenanceRate = the_maintenance_rate;
        this.grant = the_grant;
    }
};

export { Thermic };
