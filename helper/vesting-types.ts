import { BigNumber, utils } from 'ethers'

export interface VestingType {
    address: string
    amount: BigNumber
}

export interface VestingTypes {
    [symbol: string]: {
        [network: string]: VestingType
    }
}

const vestingTypes: VestingTypes = {
    mumbai: {
        privateSale: {
            address: '0x111d13fBc49A5aB91a721be88008F3090ab727E0',
            amount: utils.parseUnits('37742441', 18)
        },
        preSale: {
            address: '0x909fEb2857814565F257314F295a01Fe7e3F3939',
            amount: utils.parseUnits('3182143', 18)
        },
        publicSale: {
            address: '0x8A8555E4a143Dc2f5DfA31D8334585d14C6c326B',
            amount: utils.parseUnits('9490909', 18)
        },
        team: {
            address: '0x45816da4dff59560F229C468ec16eF6A5ea4c58A',
            amount: utils.parseUnits('8656000', 18)
        },
        advisor: {
            address: '0x86bd32443eb7675D00295ff27287762D0e3D243D',
            amount: utils.parseUnits('4250000', 18)
        },
    },
    matic: {
        privateSale: {
            address: 'todo',
            amount: utils.parseUnits('37742441', 18)
        },
        preSale: {
            address: 'todo',
            amount: utils.parseUnits('3182143', 18)
        },
        publicSale: {
            address: 'todo',
            amount: utils.parseUnits('9490909', 18)
        },
        team: {
            address: 'todo',
            amount: utils.parseUnits('8656000', 18)
        },
        advisor: {
            address: 'todo',
            amount: utils.parseUnits('4250000', 18)
        },
    }
}

export default vestingTypes