'use client'

import './globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-toastify/dist/ReactToastify.css'

import { Inter } from 'next/font/google'
import { FC, PropsWithChildren, use, useContext } from 'react'
import NavBar from '@/components/NavBar'
import { ToastContainer } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Taskify</title>
      </head>
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}

export default RootLayout
