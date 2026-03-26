import { CoffeeBatch } from "~~/types/batch";

export type { CoffeeBatch };

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
