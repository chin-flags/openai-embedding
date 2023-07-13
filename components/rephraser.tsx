'use client'

import { useChat, type Message } from 'ai/react'
import CSVReader from 'react-csv-reader'
import { Dialog, Transition } from '@headlessui/react'
import { useState, Fragment, useTransition, useRef, useEffect } from 'react'
import React from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { clearData, embedData, getEmbededCount } from '@/lib/actions'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { cn } from '@/lib/utils'

export function Rephraser({ open, setOpen, onPhrasePicked }: any) {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="container px-24 mx-auto">
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                  <div className="mx-auto sm:max-w-4xl sm:px-4">
                    <p className="mb-2 text-lg font-bold text-gray-600">
                      Chat with openai and rephrase your prompt
                    </p>
                    <div className="flex flex-col w-full px-6 py-4 mt-2 border border-dashed rounded-lg border-gray-900/25">
                      <div className="flex flex-col flex-1">
                        {messages.map(m => (
                          <div key={m.id} className={cn('flex items-start w-full mb-2 ')}>
                            {m.role === 'user' ? (
                              <div className="flex">
                                <img
                                  src="https://api.dicebear.com/6.x/croodles/svg?seed=Buster"
                                  alt=""
                                  className="w-10 h-10 mr-2 bg-gray-100 rounded-full"
                                />

                                <p className="ml-2.5">{m.content}</p>
                              </div>
                            ) : (
                              <CopyToClipboard
                                text={m.content}
                                onCopy={text => { 
                                  onPhrasePicked(text)
                                  setOpen(false)
                                }}
                              >
                                <div className="cursor-pointer w-fit border-1 rounded-md px-2.5 py-1 bg-blue-50 mr-1 mt-1 ">
                                  <p>{m.content}</p>
                                </div>
                              </CopyToClipboard>
                            )}
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={handleSubmit}
                        className="flex w-full mt-4"
                      >
                        <Textarea
                          id="prompt"
                          name="prompt"
                          tabIndex={0}
                          rows={1}
                          placeholder="Send a message."
                          spellCheck={false}
                          value={input}
                          onChange={handleInputChange}
                          className="min-h-[60px] flex-1 resize-none bg-transparent p-2 focus-within:outline-none sm:text-sm"
                        />

                        <Button className="ml-2" type="submit">
                          Send
                        </Button>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default Rephraser
