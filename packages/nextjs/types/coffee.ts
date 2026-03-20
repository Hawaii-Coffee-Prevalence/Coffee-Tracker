export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type CoffeeBatch = {
  batchId: bigint;
  batchNumber: string;
  verified: boolean;
  mintTimestamp: bigint;

  // HarvestData
  region: number;
  variety: number;
  elevation: number;
  harvestDate: bigint;
  harvestWeight: bigint;
  farmer: string;
  farmName: string;
  harvestLocation: Coordinates;

  // ProcessingData
  processingMethod: number;
  moistureContent: number;
  scaScore: number;
  humidity: number;
  dryTemperature: number;
  processingDate: bigint;
  processingBeforeWeight: bigint;
  processingAfterWeight: bigint;
  processor: string;
  processingLocation: Coordinates;

  // RoastingData
  roastingMethod: number;
  roastLevel: number;
  transportTime: number;
  roastingDate: bigint;
  roastingBeforeWeight: bigint;
  roastingAfterWeight: bigint;
  roaster: string;
  cuppingNotes: string;
  roastingLocation: Coordinates;

  // DistributionData
  distributionDate: bigint;
  bagCount: number;
  distributionWeight: bigint;
  distributor: string;
  destination: string;
  distributionLocation: Coordinates;
};

export type PipelineData = {
  harvested: number;
  processed: number;
  roasted: number;
  distributed: number;
};

export type RegionCounter = {
  name: string;
  count: number;
};

export type RegionData = RegionCounter[];

export type ScaBucket = {
  score: string;
  count: number;
};

export type CoffeeTrackerStats = {
  totalBatches: number;
  batchesThisWeek: number;
  batchesToday: number;
  verifiedCount: number;
  verifiedPercent: number;
  averageScaScore: string | number;
  scaLabel: string;
  highestSca: number;
  lowestSca: number;
  totalWeightDisplay: string;
  islandCount: number;

  pipeline: PipelineData;
  regionCounters: RegionCounter[];
  scaBuckets: ScaBucket[];

  recentBatches: CoffeeBatch[];
  allBatches: CoffeeBatch[];

  averageElevation: number;
  averageYield: number;
  varietyCount: number;
  averageMoisture: number;
  processMethodCount: number;
  roastMethodCount: number;
  averageRoastWeightLoss: number;
  averageTransportTime: number;
};

export type Stage = "Harvested" | "Processed" | "Roasted" | "Distributed";

export type UserRole = "None" | "Farmer" | "Processor" | "Roaster" | "Distributor" | "Verifier" | "User";

export type StageFilter = "All" | Stage | "Verified";
export type SortOrder = "newest" | "oldest";
export type BatchFilterState = {
  stage: StageFilter;
  region: string;
  sort: SortOrder;
};

export type BatchTxHashes = {
  harvested?: `0x${string}`;
  processed?: `0x${string}`;
  roasted?: `0x${string}`;
  distributed?: `0x${string}`;
  verified?: `0x${string}`;
};
