import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import defaultData from "../data/default-data.json";
import { CoffeeTracker } from "../typechain-types";

const TOTAL = 100;
const PROCESSED_COUNT = 70;
const ROASTED_COUNT = 50;
const DISTRIBUTED_COUNT = 30;
const VERIFIED_COUNT = 40;

function pickRandom(pool: number[], num: number): number[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(num, shuffled.length));
}

const seedCoffeeTracker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const [deployer, farmer, processor, roaster, distributor] = await ethers.getSigners();

  const coffeeTracker = await ethers.getContract<CoffeeTracker>("CoffeeTracker", deployer);

  console.log("Granting roles...");
  await coffeeTracker.grantRole(await coffeeTracker.FARMER_ROLE(), farmer.address, { gasLimit: 500000 });
  await coffeeTracker.grantRole(await coffeeTracker.PROCESSOR_ROLE(), processor.address, { gasLimit: 500000 });
  await coffeeTracker.grantRole(await coffeeTracker.ROASTER_ROLE(), roaster.address, { gasLimit: 500000 });
  await coffeeTracker.grantRole(await coffeeTracker.DISTRIBUTOR_ROLE(), distributor.address, { gasLimit: 500000 });

  const allIndices = Array.from({ length: TOTAL }, (_, i) => i);
  const processedSet = new Set(pickRandom(allIndices, PROCESSED_COUNT));
  const roastedSet = new Set(pickRandom([...processedSet], ROASTED_COUNT));
  const distributedSet = new Set(pickRandom([...roastedSet], DISTRIBUTED_COUNT));
  const verifiedSet = new Set(pickRandom(allIndices, VERIFIED_COUNT));

  console.log("Seeding batches...");

  let batchId = 1;

  for (let i = 0; i < defaultData.length; i++) {
    const data = defaultData[i];
    console.log(`  [${String(i + 1).padStart(3, " ")}/${defaultData.length}] ${data.batchNumber} — ${data.farmName}`);

    await coffeeTracker
      .connect(farmer)
      .harvestBatch(
        data.batchNumber,
        data.farmName,
        data.region,
        data.variety,
        data.elevation,
        data.harvestWeight,
        data.harvestDate,
        { gasLimit: 500000 },
      );

    if (processedSet.has(i)) {
      await coffeeTracker
        .connect(processor)
        .processBatch(
          batchId,
          data.processingMethod,
          data.processingBeforeWeight,
          data.processingAfterWeight,
          data.moistureContent,
          data.scaScore,
          data.humidity,
          data.dryTemperature,
          { gasLimit: 500000 },
        );
    }

    if (roastedSet.has(i)) {
      await coffeeTracker
        .connect(roaster)
        .roastBatch(
          batchId,
          data.roastingMethod,
          data.roastingBeforeWeight,
          data.roastingAfterWeight,
          data.roastLevel,
          data.cuppingNotes,
          data.transportTime,
          { gasLimit: 500000 },
        );
    }

    if (distributedSet.has(i)) {
      await coffeeTracker.connect(distributor).distributeBatch(batchId, { gasLimit: 500000 });
    }

    if (verifiedSet.has(i)) {
      await coffeeTracker.connect(deployer).verifyBatch(batchId, { gasLimit: 500000 });
    }

    batchId++;
  }

  console.log("Seeding complete.");
};

export default seedCoffeeTracker;
seedCoffeeTracker.tags = ["SeedCoffeeTracker"];
seedCoffeeTracker.dependencies = ["CoffeeTracker"];
