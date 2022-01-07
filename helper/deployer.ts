import hre, { ethers, upgrades } from "hardhat";

declare type ContractName = "Vesting" | "CustomToken";

async function verifyContract(
  address: string,
  ...constructorArguments: any[]
): Promise<void> {
  await hre.run("verify:verify", {
    address,
    constructorArguments,
  });
}

async function deployContract(
  name: ContractName,
  ...constructorArgs: any[]
): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...constructorArgs);
  await contract.deployed();
  return contract;
}

async function deployProxy(
  name: ContractName,
  ...constructorArgs: any[]
): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  const contract = await upgrades.deployProxy(factory, constructorArgs);
  await contract.deployed();
  return contract;
}


async function deployProxyFromNamedAccounts(
  deploymentName: string,
  contractName: ContractName,
  ...constructorArgs: any[]
): Promise<any> {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts();

  const contract = await deploy(deploymentName, {
    contract: contractName,
    from: deployer,
    args: constructorArgs,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy'
    }
  })

  return contract;
}

export { verifyContract, deployContract, deployProxy, deployProxyFromNamedAccounts };