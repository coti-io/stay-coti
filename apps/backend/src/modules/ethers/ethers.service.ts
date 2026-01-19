import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { ethers } from 'ethers'

enum Network {
    testnet = 'testnet',
}

@Service()
export class EthersService {
    constructor(private config: AppConfig) {}

    chainInfo(network: Network) {
        const chainInfo = {
            testnet: {
                name: 'COTI Testnet',
                rpc: 'https://testnet.coti.io/rpc',
                explorer: 'https://testnet.cotiscan.io',
                chainId: 7082400,
            },
        }
        return chainInfo[network]
    }

    provider() {
        const network = this.config.network
        const chainInfo = this.chainInfo(network as Network)
        const provider = new ethers.JsonRpcProvider(chainInfo.rpc)
        return provider
    }
}
