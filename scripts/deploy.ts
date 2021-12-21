import { ethers } from "hardhat";
import { Vesting } from "../typechain";
import { duration } from "../helper/utils";
import { deployProxy } from "../helper/deployer";

async function main() {
  // put actual address here
  const paycer = "0x0000000000000000000000000000000000000001";
  const decimals = 18;
  const totalSupply = ethers.utils.parseUnits("750000000", decimals);
  const rateAccuracy = ethers.utils.parseUnits("1", 10);

  const privateSaleVestingParams = {
      vestingName: "Private Sale",
      amountToBeVested: totalSupply.mul(7).div(100), // 7%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval: 86400,
      lockPeriod: 0,
      vestingPeriod: duration.days(365)
  }
  const presaleVestingParams = {
      vestingName: "Pre-Sale",
      amountToBeVested: totalSupply.mul(4).div(100), // 4%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval: 86400,
      lockPeriod: 0,
      vestingPeriod: duration.days(365)
  }
  const publicSaleVestingParams = {
      vestingName: "Public Sale",
      amountToBeVested: totalSupply.mul(5).div(100), // 5%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(180),
      releaseInterval: 86400,
      lockPeriod: 0,
      vestingPeriod: duration.days(180)
  }
  const teamTokenVestingParams = {
      vestingName: "Team Token",
      amountToBeVested: totalSupply.mul(10).div(100), // 10%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(1000),
      releaseInterval: 86400,
      lockPeriod: 0,
      vestingPeriod: duration.days(1000) // 36 months
  }
  const advisorVestingParmas = {
      vestingName: "Advisor and Partners",
      amountToBeVested: totalSupply.mul(3).div(100), // 3%
      initialUnlock: 0,
      releaseRate: rateAccuracy.div(365),
      releaseInterval: 86400,
      lockPeriod: 0,
      vestingPeriod: duration.days(365)
  }

  const privateSaleVesting = <Vesting>await deployProxy("Vesting", paycer, privateSaleVestingParams);
  const presaleVesting = <Vesting>await deployProxy("Vesting", paycer, presaleVestingParams);
  const publicSaleVesting = <Vesting>await deployProxy("Vesting", paycer, publicSaleVestingParams);
  const teamTokenVesting = <Vesting>await deployProxy("Vesting", paycer, teamTokenVestingParams);
  const advisorVesting = <Vesting>await deployProxy("Vesting", paycer, advisorVestingParmas);

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
