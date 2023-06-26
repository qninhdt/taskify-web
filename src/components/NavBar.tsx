'use client'

import { WalletContext } from '@/contexts/wallet-context'
import { useContext, useEffect, useState } from 'react'
import ConnectWalletButton from './ConnectWalletButton'
import { truncateTextInMiddle } from '@/utils/text'
import Logo from '@/assets/logo.svg'
import {
  Square3Stack3DIcon,
  Squares2X2Icon,
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserAvatar from './UserAvatar'

const links = [
  [
    { name: 'Dashboard', href: '/app', icon: Squares2X2Icon },
    { name: 'Task', href: '/app/tasks', icon: Square3Stack3DIcon },
  ],
  [
    { name: 'Notification', href: '/app/notifications', icon: BellIcon },
    { name: 'Chat', href: '/app/chat', icon: ChatBubbleLeftEllipsisIcon },
  ],
]

export default function NavBar() {
  const { provider, address } = useContext(WalletContext)
  const [currentLink, setCurrentLink] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setCurrentLink(
      links
        .flat()
        .find((link) =>
          link.name == 'Dashboard'
            ? pathname == '/app'
            : pathname.startsWith(link.href),
        )?.name || '',
    )
  }, [pathname])

  return (
    <nav className="flex flex-col justify-center border-r-[1px] border-gray-200 bg-white py-3">
      <div className="mb-8 flex flex-col items-center">
        <Logo className="h-7 w-7" />
      </div>
      <div className="mb-5 flex flex-col items-center">
        <UserAvatar expanded={false} />
      </div>
      {links
        .filter((_, _idx) => _idx != 1 || address)
        .map((_links, _idx) => (
          <div className="my-1 flex flex-col justify-center py-1" key={_idx}>
            {_links.map((link) => (
              <div
                className={`relative px-3 ${
                  link.name == currentLink &&
                  'after:absolute after:right-[-2px] after:top-[50%] after:h-4 after:w-[2px] after:translate-y-[-50%] after:bg-emerald-500'
                }`}
                key={link.name}
              >
                <Link
                  href={link.href}
                  className={`flex rounded-xl p-2  hover:bg-gray-100  ${
                    link.name == currentLink
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <link.icon className={`h-5 w-5 `} />
                </Link>
              </div>
            ))}
          </div>
        ))}
    </nav>
  )
}
