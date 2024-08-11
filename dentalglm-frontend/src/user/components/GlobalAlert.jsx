import React from 'react'
import { Transition } from '@headlessui/react'
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { clearAlert } from '../../redux/error/errorSlice';

function GlobalAlert() {

  const dispatch = useDispatch();
  const { status, success, message } = useSelector((state) => state.error);

  if (!status) return null;

  if (success) {
    return (
      <Transition
        show={status}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 right-0 w-full max-w-[26rem] mx-auto bg-transparent text-white p-4 z-50 flex justify-between items-center">
          <div className='w-full'>
            <div className="border-l-4 border-green-400 bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 p-4 ring-1 ring-gray-700 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-400">
                    {message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => dispatch(clearAlert())}
                      className="inline-flex rounded-md bg-inherit p-1.5 text-green-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    )
  }

  if (!success) {
    return (
      <Transition
        show={status}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 right-0 w-full max-w-[26rem] mx-auto bg-transparent text-white p-4 z-50 flex justify-between items-center">
          <div className='w-full'>
            <div className="border-l-4 border-red-500 bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 p-4 ring-1 ring-gray-700 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-500">
                    {message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => dispatch(clearAlert())}
                      className="inline-flex rounded-md bg-inherit p-1.5 text-red-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    )
  }

}

export default GlobalAlert