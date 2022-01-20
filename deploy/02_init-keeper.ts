import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Keeper, Vesting } from "../typechain"
import vestingTypes, { VestingType } from '../helper/vesting-types'


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts();

  const config = vestingTypes.matic

  /**
   * Sets vesting start time by given vesting type
   * @param vesting VestingType
   */
  async function deployKeeperForVesting(vesting: VestingType) {
    const vestingDeployment = await deployments.get('Vesting')
    const vestingContract = <Vesting>await ethers.getContractAt(
      vestingDeployment.abi,
      vesting.address
    )

    // deploy Keeper
    const keeper = await deploy('Keeper', {
      from: deployer,
      args: [60, vestingContract.address],
      log: true,
    });

    vestingContract.transferOwnership(keeper.address);
  }

  console.log('Initialize Vesting - Private Sale')
  await deployKeeperForVesting(config.privateSale)

  /*console.log('Initialize Vesting - Pre Sale')
  await deployKeeperForVesting(config.preSale)

  console.log('Initialize Vesting - Public Sale')
  await deployKeeperForVesting(config.publicSale)

  console.log('Initialize Vesting - Team')
  await deployKeeperForVesting(config.team)

  console.log('Initialize Vesting - Adviosr & Partner')
  await scheduleVestingStartTime(config.advisor)*/
}

export default func
func.tags = ['InitVesting']