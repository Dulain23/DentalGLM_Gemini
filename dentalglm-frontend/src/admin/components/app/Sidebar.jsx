import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../../redux/user/userSlice';

import { navigationLinks } from './navigationData';
import NavigationItem from './NavigationItem';

import { setError } from '../../../redux/error/errorSlice';

function Sidebar({ sidebarOpen, setSidebarOpen }) {

    // Load Current Route Path
    const location = useLocation();
    const currentPath = location.pathname;

    // Load User Slice 
    const user = useSelector((state) => state.user.currentUser);

    // Logout Feature
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout');
            dispatch(logoutSuccess());
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Transition show={sidebarOpen}>
                <Dialog className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
                    <TransitionChild>
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" onClick={() => setSidebarOpen(false)} />
                    </TransitionChild>
                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                        >
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                                <div className="flex h-20 shrink-0 items-center">
                                    <img
                                        alt="DentalGLM"
                                        src="/Dental_GLM_Logo.png"
                                        className="h-10 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigationLinks.map((item) => (
                                                    <NavigationItem key={item.name} item={item} isCurrent={item.href === currentPath} />
                                                ))}
                                                <li key="Logout">
                                                    <a
                                                        onClick={handleLogout}
                                                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white`}
                                                    >
                                                        <ArrowLeftStartOnRectangleIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                                        Logout
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="-mx-6 mt-auto">
                                            <a
                                                href="#"
                                                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                            >
                                                <img
                                                    alt=""
                                                    src={user.profile}
                                                    className="h-9 w-9 rounded-full bg-gray-800"
                                                />
                                                <span className="sr-only">Your profile</span>
                                                <span aria-hidden="true">{user.name}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
            {/* Static sidebar for desktop */}
            <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                    <div className="flex h-20 shrink-0 items-center">
                        <img
                            alt="DentalGLM"
                            src="/Dental_GLM_Logo.png"
                            className="h-10 w-auto"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigationLinks.map((item) => (
                                        <NavigationItem key={item.name} item={item} isCurrent={item.href === currentPath} />
                                    ))}
                                    <li key="Logout">
                                        <a
                                            onClick={handleLogout}
                                            className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white`}
                                        >
                                            <ArrowLeftStartOnRectangleIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <a
                                    href="/user/profile"
                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                                >
                                    <img
                                        alt=""
                                        src={user.profile}
                                        className="h-9 w-9 rounded-full bg-gray-800"
                                    />
                                    <span className="sr-only">Your profile</span>
                                    <span aria-hidden="true">{user.name}</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Sidebar