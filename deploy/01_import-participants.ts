import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { Vesting } from "../typechain"
import vestingTypes, { VestingType } from '../helper/vesting-types'
import privteSaleData from '../data/token-sale/vesting-private.json'
import preSaleData from '../data/token-sale/vesting-pre.json'
import publicSaleData from '../data/token-sale/vesting-public.json'


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


  // Participants - Private sale 
  for(let i = 0; i < privteSaleData.length; i++) {
    let tx = await privateSaleContract.updateRecipient(
      privteSaleData[i].walletAddress, 
      ethers.utils.parseUnits(String(privteSaleData[i].amountPCR), 18)
    )
  
    tx.wait()
    console.log(tx)
  }

  // Participants - Pre sale 
  for(let i = 0; i < preSaleData.length; i++) {
    let tx = await preSaleContract.updateRecipient(
      preSaleData[i].walletAddress, 
      ethers.utils.parseUnits(String(preSaleData[i].amountPCR), 18)
    )
  
    tx.wait()
    console.log(tx)
  }

  // Participants - Public sale 
  for(let i = 0; i < publicSaleData.length; i++) {
    let tx = await publicSaleContract.updateRecipient(
      publicSaleData[i].walletAddress, 
      ethers.utils.parseUnits(String(publicSaleData[i].amountPCR), 18)
    )
  
    tx.wait()
    console.log(tx)
  }
}

export default func
func.tags = ['ImportParticipants']