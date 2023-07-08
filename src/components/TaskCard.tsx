import { ethers } from 'ethers'
import Link from 'next/link'

export default function TaskCard({ task }: any) {
  const status = [
    ['active', 'badge-success'],
    ['closed', 'badge-warning'],
    ['canceled', 'badge-error'],
  ]

  console.log(task)

  return (
    <div className="card card-side mb-3 w-[640px] bg-base-100 shadow-md">
      <figure>
        <img
          src="https://picsum.photos/200"
          alt={task.title}
          className="h-48"
        />
      </figure>
      <div className="card-body p-4">
        <div>
          <span
            className={`badge ${
              status[task.state][1]
            } badge-outline badge-xs mr-1 p-2`}
          >
            {status[task.state][0]}
          </span>
          {task.state != 2 && (
            <span className="badge badge-info badge-outline badge-xs p-2">
              {task.numVoters.toString()} votes
            </span>
          )}
        </div>

        <h2 className="card-title">{task.title}</h2>
        <p className="text-gray-600">{task.description}</p>
        <span className="text-sm text-gray-600">
          Reward
          <b className="ml-1">
            {parseFloat(ethers.formatEther(task.reward.toString())).toFixed(2)}{' '}
          </b>
          <span>TKF</span>
        </span>
        {task.state != 2 && (
          <div className="card-actions justify-end">
            <Link
              href={`/app/tasks/${task.id}`}
              className="btn-outline btn-sm btn"
            >
              View
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
