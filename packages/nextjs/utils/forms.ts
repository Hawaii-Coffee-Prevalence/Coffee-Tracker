import { DistributeFormState, HarvestFormState, ProcessFormState, RoastFormState } from "~~/types/forms";

export const HARVEST_INITIAL_FORM: HarvestFormState = {
  batchNumber: "",
  farmName: "",
  region: "0",
  variety: "0",
  elevation: "",
  harvestDate: "",
  harvestWeight: "",
  latitude: "",
  longitude: "",
};

export const PROCESS_INITIAL_FORM: ProcessFormState = {
  batchNumber: "",
  processingMethod: "0",
  moistureContent: "",
  scaScore: "",
  humidity: "",
  dryTemperature: "",
  processingDate: "",
  beforeWeight: "",
  afterWeight: "",
  latitude: "",
  longitude: "",
};

export const ROAST_INITIAL_FORM: RoastFormState = {
  batchNumber: "",
  roastingMethod: "0",
  roastLevel: "0",
  cuppingNotes: "",
  roastingDate: "",
  transportTime: "",
  beforeWeight: "",
  afterWeight: "",
  latitude: "",
  longitude: "",
};

export const DISTRIBUTE_INITIAL_FORM: DistributeFormState = {
  batchNumber: "",
  distributionDate: "",
  bagCount: "",
  distributionWeight: "",
  destination: "",
  latitude: "",
  longitude: "",
};
