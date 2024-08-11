import React, { useState, useEffect } from 'react';
import Sidebar from './components/app/Sidebar';
import { Bars3Icon } from '@heroicons/react/24/solid'
import Loading from './components/app/Loading';
import { useDispatch } from 'react-redux';
import { setError } from '../redux/error/errorSlice';
import FeedbackItem from './components/feedback/FeedbackItem';

function Feedback() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(true);
    const dispatch = useDispatch();

    // Load Feedback from backend API
    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await fetch(`/api/user/conversations/feedback`);
                const data = await response.json();

                if (data.success) {
                    setConversations(data.body.conversations);
                } else {
                    //Show user if chat retrieval error
                    dispatch(setError(data.message));
                }
            } catch (error) {
                //System errors to console
                console.log(error.message);
            } finally {
                setFeedbackLoading(false);
            }
        };

        fetchChat();
    }, []);

    if (feedbackLoading) {
        return <Loading />;
    }

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

                <main className='py-5 lg:py-10'>
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex-auto mb-2 ">
                            <h1 className="text-base font-semibold leading-6 text-gray-200">Feedback History</h1>
                            <p className="mt-2 text-sm text-gray-400">
                                A list of all the feedback from AI Model and Instructors for each conversation
                            </p>
                        </div>
                        <ul role="list" className="divide-y divide-white/5">
                            {conversations.map((conversation) => (
                                <FeedbackItem key={conversation.id} conversation={conversation} />
                            ))}
                        </ul>
                    </div>
                </main>
            </div >
        </div >
    );
}

export default Feedback