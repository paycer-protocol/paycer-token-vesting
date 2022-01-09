import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Vesting } from "../typechain"
import vestingTypes from '../helper/vesting-types'
import privteSaleData from '../data/token-sale/vesting-private.json'
import preSaleData from '../data/token-sale/vesting-pre.json'
import publicSaleData from '../data/token-sale/vesting-public.json'
import teamData from '../data/token-sale/vesting-team.json'
import advisorData from '../data/token-sale/vesting-advisor.json'

const fs = require('fs')


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

  async function importParticipants(name: string, data: any, contract: Vesting) {
    const failedTransactions = []
    for(let i = 0; i < data.length; i++) {
      try {
        let tx = await contract.updateRecipient(
          data[i].walletAddress.split('@')[0], 
          ethers.utils.parseUnits(String(data[i].amountPCR), 18)
        )
  
        console.log(tx)
      } catch (e) {
        failedTransactions.push(data[i])
        console.log('#############', e)
      }
    }
  
    fs.writeFileSync(
      'data/token-sale/failed-vesting-' + name + '.json',  
      JSON.stringify(failedTransactions)
    );
  }

  await importParticipants('private', privteSaleData, privateSaleContract)
  await importParticipants('pre', preSaleData, preSaleContract)
  await importParticipants('public', publicSaleData, publicSaleContract)
  await importParticipants('team', teamData, teamContract)
  await importParticipants('advisor', advisorData, advisorContract)
}

export default func
func.tags = ['ImportParticipants']