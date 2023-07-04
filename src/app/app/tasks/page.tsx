'use client'

import { taskElectionContract } from '@/services/wallet'
import { useContext, useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ethers } from 'ethers'
import TaskCard from '@/components/TaskCard'
import { WalletContext } from '@/contexts/wallet-context'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any>([])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [candidates, setCandidates] = useState<any>([])
  const [reward, setReward] = useState<string>('0')
  const [newCandidate, setNewCandidate] = useState<string>('')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { address } = useContext(WalletContext)

  const getTasks = async () => {
    const numElections = await taskElectionContract.numElections()

    const elections: any = []

    for (let i = 0; i < numElections; i++) {
      const election = await taskElectionContract.elections(i)
      elections.push({
        id: election[0],
        picture: election[1],
        title: election[2],
        description: election[3],
        author: election[4],
        state: election[5],
        reward: election[6],
        numCandidates: election[7],
        numVoters: election[8],
      })
    }

    setTasks(elections)
  }

  const createTask = async () => {
    const _reward = ethers.parseEther(reward)

    await taskElectionContract.createElection(
      '',
      title,
      description,
      _reward,
      candidates,
    )

    closeModal()
  }

  const closeModal = () => {
    setModalOpen(false)
    setTitle('')
    setDescription('')
    setCandidates([])
    setNewCandidate('')
    setReward('0')
  }

  const addCandidate = () => {
    setCandidates([...candidates, newCandidate])
    setNewCandidate('')
  }

  useEffect(() => {
    if (address) getTasks()
  }, [address])

  const renderDialog = () => (
    <dialog className={`modal ${modalOpen && 'modal-open'}`}>
      <form method="dialog" className="modal-box">
        <h3 className="mb-5 text-lg font-bold">Create a new task</h3>
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Type here"
          className="input-bordered input input-md w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Type here"
          className="input-bordered input input-md w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text">Reward (TKF)</span>
        </label>
        <input
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          type="number"
          placeholder="Type here"
          className="input-bordered input input-md w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text">Candidates</span>
        </label>
        <ul>
          {candidates.map((candidate: string, idx: number) => (
            <li key={idx} className="mb-2 flex">
              <span className="rounded-xl bg-gray-200 px-4 py-2 text-sm">
                {candidate}
              </span>
            </li>
          ))}
          <li className="flex flex-row items-center">
            <input
              value={newCandidate}
              className="input-bordered input input-sm mr-3 max-w-xs"
              onChange={(e) => setNewCandidate(e.target.value)}
              type="text"
              placeholder="Type here"
            />
            <button onClick={addCandidate} className="btn-outline btn-sm btn">
              Add
            </button>
          </li>
        </ul>
        <div className="modal-action">
          <button className="btn-success btn" onClick={createTask}>
            Create
          </button>
          <button className="btn" onClick={closeModal}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  )

  return (
    <main className="flex h-full flex-col items-center justify-center p-10">
      {renderDialog()}
      <div className="mb-5 flex flex-row items-center justify-center">
        <button
          onClick={() => setModalOpen(true)}
          className="btn-outline btn-sm btn mr-3"
        >
          <PlusIcon className="h-4 w-4" />
          Create Task
        </button>
        <button onClick={getTasks} className="btn-outline btn-sm btn">
          Load Tasks
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tasks.map((task: any, idx: number) => (
          <TaskCard key={idx} task={task} />
        ))}
      </div>
    </main>
  )
}
