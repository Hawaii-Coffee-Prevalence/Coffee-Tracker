import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export interface CoffeeBatch {
  batchId: bigint;
  batchNumber: string;
  verified: boolean;
  mintTimestamp: bigint;
  farmer: string;
  farmName: string;
  region: number;
  variety: number;
  elevation: bigint;
  harvestWeight: bigint;
  harvestDate: bigint;
  processor: string;
  processingMethod: number;
  processingBeforeWeight: bigint;
  processingAfterWeight: bigint;
  moistureContent: number;
  scaScore: number;
  humidity: number;
  dryTemperature: bigint;
  roaster: string;
  roastingMethod: number;
  roastingBeforeWeight: bigint;
  roastingAfterWeight: bigint;
  roastLevel: number;
  cuppingNotes: string;
  transportTime: bigint;
}

export function useUserBatches() {
  const { address } = useAccount();

  const { data, isLoading, error } = useScaffoldReadContract({
    contractName: "CoffeeTracker",
    functionName: "getUserBatches",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Filter out duplicate batches based on batchId
  const uniqueBatches = data?.[1]
    ? (data[1] as any[]).filter((batch, index, self) => index === self.findIndex(b => b.batchId === batch.batchId))
    : undefined;

  return {
    batches: uniqueBatches as CoffeeBatch[] | undefined,
    userRole: data?.[0] as string | undefined,
    isLoading,
    error,
  };
}
