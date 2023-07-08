'use client'

import { WalletContext } from '@/contexts/wallet-context'
import { taskElectionContract } from '@/services/wallet'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TaskPage({ params }: any) {
  const [election, setElection] = useState<any>(null)
  const [stake, setStake] = useState<any>('')
  const { address, allowance } = useContext<any>(WalletContext)
  const router = useRouter()

  const castVote = async (candidateId: number) => {
    if (election.author == address) return

    if (election.myVote != null) {
      toast.error('You have already voted')
      return
    }

    if (stake === '') {
      toast.error('Please enter a stake')
      return
    }

    if (allowance < ethers.parseEther(stake)) {
      toast.error('Not enough allowance to stake')
      return
    }

    const _stake = ethers.parseEther(stake)

    if (_stake > allowance) {
      toast.error('You do not have enough allowance')
      return
    }

    await taskElectionContract.castVote(params.task_id, candidateId, _stake)

    toast.success('Vote casted')

    router.push('/app/tasks/')
  }

  const finishElection = async () => {
    await taskElectionContract.finalizeElection(params.task_id)

    toast.success('Election finalized')
    router.push('/app/tasks/')
  }

  const cancelElection = async () => {
    await taskElectionContract.cancelElection(params.task_id)

    toast.success('Election canceled')
    router.push('/app/tasks/')
  }

  useEffect(() => {
    const getElection = async () => {
      const election = await taskElectionContract.elections(params.task_id)
      const candidates = []

      for (let i = 0; i < election[7]; i++) {
        const candidate = await taskElectionContract.candidates(
          params.task_id,
          i,
        )
        candidates.push({
          title: candidate[0],
        })
      }

      const voted = await taskElectionContract.voted(params.task_id, address)
      let myVote = null

      if (voted) {
        myVote = await taskElectionContract.votes(params.task_id, address)
        myVote = {
          stake: myVote[0],
          candidateId: Number(myVote[1]),
        }
      }

      setElection({
        id: election[0],
        picture: election[1],
        title: election[2],
        description: election[3],
        author: election[4],
        state: election[5],
        reward: election[6],
        numCandidates: election[7],
        numVoters: election[8],
        candidates: candidates,
        myVote,
      })
    }
    getElection()
  }, [params, address])

  return (
    <div className="flex h-full items-center justify-center">
      {election != null && (
        <div className="card flex w-[750px] flex-row bg-base-100 shadow-xl">
          <div>
            <figure className="px-10 pt-10">
              <img
                src="https://picsum.photos/200"
                alt={election.title}
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <span className="text-md text-emerald-600">
                Reward
                <b className="ml-1">
                  {parseFloat(
                    ethers.formatEther(election.reward.toString()),
                  ).toFixed(2)}{' '}
                </b>
                <span>TKF</span>
              </span>
              <span className="text-sm text-gray-500">
                <b>{election.numVoters.toString()}</b> people have voted
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="mb-2">
                <span className="badge badge-success badge-outline badge-xs mr-1 p-2">
                  active
                </span>
              </div>
              <h2 className="mb-1 text-xl">{election.title}</h2>
              <span className="text-sm text-gray-600">
                {election.description}
              </span>
              <div className="flex max-h-[200px] flex-col overflow-auto p-4">
                {election.candidates.map((candidate: any, idx: number) => (
                  <button
                    onClick={() => castVote(idx)}
                    className={`btn-sm btn mb-2 ${
                      election.myVote?.candidateId !== idx
                        ? 'btn-outline'
                        : 'btn'
                    }`}
                    key={idx}
                  >
                    <span>{candidate.title}</span>
                    {election.myVote?.candidateId === idx && (
                      <span className="badge badge-success badge-outline badge-xs p-2">
                        {parseFloat(
                          ethers.formatEther(election.myVote.stake.toString()),
                        ).toFixed(2)}{' '}
                        TKF
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-row justify-end">
              {address === election.author ? (
                <>
                  <button
                    onClick={cancelElection}
                    className="btn-outline btn-error btn-sm btn mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={finishElection}
                    className="btn-success btn-sm btn"
                  >
                    Finish
                  </button>
                </>
              ) : (
                <input
                  type="number"
                  placeholder={election.myVote ? 'Voted' : 'Stake'}
                  disabled={election.myVote != null}
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="input-bordered input input-sm max-w-xs"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
