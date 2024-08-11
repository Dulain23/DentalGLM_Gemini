import React from 'react'
import Typewriter from './Typewriter'

function ChatMessage({ message, user, chat, isTyping, onTyping }) {
    if (message.sender === 'user') {
        return (
            <div key={message._id} className={`flex items-center justify-start flex-row-reverse first:mt-4`}>
                <img
                    className="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
                    src={user.profile}
                />
                <div
                    className="max-w-[70%] relative mr-3 text-sm bg-gray-800 py-2 px-4 ring-1 ring-gray-700 rounded-xl max-w-1/2"
                >
                    <div className='text-gray-200'>
                        {message.content}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div key={message._id} className={`flex items-center first:mt-4`}>
            <div className={`flex items-center justify-center h-10 w-10 text-sm text-gray-900 font-semibold rounded-full flex-shrink-0`} style={{ backgroundColor: chat.systemProperties.colour }}>
                {chat.systemProperties.initials}
            </div>
            <div
                className="max-w-[70%] relative ml-3 text-sm bg-indigo-700 py-2 px-4 ring-1 ring-indigo-600 rounded-xl max-w-1/2"
            >
                <div className='text-gray-200'>
                    {isTyping ? <Typewriter text={message.content} delay={50} onTyping={onTyping} /> : message.content}
                </div>
            </div>
        </div>
    )
}

export default ChatMessage
