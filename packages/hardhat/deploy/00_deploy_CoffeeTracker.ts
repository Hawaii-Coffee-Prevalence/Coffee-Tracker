import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "dotenv/config";

const deployCoffeeTracker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const adminAddress = process.env.ADMIN_WALLET || deployer;
  const trustedAddress = process.env.TRUSTED_WALLET || deployer;

  console.log(`Deploying CoffeeTracker... Default Admin (Deployer): ${deployer}`);

  const deployment = await deploy("CoffeeTracker", {
    from: deployer,
    args: [deployer, deployer, deployer, deployer, deployer],
    log: true,
  });

  const [signer] = await hre.ethers.getSigners();
  const coffeeTracker = await hre.ethers.getContractAt("CoffeeTracker", deployment.address, signer);

  const defaultAdminRole = await coffeeTracker.DEFAULT_ADMIN_ROLE();
  const farmerRole = await coffeeTracker.FARMER_ROLE();
  const processorRole = await coffeeTracker.PROCESSOR_ROLE();
  const roasterRole = await coffeeTracker.ROASTER_ROLE();
  const distributorRole = await coffeeTracker.DISTRIBUTOR_ROLE();

  if (adminAddress.toLowerCase() !== deployer.toLowerCase()) {
    console.log(`Granting roles to custom admin: ${adminAddress}`);
    await (await coffeeTracker.grantRole(defaultAdminRole, adminAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(farmerRole, adminAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(processorRole, adminAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(roasterRole, adminAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(distributorRole, adminAddress, { gasLimit: 500000 })).wait();
  }

  if (
    trustedAddress.toLowerCase() !== deployer.toLowerCase() &&
    trustedAddress.toLowerCase() !== adminAddress.toLowerCase()
  ) {
    console.log(`Granting roles to trusted wallet: ${trustedAddress}`);
    await (await coffeeTracker.grantRole(farmerRole, trustedAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(processorRole, trustedAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(roasterRole, trustedAddress, { gasLimit: 500000 })).wait();
    await (await coffeeTracker.grantRole(distributorRole, trustedAddress, { gasLimit: 500000 })).wait();
  }

  console.log(`CoffeeTracker deployed at ${deployment.address}`);
};

export default deployCoffeeTracker;
deployCoffeeTracker.tags = ["CoffeeTracker"];
