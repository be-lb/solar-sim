import { inputs, outputs, thermicOutputs } from './io';
declare const solarSim: (inputs: inputs) => outputs;
declare const thermicSolarSim: (inputs: inputs) => thermicOutputs;
export { solarSim, thermicSolarSim };
