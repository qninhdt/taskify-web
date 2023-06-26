'use client'

import { BigNumberish, BrowserProvider } from 'ethers'
import { FC, PropsWithChildren, createContext, useState } from 'react'

export interface IWallet {
  balance: BigNumberish
  tkfBalance: BigNumberish
  address: string
  provider: BrowserProvider | null
  setBalance: (balance: BigNumberish) => void
  setTkfBalance: (balance: BigNumberish) => void
  setAddress: (address: string) => void
  setProvider: (provider: BrowserProvider) => void
}

export const WalletContext = createContext<IWallet>({
  balance: 0,
  tkfBalance: 0,
  address: '',
  provider: null,
  setBalance: () => {},
  setTkfBalance: () => {},
  setAddress: () => {},
  setProvider: () => {},
})

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [balance, setBalance] = useState<BigNumberish>(0)
  const [tkfBalance, setTkfBalance] = useState<BigNumberish>(0)
  const [address, setAddress] = useState<string>('')
  const [provider, setProvider] = useState<BrowserProvider | null>(null)

  return (
    <WalletContext.Provider
      value={{
        balance,
        tkfBalance,
        address,
        provider,
        setBalance,
        setTkfBalance,
        setAddress,
        setProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
