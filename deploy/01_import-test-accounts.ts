import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Vesting } from "../typechain"
import vestingTypes from '../helper/vesting-types'

const fs = require('fs')

const TestAccounts = [
  '0x5F65D8e0836331b840287f6ED74B6a1eF9f5F5cF',
  '0xd9766f1d4E712A1757a2392f9E0aDfc4E1F5C856',
  '0xB8A09e3BE3b18562b9c506731c2657165792AA3a',
];


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre
  const vestingDeployment = await deployments.get('Vesting')

  const privateSaleContract = <Vesting>await ethers.getContractAt(
    vestingDeployment.abi,
    vestingTypes.privateSale.address
  )
  
  const preSaleContract = <Vesting>await ethers.getContractAt(
    vestingDeployment.abi,
    vestingTypes.preSale.address
  )

  const publicSaleContract = <Vesting>await ethers.getContractAt(
    vestingDeployment.abi,
    vestingTypes.publicSale.address
  )

  const teamContract = <Vesting>await ethers.getContractAt(
    vestingDeployment.abi,
    vestingTypes.team.address
  )

  const advisorContract = <Vesting>await ethers.getContractAt(
    vestingDeployment.abi,
    vestingTypes.advisor.address
  )

  async function importParticipants(name: string, contract: Vesting) {
    for(let i = 0; i < TestAccounts.length; i++) {
      let tx = await contract.updateRecipient(
        TestAccounts[i], 
        ethers.utils.parseUnits('100000', 18)
      )

      console.log(tx)
    }
  }

  await importParticipants('private', privateSaleContract)
  await importParticipants('pre', preSaleContract)
  await importParticipants('public', publicSaleContract)
}

export default func
func.tags = ['ImportTestAccounts']