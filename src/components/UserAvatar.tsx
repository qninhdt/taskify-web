import { Popover, Transition } from '@headlessui/react'
import { Fragment, useContext, useState } from 'react'
import ConnectWalletButton from './ConnectWalletButton'
import { WalletContext } from '@/contexts/wallet-context'
import {
  ArrowLeftOnRectangleIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline'
import { truncateTextInMiddle } from '@/utils/text'
import { ethers } from 'ethers'

export type UserAvatarProps = {
  expanded: boolean
}

export default function UserAvatar({ expanded }: UserAvatarProps) {
  const { address, provider, balance, tkfBalance } = useContext(WalletContext)
  const [finished, setFinished] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
  }

  return (
    <div>
      <Popover className="relative flex">
        {({ open }) => (
          <>
            <Popover.Button
              className={`outline-none duration-100 ${open && 'scale-110'}`}
            >
              {provider ? (
                <img
                  src="https://i.redd.it/ci6tqn666fs71.jpg"
                  alt="bardabez"
                  className={`h-8 w-8 rounded-full ${
                    open ? 'p-[2px] ring-1' : 'p-[1px] ring-2'
                  } ring-emerald-500`}
                />
              ) : (
                <div className="rounded-full p-1 ring-1 ring-gray-300">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </div>
              )}
            </Popover.Button>
            <Transition
              afterEnter={() => setFinished(true)}
              afterLeave={() => setFinished(false)}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 -translate-y-1/3"
              enterTo="opacity-100 -translate-y-1/2"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 -translate-y-1/2"
              leaveTo="opacity-0 -translate-y-1/3"
            >
              <Popover.Panel className="absolute left-full top-1/2 z-10 -translate-y-1/2 translate-x-10">
                {finished && (
                  <>
                    <div className="absolute z-0 h-full w-full animate-wawe rounded-xl border-[4px] border-emerald-200 border-opacity-50"></div>
                    <div className="absolute z-0 h-full w-full animate-xwave rounded-xl border-[2px] border-emerald-400 border-opacity-50"></div>
                  </>
                )}

                <div className="relative z-20 rounded-xl bg-gray-100 p-5">
                  {provider ? (
                    <div className="">
                      <div
                        onClick={copyToClipboard}
                        className="mb-2 select-none whitespace-nowrap rounded-full border-[1px] border-gray-600 px-2 py-1 text-xs text-gray-800"
                      >
                        {truncateTextInMiddle(address, 20)}
                      </div>
                      <div className="text-center">
                        <span className="mr-3 text-xs text-purple-600">
                          {parseFloat(ethers.formatEther(balance)).toFixed(2)}{' '}
                          <b>ETH</b>
                        </span>
                        <span className="text-xs text-emerald-600">
                          {parseFloat(ethers.formatEther(tkfBalance)).toFixed(
                            2,
                          )}{' '}
                          <b>TKF</b>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <ConnectWalletButton />
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
