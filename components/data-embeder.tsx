'use client'

import CSVReader from 'react-csv-reader'
import { Dialog, Transition } from '@headlessui/react'
import { useState, Fragment, useTransition, useRef } from 'react'
import React from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { embedData } from '@/lib/actions'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export function DataEmbedder() {
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLTextAreaElement>(null)
  const [open, setOpen] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<any[]>()
  const [template, setTemplate] = useState('')

  const handleEmbed = () => {
    const dataArr = data?.map(row => {
      let text = template
      headers.forEach(header => {
        if (row[header]) {
          text = text.replaceAll(`{${header}}`, row[header])
        } else {
          text = text.replaceAll(`{${header}}`, "")
        }
      })
      return {
        text,
        fields: row
      }
    })

    if (!dataArr) return

    startTransition(() => {
      embedData(dataArr, template)
      setData([])
      setHeaders([])
      setOpen(false)
    })
  }

  return (
    <div className="container px-24 mx-auto">
      <div className="flex flex-col items-center mt-4">
        <Button onClick={() => setOpen(true)} className="w-32">
          Upload
        </Button>
      </div>
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
                      Pick and embed a CSV file
                    </p>
                    <div className="flex flex-col items-center justify-center w-full px-6 py-4 mt-2 border border-dashed rounded-lg border-gray-900/25">
                      {headers.length > 0 ? (
                        <>
                          <div className="mt-4">
                            <p>These are the headers of your CSV file</p>

                            <div className="flex flex-wrap w-full mt-2">
                              {headers.map(header => (
                                <CopyToClipboard
                                  key={header}
                                  text={header}
                                  onCopy={text => {
                                    setTemplate(temp => `${temp} {${text}} `)
                                    ref.current?.focus()
                                  }}
                                >
                                  <div className="cursor-pointer rounded-full px-2.5 py-1 bg-blue-100 mr-1 mt-1 ">
                                    <p>{header}</p>
                                  </div>
                                </CopyToClipboard>
                              ))}
                            </div>
                          </div>
                          <label className="mt-4">
                            How does your embed data should look like: use
                            curley braces for column names
                          </label>
                          <Textarea
                            ref={ref}
                            id="embed-template"
                            name="embed-template"
                            tabIndex={0}
                            rows={3}
                            placeholder="{name} is an investor based in {city}.He focuses on {industries}"
                            value={template}
                            onChange={e => setTemplate(e.target.value)}
                            className="min-h-[60px] mt-2 w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                          />
                          <Button
                            className="self-end mt-2"
                            onClick={() => handleEmbed()}
                            disabled={isPending}
                          >
                            {`Embed data (${data?.length})`}
                          </Button>
                        </>
                      ) : (
                        <CSVReader
                          onFileLoaded={(data: any[]) => {
                            setHeaders(Object.keys(data[0]))
                            setData(data)
                          }}
                          parserOptions={{ header: true }}
                        />
                      )}
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

export default DataEmbedder
