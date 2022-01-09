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
            address: '0x7Fd3DA382bcF1C1d66813E3a8d1b12eE56368618',
            amount: utils.parseUnits('37742441', 18)
        },
        preSale: {
            address: '0xfd7EC62C0d20C799b01E3D61EC53A2780893fc10',
            amount: utils.parseUnits('3182143', 18)
        },
        publicSale: {
            address: '0x35D186198D8429f2ED678bE7C6158f974e7c7BBd',
            amount: utils.parseUnits('9490909', 18)
        },
        team: {
            address: '0xB3e2b6a260B967aCa2875d687eb7099Cd04537DE',
            amount: utils.parseUnits('8656000', 18)
        },
        advisor: {
            address: '0x4702f9794d0B8DEDD55a488D8198a1781396BCE6',
            amount: utils.parseUnits('4250000', 18)
        },
    }
}

export default vestingTypes