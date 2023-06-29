'use client'

import { WalletContext } from '@/contexts/wallet-context'
import { connectWallet, getBalance } from '@/services/wallet'
import { useContext } from 'react'

export default function ConnectWalletButton() {
  const { provider, setAddress, setProvider, setBalance, setTkfBalance } =
    useContext(WalletContext)

  const _connectWallet = async () => {
    const { provider, address } = await connectWallet()
    setProvider(provider)
    setAddress(address)
  }

  return (
    <button
      className="w-52 rounded-xl border-[1px] border-orange-500 px-2 py-2 text-sm tracking-wider text-orange-500 transition-all hover:bg-gray-50 "
      onClick={_connectWallet}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
        alt="MetaMask"
        className="mr-1 inline h-5"
      />
      Connect to MetaMask
    </button>
  )
}
