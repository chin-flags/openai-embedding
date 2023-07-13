'use client'

import { clearData } from '@/lib/actions'
import { Button } from './ui/button'
import { useTransition } from 'react'
import Link from 'next/link'

const CleanData = () => {
  const [isPending, startTransition] = useTransition()

  const handleClearData = async () => {
    startTransition(() => {
      clearData()
    })
  }

  return (
    <Link
      href="#"
      className="mr-2 text-red-500 underline"
      onClick={() => handleClearData()}
    >
      Clear all data
    </Link>
  )
}

export default CleanData
