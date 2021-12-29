import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { Vesting } from '../typechain';
import { duration } from '../helper/utils';
import { deployProxy } from '../helper/deployer';


const func: DeployFunction = async function () {
  // see https://paycer.gitbook.io/paycer/paycer-token/smart-contracts
  const paycerTokenAddress = '0xa9f31589E0a8c0b12068329736ed6385A8F77b62';

  const decimals = 18;
  const totalSupply = ethers.utils.parseUnits('750000000', decimals);
  const rateAccuracy = ethers.utils.parseUnits('1', 10);

  const releaseInterval = 60 * 24 * 24; // 24 hours;
  const lockPeriod = 60 * 24 * 24; // 24 hours;

  const privateSaleVestingParams = {
      vestingName: 'Private Sale',
      amountToBeVested: totalSupply.mul(7).div(100), // 7%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(365)
  }

  const presaleVestingParams = {
      vestingName: 'Pre-Sale',
      amountToBeVested: totalSupply.mul(4).div(100), // 4%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(365) // 12 months
  }

  const publicSaleVestingParams = {
      vestingName: 'Public Sale',
      amountToBeVested: totalSupply.mul(5).div(100), // 5%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(180),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(180) // 6 months
  }

  const teamTokenVestingParams = {
      vestingName: 'Team Token',
      amountToBeVested: totalSupply.mul(10).div(100), // 10%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1080),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(1080) // 36 months
  }

  const advisorVestingParmas = {
      vestingName: 'Advisor and Partners',
      amountToBeVested: totalSupply.mul(3).div(100), // 3%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1080),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(1080) // 36 months
  }

  const privateSaleVesting = <Vesting>await deployProxy('Vesting', paycerTokenAddress, privateSaleVestingParams);
  const preSaleVesting = <Vesting>await deployProxy('Vesting', paycerTokenAddress, presaleVestingParams);
  const publicSaleVesting = <Vesting>await deployProxy('Vesting', paycerTokenAddress, publicSaleVestingParams);
  const teamVesting = <Vesting>await deployProxy('Vesting', paycerTokenAddress, teamTokenVestingParams);
  const advisorVesting = <Vesting>await deployProxy('Vesting', paycerTokenAddress, advisorVestingParmas);

  console.log('Private Sale:', privateSaleVesting.address);
  console.log('Pre-Sale:', preSaleVesting.address);
  console.log('Public Sale:', publicSaleVesting.address);
  console.log('Team Token:', teamVesting.address);
  console.log('Adviosr & Partners:', advisorVesting.address);
}

export default func
func.tags = ['Vesting']