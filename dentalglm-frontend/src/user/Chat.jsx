import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError, setSuccess } from '../redux/error/errorSlice';
import { Transition } from '@headlessui/react';

import Loading from './components/app/Loading'

import Sidebar from './components/app/Sidebar';
import PatientProfile from './components/chat/PatientProfile';
import ChatMessage from './components/chat/ChatMessage';

import Alert from './components/Alert';
import { PaperAirplaneIcon, UserIcon, XMarkIcon, StopIcon, Bars3Icon } from '@heroicons/react/24/solid'

import { useSelector } from 'react-redux'

function Chat() {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get User
    const user = useSelector((state) => state.user.currentUser);

    // Get Chat ID
    const { id } = useParams();

    // Get Chat and Set Chat
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({
        status: false,
        success: null,
        message: null,
    });

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await fetch(`/api/user/conversation/${id}`);
                const data = await response.json();

                if (data.success) {
                    setChat(data.body.conversation);
                } else {
                    //Show user if chat retrieval error
                    dispatch(setError(data.message));
                }
            } catch (error) {
                //System errors to console
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [id]);

    // Handle new message and get reply from LLM
    const [messageLoading, setMessageLoading] = useState(false);
    const [values, setValues] = useState({
        message: '',
    });

    const [typing, setTyping] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    }

    const handleSubmit = async () => {
        if (!values.message) return;

        const newMessage = {
            _id: 'temp-message',
            sender: 'user',
            content: values.message,
            timestamp: new Date(),
        };

        setChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage],
        }));

        setValues({ message: '' });
        setMessageLoading(true);

        try {
            const res = await fetch(`/api/user/conversation/message/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage.content }),
            });
            const data = await res.json();
            if (data.success) {
                setTyping(true);
                setChat(data.body.conversation);
            } else {
                setAlert({
                    status: true,
                    success: data.success,
                    message: data.message,
                });
                // Remove the temporary message if the API call fails
                setChat(prevChat => ({
                    ...prevChat,
                    messages: prevChat.messages.filter(msg => msg._id !== 'temp-message'),
                }));
            }
        } catch (error) {
            dispatch(setError(error.message));
            // Remove the temporary message if an error occurs
            setChat(prevChat => ({
                ...prevChat,
                messages: prevChat.messages.filter(msg => msg._id !== 'temp-message'),
            }));
        } finally {
            setMessageLoading(false);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    // Handle end chat and generate conversation score
    const [endChatLoading, setEndChatLoading] = useState(false);
    const handleEndChat = async () => {
        setEndChatLoading(true);
        try {
            const res = await fetch(`/api/user/conversation/end/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                setChat(data.body.conversation);
                //Show user feedback page with success alert
                navigate('/user/feedback');
                dispatch(setSuccess(data.message));
            } else {
                setAlert({
                    status: true,
                    success: data.success,
                    message: data.message,
                });
            }
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            setEndChatLoading(false);
        }
    }

    // State for patient profile on small devices
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Auto scrolling to most recent message
    const messagesEndRef = useRef(null);

    const handleTyping = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat, messageLoading, typing]);

    // Auto adjusting text area height as reply gets larger
    const textAreaRef = useRef(null);
    const prevTextAreaHeight = useRef(40);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            const currentHeight = textAreaRef.current.scrollHeight;
            if (currentHeight !== prevTextAreaHeight.current) {
                textAreaRef.current.style.height = `${currentHeight}px`;
                prevTextAreaHeight.current = currentHeight;
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                textAreaRef.current.style.height = `${currentHeight}px`;
                prevTextAreaHeight.current = currentHeight;
            }
        }
    }, [values.message])

    if (loading) {
        return (
            <Loading />
        )
    }

    if (!chat) {
        navigate("/user/home");
    }

    return (
        <>
            <div>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="xl:pl-72 flex flex-col min-h-screen overflow-clip">
                    {/* Sticky header */}
                    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-white xl:hidden">
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="h-5 w-5" />
                        </button>
                        <button onClick={() => setIsPopupVisible(true)} className='lg:hidden flex text-xs font-semibold bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-gray-200'>
                            <UserIcon className="h-4 w-4 my-auto mr-1" aria-hidden="true" />
                            <span>Patient Details</span>
                        </button>
                    </div>

                    <main className="lg:pr-96 flex-grow">
                        <div className="h-full px-5 space-y-3 mb-20">
                            {chat.messages.map((message, index) => (
                                <ChatMessage
                                    key={message._id}
                                    message={message}
                                    user={user}
                                    chat={chat}
                                    isTyping={typing && index === chat.messages.length - 1 && message.sender === 'llm'}
                                    onTyping={handleTyping}
                                />
                            ))}
                            {messageLoading && (
                                <div className="flex items-center space-x-3">
                                    <div className={`flex items-center justify-center h-10 w-10 text-sm text-gray-900 font-semibold rounded-full flex-shrink-0`} style={{ backgroundColor: chat.systemProperties.colour }}>
                                        {chat.systemProperties.initials}
                                    </div>
                                    <div className="flex items-center h-8 space-x-1">
                                        <div className="typing__dot h-2.5 w-2.5 rounded-full bg-gray-700"></div>
                                        <div className="typing__dot h-2.5 w-2.5 rounded-full bg-gray-700"></div>
                                        <div className="typing__dot h-2.5 w-2.5 rounded-full bg-gray-700"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef}/>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 lg:right-96 xl:left-72 xl:right-96 z-40 flex items-center bg-gray-900 py-2 px-5">
                            <div className="group w-full">
                                <div className="w-full flex items-center justify-center">
                                    <Alert alert={alert} className={'w-full mb-3 mt-2'} />
                                </div>
                                <div className="w-full p-1.5 px-3 bg-gray-800 rounded-xl flex items-center">
                                    {chat.messages.length > 0 && chat.systemProperties.status === 'active' && (
                                        <button disabled={endChatLoading} className='mr-2 bg-gray-700 p-2 rounded-lg text-gray-400 hover:text-gray-200' onClick={handleEndChat}>
                                            {endChatLoading ?
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                :
                                                <StopIcon className="h-5 w-5" aria-hidden="true" />
                                            }
                                        </button>
                                    )}
                                    <textarea
                                        className='flex-grow h-auto min-h-[40px] bg-inherit placeholder-gray-400 text-white p-2 resize-none focus:outline-none rounded-xl overflow-hidden'
                                        placeholder={`Message ${chat.patient.Patient_Name}`}
                                        name='message'
                                        disabled={chat.systemProperties.status !== 'active' || messageLoading || endChatLoading}
                                        value={values.message}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        ref={textAreaRef}
                                        style={{ maxHeight: '100px' }}
                                    ></textarea>
                                    <button disabled={!values.message || chat.systemProperties.status !== 'active' || messageLoading || endChatLoading} onClick={handleSubmit} className={`p-2 bg-indigo-600 hover:bg-indigo-700 disabled:hover:bg-indigo-600 text-white rounded-full items-center`}>
                                        <PaperAirplaneIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>

                    <aside className="bg-black/10 hidden lg:block lg:fixed lg:bottom-0 lg:right-0 top-14 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
                        <header className="flex items-center justify-between border-b border-white/5 py-5 px-8">
                            <h2 className="text-base font-semibold leading-7 text-white">Patient Profile</h2>
                            {chat.systemProperties.status === 'active' && (
                                <span href="#" className="text-sm font-semibold leading-6 text-green-400">
                                    Active
                                </span>
                            )}
                        </header>
                        <div className=" px-8 py-4">
                            <PatientProfile chat={chat} />
                        </div>
                    </aside>

                    {/* Popup for Patient Profile */}
                    <Transition
                        show={isPopupVisible}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-gray-900 p-8 rounded-lg shadow-lg relative h-full overflow-y-auto">
                                <button
                                    onClick={() => setIsPopupVisible(false)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                                <PatientProfile chat={chat} />
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    );
}

export default Chat