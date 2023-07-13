'use client'

import { taskElectionContract, tokenContract } from '@/services/wallet'
import { ethers } from 'ethers'
import { useState } from 'react'

export default function Dashboard() {
  const [buying, setBuying] = useState<boolean>(false)
  const [selling, setSelling] = useState<boolean>(false)
  const [approving, setApproving] = useState<boolean>(false)

  const buyToken = async () => {
    if (!buying) {
      setBuying(true)
      try {
        await tokenContract.buyTokens({ value: ethers.parseEther('0.001') })
      } finally {
        setBuying(false)
      }
    }
  }

  const sellToken = async () => {
    if (!selling) {
      setSelling(true)
      try {
        await tokenContract.sellTokens(ethers.parseEther('1'))
      } finally {
        setSelling(false)
      }
    }
  }

  const approveToken = async () => {
    if (!approving) {
      setApproving(true)
      try {
        await tokenContract.approve(
          taskElectionContract.getAddress(),
          ethers.parseEther('1'),
        )
      } finally {
        setApproving(false)
      }
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="rounded-md p-6 shadow">
        <h1 className="mb-3 text-center text-xl font-bold text-gray-900">
          Buy/sell token
        </h1>
        <div className="flex flex-row items-center justify-center p-2">
          <button
            onClick={buyToken}
            className={`btn-outline btn mr-2 ${buying && 'opacity-80'}`}
          >
            {buying && <span className="loading loading-spinner"></span>}
            Buy 1 TKF
          </button>
          <button
            onClick={sellToken}
            className={`btn-outline btn mr-2 ${selling && 'opacity-80'}`}
          >
            {selling && <span className="loading loading-spinner"></span>}
            Sell 1 TKF
          </button>
          <button
            onClick={approveToken}
            className={`btn-outline btn ${approving && 'opacity-80'}`}
          >
            {approving && <span className="loading loading-spinner"></span>}
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}
