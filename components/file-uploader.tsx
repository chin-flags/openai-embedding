'use client'

import { useChat, type Message } from 'ai/react'

import { useState } from 'react'
import React from 'react'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function FileUploader({ id, initialMessages, className }: ChatProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [results, setResults] = useState<any[]>([])

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  return (
    <div className="mx-auto sm:max-w-2xl sm:px-4">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Upload a CSV
      </label>
      <div className="flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg border-gray-900/25">
        <div className="text-center">
          <div className="flex mt-4 text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative font-semibold text-indigo-600 bg-white rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
