import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Vesting } from "../typechain"
import vestingTypes, { VestingType } from '../helper/vesting-types'


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  const tokenDeployment = await deployments.get('PaycerToken')

  const tokenContract = await ethers.getContractAt(
      tokenDeployment.abi,
      tokenDeployment.address
  )

  tokenContract.attach(deployer)

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

    vestingContract.attach(deployer)

    // Sat Jan 08 2022 01:00:00 GMT+0000
    const startTime = '1641603600'
    await vestingContract.setStartTime('1641603600')

    console.log('Scheduled vesting time', new Date(startTime))
  }


  console.log('Initialize Vesting - Private Sale')
  await preMintTokensToContract(vestingTypes.privateSale)
  await scheduleVestingStartTime(vestingTypes.privateSale)

  console.log('Initialize Vesting - Pre Sale')
  await preMintTokensToContract(vestingTypes.preSale)
  await scheduleVestingStartTime(vestingTypes.preSale)

  console.log('Initialize Vesting - Public Sale')
  await preMintTokensToContract(vestingTypes.publicSale)
  await scheduleVestingStartTime(vestingTypes.publicSale)

  console.log('Initialize Vesting - Team')
  await preMintTokensToContract(vestingTypes.team)
  await scheduleVestingStartTime(vestingTypes.team)

  console.log('Initialize Vesting - Adviosr & Partner')
  await preMintTokensToContract(vestingTypes.advisor)
  await scheduleVestingStartTime(vestingTypes.advisor)
}

export default func
func.tags = ['InitVesting']