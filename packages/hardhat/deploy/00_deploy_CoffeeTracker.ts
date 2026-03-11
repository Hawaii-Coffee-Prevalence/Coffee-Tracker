import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "dotenv/config";

const deployCoffeeTracker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const adminAddress = hre.network.name === "localhost" ? deployer : process.env.ADMIN_WALLET || deployer;
  const trustedAddress = hre.network.name === "localhost" ? deployer : process.env.TRUSTED_WALLET || deployer;

  console.log(`Deploying CoffeeTracker... Admin: ${adminAddress}, Trusted: ${trustedAddress}`);

  const deployment = await deploy("CoffeeTracker", {
    from: deployer,
    args: [adminAddress, trustedAddress, trustedAddress, trustedAddress, trustedAddress],
    log: true,
  });

  console.log(`CoffeeTracker deployed at ${deployment.address}`);
};

export default deployCoffeeTracker;
deployCoffeeTracker.tags = ["CoffeeTracker"];
