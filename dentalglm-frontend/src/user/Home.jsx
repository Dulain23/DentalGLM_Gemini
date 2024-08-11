import React, { useState } from 'react';
import Sidebar from './components/app/Sidebar';
import StartChat from './components/chat/StartChat';
import { Bars3Icon } from '@heroicons/react/24/solid'

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="xl:pl-72 flex flex-col min-h-screen">
                <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2.5 p-2.5 text-white xl:hidden"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>

                <main className="flex-grow px-5 flex items-center justify-center">
                    <StartChat />
                </main>
            </div>
        </div>
    );
}

export default Home;