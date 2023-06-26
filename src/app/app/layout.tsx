'use client'

import NavBar from '@/components/NavBar'
import { WalletContextProvider } from '@/contexts/wallet-context'

export default function Layout({ children }: any) {
  return (
    <WalletContextProvider>
      <div className="flex h-[100vh] w-[100vw] flex-row ">
        <div className="flex flex-row items-center pl-2">
          <NavBar />
        </div>
        <div className="flex-1 ">{children}</div>
      </div>
    </WalletContextProvider>
  )
}
