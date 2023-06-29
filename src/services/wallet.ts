import { ethers } from 'ethers'

import TKFTokenContractABI from '@/assets/contracts/TKFToken.json'
import TaskElectionContractABI from '@/assets/contracts/TaskElection.json'

export let tokenContract: ethers.Contract
export let taskElectionContract: ethers.Contract

export function isWeb3Browser() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

export async function getBalance(
  provider: ethers.BrowserProvider,
  address: string,
) {
  return await provider.getBalance(address)
}

export async function connectWallet() {
  if (!isWeb3Browser()) {
    throw Error('Not install Metamask! Please install wallet')
  }

  if (window.ethereum.networkVersion != '11155111') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toBeHex('11155111') }],
      })
    } catch (switchError: any) {
      if (switchError.code == 4001) {
        throw Error('Please switch to Sepolia network')
      }

      throw Error(switchError)
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum)

  await provider.send('eth_requestAccounts', [])

  const accounts = await provider.listAccounts()
  const address = await accounts[0].getAddress()

  await loadContracts(provider)

  return { provider, address }
}

export async function loadContracts(provider: ethers.BrowserProvider) {
  const signer = await provider.getSigner()

  tokenContract = new ethers.Contract(
    '0xD095E27559D0862229d9A4558882cD3038005748',
    TKFTokenContractABI,
    signer,
  )

  taskElectionContract = new ethers.Contract(
    '0x6F320bC2601c3276B6Ef1592FbfA358f88d6ac6E',
    TaskElectionContractABI,
    signer,
  )
}
