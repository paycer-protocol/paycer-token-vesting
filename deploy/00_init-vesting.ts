import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Vesting } from "../typechain"
import vestingTypes, { VestingType } from '../helper/vesting-types'


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre
  const tokenDeployment = await deployments.get('PaycerToken')

  const tokenContract = await ethers.getContractAt(
      tokenDeployment.abi,
      tokenDeployment.address
  )

  const config = vestingTypes.matic

  /**
   * Pre mints token to vesting contract address
   * 
   * @param vesting VestingType
   */
  async function preMintTokensToContract(vesting: VestingType) {
    const tokenBalance = await tokenContract.balanceOf(vesting.address)
    if (tokenBalance.isZero()) {
        await tokenContract.mint(vesting.address, vesting.amount)
        console.log('Tokens minted', vesting, tokenBalance)
    } else {
        console.log('Mint tokens failed', vesting, tokenBalance)
    }
  }

  /**
   * Sets vesting start time by given vesting type
   * @param vesting VestingType
   */
  async function scheduleVestingStartTime(vesting: VestingType) {
    const vestingDeployment = await deployments.get('Vesting')
    const vestingContract = <Vesting>await ethers.getContractAt(
      vestingDeployment.abi,
      vesting.address
    )
    
    // Mon Jan 10 2022 12:00:00 GMT+0000
    const startTime = '1641816000'
    await vestingContract.setStartTime(startTime)
    console.log('Scheduled vesting time', startTime)
  }

  console.log('Initialize Vesting - Private Sale')
  await preMintTokensToContract(config.privateSale)
  await scheduleVestingStartTime(config.privateSale)

  console.log('Initialize Vesting - Pre Sale')
  await preMintTokensToContract(config.preSale)
  await scheduleVestingStartTime(config.preSale)

  console.log('Initialize Vesting - Public Sale')
  await preMintTokensToContract(config.publicSale)
  await scheduleVestingStartTime(config.publicSale)

  console.log('Initialize Vesting - Team')
  await preMintTokensToContract(config.team)
  await scheduleVestingStartTime(config.team)

  console.log('Initialize Vesting - Adviosr & Partner')
  await preMintTokensToContract(config.advisor)
  await scheduleVestingStartTime(config.advisor)
}

export default func
func.tags = ['InitVesting']