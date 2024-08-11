import React, {useState, useEffect} from 'react'
import { Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

function Alert({ className, alert }) {

  const [status, setStatus] =  useState(alert.status);

  useEffect(() => {
    setStatus(alert.status);
  }, [alert.status])

  if(alert.success) {
    return (
      <>
        <Transition
          show={status}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={className}>
            <div className="border-l-4 border-green-400 bg-gray-800/60 p-4 ring-1 ring-gray-800 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-400">
                    {alert.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => setStatus(false)}
                      className="inline-flex rounded-md bg-gray-800/60 p-1.5 text-green-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </>
    )
  }
  else{
    return (
      <>
        <Transition
          show={status}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={className}>
            <div className="border-l-4 border-red-500 bg-gray-800/60 p-4 ring-1 ring-gray-800 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-500">
                    {alert.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => setStatus(false)}
                      className="inline-flex rounded-md bg-gray-800/60 p-1.5 text-red-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </>
    )
  }
}

export default Alert    