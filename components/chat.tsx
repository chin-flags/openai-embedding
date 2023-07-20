'use client'

import { chat } from '@/lib/actions'
import { useChat, type Message } from 'ai/react'

import { useState } from 'react'
import React from 'react'
import { Textarea } from './ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@radix-ui/react-tooltip'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { IconArrowElbow } from './ui/icons'
import Rephraser from './rephraser'
import Link from 'next/link'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [results, setResults] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handlePhrasePicked = (text: string) => {
    if (text && inputRef.current) {
      inputRef.current.value = text
    }
  }

  return (
    <>
      <div className="mt-4 inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
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
                  rows={3}
                  placeholder="Send a message."
                  spellCheck={false}
                  className="min-h-[60px] w-full resize-none bg-transparent p-2 focus-within:outline-none sm:text-sm"
                />
              </div>
              <div className="flex mt-2 sm:right-4">
                <Tooltip>
                  <div className="flex flex-col">
                    <div className="flex">
                      <Input
                        id="threshold"
                        name="threshold"
                        placeholder="threshold"
                        defaultValue={0.85}
                        className="mr-1 w-28"
                      />
                      <TooltipTrigger asChild>
                        <Button type="submit">
                          <span>Submit</span>
                        </Button>
                      </TooltipTrigger>
                    </div>
                    <div className="flex mt-2">
                      <Link
                        href="#"
                        className="mr-2 text-blue-500 underline"
                        onClick={() => setOpen(true)}
                      >
                        Rephrase
                      </Link>
                      <p> your prompt before embedding for best results</p>
                    </div>
                  </div>
                </Tooltip>
              </div>
            </form>
          </div>
          <div className="mt-4 grid h-[500px] grid-cols-1 gap-4 mb-4 overflow-auto h-6xl">
            {results.map(({ fields, matchingScore }, index) => (
              <div
                key={index}
                className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="flex-1 min-w-0">
                  <a href="#" className="focus:outline-none">
                    <p className="text-bold">{matchingScore}</p>
                    {Object.keys(fields).map(key => (
                      <div className="flex flex-col" key={key}>
                        <p
                          key={key}
                          className="text-sm font-bold text-gray-500"
                        >
                          {key} :
                        </p>
                        <p key={key} className="text-sm text-gray-500">
                          {fields[key]}
                        </p>
                      </div>
                    ))}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <Rephraser
            open={open}
            setOpen={setOpen}
            onPhrasePicked={handlePhrasePicked}
          />
        </div>
      </div>
    </>
  )
}
