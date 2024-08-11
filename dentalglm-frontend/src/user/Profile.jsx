import React, { useState } from 'react'

import Sidebar from './components/app/Sidebar';
import { Bars3Icon } from '@heroicons/react/24/solid'
import ProfileDetails from './components/profile/ProfileDetails';
import PasswordChange from './components/profile/PasswordChange';

function Profile() {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <div>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="xl:pl-72">
                    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-white xl:hidden">
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="h-5 w-5"/>
                        </button>
                    </div>

                    <main className='py-5 lg:py-10'>
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="space-y-10 divide-y divide-gray-900/10">
                                <ProfileDetails />
                                <PasswordChange />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Profile