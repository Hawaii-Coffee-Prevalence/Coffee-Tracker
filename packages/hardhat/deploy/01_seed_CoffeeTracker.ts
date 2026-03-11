import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import defaultData from "../data/default-data.json";
import { CoffeeTracker } from "../typechain-types";

const seedCoffeeTracker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const [deployer, farmer, processor, roaster, distributor] = await ethers.getSigners();

  const coffeeTracker = await ethers.getContract<CoffeeTracker>("CoffeeTracker", deployer);

  console.log("Granting roles...");
  await coffeeTracker.grantRole(await coffeeTracker.FARMER_ROLE(), farmer.address, { gasLimit: 500000 });
  await coffeeTracker.grantRole(await coffeeTracker.PROCESSOR_ROLE(), processor.address, { gasLimit: 500000 });
  await coffeeTracker.grantRole(await coffeeTracker.ROASTER_ROLE(), roaster.address, { gasLimit: 500000 });
  await coffeeTracker.grantRole(await coffeeTracker.DISTRIBUTOR_ROLE(), distributor.address, { gasLimit: 500000 });

  let batchId = 1;
  console.log("Seeding default data...");

  for (let i = 0; i < defaultData.length; i++) {
    const data = defaultData[i];
    console.log(`   [${i + 1}/${defaultData.length}]`);

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

    if (i < 15) {
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

    if (i < 10) {
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

    if (i < 5) {
      await coffeeTracker.connect(distributor).distributeBatch(batchId, { gasLimit: 500000 });
    }

    if (i % 2 === 0) {
      await coffeeTracker.connect(deployer).verifyBatch(batchId, { gasLimit: 500000 });
    }

    batchId++;
  }

  console.log("Seeding completed.");
};

export default seedCoffeeTracker;
seedCoffeeTracker.tags = ["SeedCoffeeTracker"];
seedCoffeeTracker.dependencies = ["CoffeeTracker"];
