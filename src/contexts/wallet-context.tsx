'use client'

import { taskElectionContract, tokenContract } from '@/services/wallet'
import { BigNumberish, BrowserProvider, ethers } from 'ethers'
import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'

export interface IWallet {
  balance: bigint
  tkfBalance: bigint
  allowance: bigint
  address: string
  provider: BrowserProvider | null
  setBalance: (balance: bigint) => void
  setTkfBalance: (balance: bigint) => void
  setAllowance: (balance: bigint) => void
  setAddress: (address: string) => void
  setProvider: (provider: BrowserProvider) => void
}

export const WalletContext = createContext<IWallet>({
  balance: 0n,
  tkfBalance: 0n,
  allowance: 0n,
  address: '',
  provider: null,
  setBalance: () => {},
  setTkfBalance: () => {},
  setAllowance: () => {},
  setAddress: () => {},
  setProvider: () => {},
})

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [balance, setBalance] = useState<bigint>(0n)
  const [tkfBalance, setTkfBalance] = useState<bigint>(0n)
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [address, setAddress] = useState<string>('')
  const [provider, setProvider] = useState<BrowserProvider | null>(null)

  useEffect(() => {
    if (!provider) return

    const getBalance = async () => {
      const balance = await provider.getBalance(address)
      setBalance(balance)
    }

    const getTkfBalance = async () => {
      const balance = await tokenContract.balanceOf(address)
      setTkfBalance(balance)
    }

    const getAllowance = async () => {
      const allowance = await tokenContract.allowance(
        address,
        taskElectionContract.getAddress(),
      )
      setAllowance(allowance)
    }

    getBalance()
    getTkfBalance()
    getAllowance()

    provider.on('block', getBalance)

    tokenContract.on('Transfer', async (from, to, amount: bigint) => {
      if (from === address || to === address) {
        getTkfBalance()
        getAllowance()
      }
    })

    tokenContract.on('Approval', async (owner, spender, amount: bigint) => {
      if (
        owner == address &&
        spender == (await taskElectionContract.getAddress())
      ) {
        setAllowance(amount)
      }
    })

    return () => {
      provider.off('block', getBalance)
      tokenContract.off('Transfer')
      tokenContract.off('Approval')
    }
  }, [provider, address])

  return (
    <WalletContext.Provider
      value={{
        balance,
        tkfBalance,
        allowance,
        address,
        provider,
        setBalance,
        setTkfBalance,
        setAllowance,
        setAddress,
        setProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
