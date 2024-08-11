import React from 'react'

function FeedbackItem({ conversation }) {

    const getProgressColor = (score) => {
        if (score >= 80) return 'bg-green-500'; 
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';                   
    }

    return (
        <>
            <li key={conversation.id} className="relative flex items-center space-x-4 py-4">
                <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                        <div className={`flex items-center justify-center h-10 w-10 text-sm my-auto text-gray-900 font-semibold rounded-full flex-shrink-0`} style={{ backgroundColor: conversation.systemProperties.colour }}>
                            {conversation.systemProperties.initials}
                        </div>
                        <div className='my-auto'>
                            <h2 className="min-w-0 text-sm font-semibold leading-6 text-gray-200">
                                <span className="truncate">{conversation.patientName}'s Conversation Feedback</span>
                            </h2>
                            {conversation.systemProperties.status === "active" &&
                                <span className='text-gray-500 text-sm'>Ensure that the conversation is terminated in order to receive feedback.</span>
                            }
                        </div>
                    </div>
                    <div className="mt-4 space-y-4">
                        {conversation.feedback.map((item, index) => (
                            <div key={index} className='bg-gray-800 p-5 rounded-md space-y-3'>
                                <div className={`${item.sender === "llm" ? `bg-indigo-600` : `bg-green-600`} p-2 py-2 text-gray-200 rounded-md text-sm text-center`}>{item.sender === "llm" ? "AI Model Feedback" : "Instructor Feedback"}</div>
                                {Object.keys(item.feedback).map((area, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <p className='text-gray-300 text-sm font-semibold'>{area.replace(/_/g, ' ')}</p>
                                            <div className="flex items-center space-x-2 my-auto">
                                                <div className="w-60 bg-gray-700 rounded-full h-2.5">
                                                    <div className={`${getProgressColor(item.feedback[area].Score)} h-2.5 rounded-full`} style={{ width: `${item.feedback[area].Score}%` }}></div>
                                                </div>
                                                <span className='text-gray-400 text-sm'>{item.feedback[area].Score}%</span>
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-500 mt-1'>{item.feedback[area].Feedback}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </li>
        </>
    );
}

export default FeedbackItem;
