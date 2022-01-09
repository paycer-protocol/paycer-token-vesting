import { ethers } from "hardhat";
import { Vesting } from "../typechain";
import { duration } from "../helper/utils";
import { deployProxy } from "../helper/deployer";
import vestingTypes from '../helper/vesting-types'

// see https://paycer.gitbook.io/paycer/paycer-token/smart-contracts
const TokenAddress: any = {
  matic: '0xa6083abe845fbB8649d98B8586cBF50b7f233612',
  mumbai: '0xD8eA7F7D3eebB5193AE76E3280b8650FD1468663',
}

async function main() {
  const paycerTokenAddress = TokenAddress.matic;
  const config = vestingTypes.matic

  const rateAccuracy = ethers.utils.parseUnits('1', 10);
  const dailyReleaseInterval = 24 * 60 * 60; // 1 day;
  const dailyLockPeriod = 24 * 60 * 60; // 1 day;
  const monthlyReleaseInterval = 30 * 24 * 60 * 60; // 1 month;
  const monthlyLockPeriod = 30 * 24 * 60 * 60; // 1 month;

  const privateSaleVestingParams = {
      vestingName: 'Private Sale',
      amountToBeVested: config.privateSale.amount,
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval: dailyReleaseInterval,
      lockPeriod: dailyLockPeriod,
      vestingPeriod: duration.days(365) // 12 months
  }

  const presaleVestingParams = {
      vestingName: 'Pre-Sale',
      amountToBeVested: config.preSale.amount,
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval: dailyReleaseInterval,
      lockPeriod: dailyLockPeriod,
      vestingPeriod: duration.days(365) // 12 months
  }

  const publicSaleVestingParams = {
      vestingName: 'Public Sale',
      amountToBeVested: config.publicSale.amount,
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(6),
      releaseInterval: monthlyReleaseInterval,
      lockPeriod: monthlyLockPeriod,
      vestingPeriod: duration.days(180) // 6 months
  }

  const teamTokenVestingParams = {
      vestingName: 'Team Token',
      amountToBeVested: config.team.amount,
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1080),
      releaseInterval: dailyReleaseInterval,
      lockPeriod: dailyLockPeriod,
      vestingPeriod: duration.days(1080) // 36 months
  }

  const advisorVestingParmas = {
      vestingName: 'Advisor and Partners',
      amountToBeVested: config.advisor.amount,
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1080),
      releaseInterval: dailyReleaseInterval,
      lockPeriod: dailyLockPeriod,
      vestingPeriod: duration.days(1080) // 36 months
  }

  const privateSaleVesting = <Vesting>await deployProxy("Vesting", paycerTokenAddress, privateSaleVestingParams);
  const presaleVesting = <Vesting>await deployProxy("Vesting", paycerTokenAddress, presaleVestingParams);
  const publicSaleVesting = <Vesting>await deployProxy("Vesting", paycerTokenAddress, publicSaleVestingParams);
  const teamTokenVesting = <Vesting>await deployProxy("Vesting", paycerTokenAddress, teamTokenVestingParams);
  const advisorVesting = <Vesting>await deployProxy("Vesting", paycerTokenAddress, advisorVestingParmas);

  console.log("Private Sale:", privateSaleVesting.address);
  console.log("Pre-Sale:", presaleVesting.address);
  console.log("Public Sale:", publicSaleVesting.address);
  console.log("Team Token:", teamTokenVesting.address);
  console.log("Adviosr & Partners:", advisorVesting.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
