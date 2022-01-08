import { BigNumber, utils } from 'ethers'

export interface VestingType {
    address: string
    amount: BigNumber
}

export interface VestingTypes {
    [symbol: string]: VestingType
}

const vestingTypes: VestingTypes = {
    privateSale: {
        address: '0xc9f5Da44fd99D6aAf46582646cFf6648671578db',
        amount: utils.parseUnits('34661123', 18)
    },
    preSale: {
        address: '0x8db89a3483d013c152cb07bb50b7F9D2eE1a2D75',
        amount: utils.parseUnits('3167142', 18)
    },
    publicSale: {
        address: '0x00a1b8721DbCdcFE984E09F5A6EA2bF67d8dC5BD',
        amount: utils.parseUnits('17109091', 18)
    },
    team: {
        address: '0xF64Ed26ac24eE4e5947af2F6cF2Bb680DFe9EB3F',
        amount: utils.parseUnits('75000000', 18)
    },
    advisor: {
        address: '0x59b7B481E5d6C5e33c88CB37c5003043E7bBeDBd',
        amount: utils.parseUnits('25375000', 18)
    },
}

export default vestingTypes