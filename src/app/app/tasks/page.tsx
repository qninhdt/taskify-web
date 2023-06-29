'use client'

import { taskElectionContract, tokenContract } from '@/services/wallet'
import { use, useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ethers } from 'ethers'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any>([])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [candidates, setCandidates] = useState<any>([])
  const [reward, setReward] = useState<string>('0')
  const [newCandidate, setNewCandidate] = useState<string>('')
  const [modalOpen, setModalOpen] = useState<boolean>(false)

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
    getTasks()
  }, [])

  return (
    <main className="flex h-full flex-col items-center justify-center p-24">
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

      <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-5">
        {tasks.map((task: any, idx: number) => (
          <a
            key={idx}
            href="#"
            className="flex max-w-xl flex-row items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-50 dark:border-gray-700"
          >
            <img
              className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
              src="/docs/images/blog/image-4.jpg"
              alt=""
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {task.title}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {task.description}
              </p>
              <span>
                <b>{task.numVotes}</b> people has voted
              </span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
