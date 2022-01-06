import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers } from 'hardhat';
import { Vesting } from '../typechain';
import { duration } from '../helper/utils';
import { deployProxyFromNamedAccounts } from '../helper/deployer';

// see https://paycer.gitbook.io/paycer/paycer-token/smart-contracts
const TokenAddress: any = {
    137: '0xa6083abe845fbB8649d98B8586cBF50b7f233612', // matic mainnet
    80001: '0xD8eA7F7D3eebB5193AE76E3280b8650FD1468663', // mumbai
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getChainId } = hre
  const chainId = await getChainId()
  const paycerTokenAddress = TokenAddress[chainId]

  if (!paycerTokenAddress) {
    throw Error('No address found!');
  }

  const decimals = 18;
  const rateAccuracy = ethers.utils.parseUnits('1', 10);
  const releaseInterval = 60 * 24 * 24; // 24 hours;
  const lockPeriod = 60 * 24 * 24; // 24 hours;

  const privateSaleVestingParams = {
      vestingName: 'Private Sale',
      amountToBeVested: ethers.utils.parseUnits('34661123', decimals),
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(365)
  }

  const presaleVestingParams = {
      vestingName: 'Pre-Sale',
      amountToBeVested: ethers.utils.parseUnits('3167142', decimals),
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(365) // 12 months
  }

  const publicSaleVestingParams = {
      vestingName: 'Public Sale',
      amountToBeVested: ethers.utils.parseUnits('17109091', decimals),
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(180),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(180) // 6 months
  }

  const teamTokenVestingParams = {
      vestingName: 'Team Token',
      amountToBeVested: ethers.utils.parseUnits('75000000', decimals),
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1080),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(1080) // 36 months
  }

  const advisorVestingParmas = {
      vestingName: 'Advisor and Partners',
      amountToBeVested: ethers.utils.parseUnits('25375000', decimals),
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1080),
      releaseInterval,
      lockPeriod,
      vestingPeriod: duration.days(1080) // 36 months
  }

  const privateSaleVesting = <Vesting>await deployProxyFromNamedAccounts(
      'PrivateSaleVesting', 
      'Vesting', 
      [paycerTokenAddress, privateSaleVestingParams], 
  );

  const preSaleVesting = <Vesting>await deployProxyFromNamedAccounts(
      'PreSaleVesting', 
      'Vesting',
      [paycerTokenAddress, presaleVestingParams]
  );

  const publicSaleVesting = <Vesting>await deployProxyFromNamedAccounts(
      'PublicSaleVesting', 
      'Vesting',
      [paycerTokenAddress, publicSaleVestingParams]
  );

  const teamVesting = <Vesting>await deployProxyFromNamedAccounts(
      'TeamVesting', 
      'Vesting',
      [paycerTokenAddress, teamTokenVestingParams]
  );
  
  const advisorVesting = <Vesting>await deployProxyFromNamedAccounts(
      'AdvisorVesting', 
      'Vesting', 
      [paycerTokenAddress, advisorVestingParmas]
  );

  console.log('Private Sale:', privateSaleVesting.address);
  console.log('Pre-Sale:', preSaleVesting.address);
  console.log('Public Sale:', publicSaleVesting.address);
  console.log('Team Token:', teamVesting.address);
  console.log('Adviosr & Partners:', advisorVesting.address);
}

export default func
func.tags = ['Vesting']
