'use client'

import { useChat, type Message } from 'ai/react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import React from 'react'
import { chat } from '@/lib/actions'
import { Textarea } from './ui/textarea'
import { IconArrowElbow } from './ui/icons'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  console.log('==', isLoading)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          {isLoading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
              {results.map(result => (
                <div
                  key={result.email}
                  className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-1 min-w-0">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {result.name}
                      </p>
                      <p className="text-bold">{result.matchingScore}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {result.industries}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {result.location}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {result.type}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {result.email}
                      </p>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
            <form
              action={async data => {
                setIsLoading(true)
                const resp = await chat(data)
                setIsLoading(false)
                setResults(resp)
              }}
            >
              <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border">
                <Textarea
                  id="prompt"
                  name="prompt"
                  ref={inputRef}
                  tabIndex={0}
                  rows={1}
                  placeholder="Send a message."
                  spellCheck={false}
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <div className="flex">
                      <Input
                        id="threshold"
                        name="threshold"
                        placeholder="threshold"
                        defaultValue={0.85}
                        className="mr-1 w-28"
                      />
                      <TooltipTrigger asChild>
                        <Button type="submit" size="icon">
                          <IconArrowElbow />
                          <span className="sr-only">Send message</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send message</TooltipContent>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
