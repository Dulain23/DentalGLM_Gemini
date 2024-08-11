import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError, setSuccess } from '../../../redux/error/errorSlice';
import { TrashIcon } from '@heroicons/react/24/outline';

function ChatItem({ item, isCurrent }) {

    const href = '/user/chats/' + item.id;

    // Delete User Chat
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChatDelete = async (id, e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/user/conversation/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                dispatch(setSuccess(data.message));
                // Refresh page
                navigate("/");
            } else {
                dispatch(setError(data.message));
            }
        } catch (error) {
            // System errors to console
            console.log(error.message);
        }
    };

    return (
        <li key={item._id}>
            <a
                href={href}
                className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 justify-between ${isCurrent ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
                <div className="flex space-x-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                        {item.initials}
                    </span>
                    <span className="truncate">{item.patientName}</span>
                </div>
                <button
                    onClick={(e) => handleChatDelete(item.id, e)}
                    className={`text-gray-400 hover:text-red-500 justify-end`}
                >
                    <TrashIcon
                        className={`h-5 w-5 shrink-0 flex md:group-hover:flex md:hidden`}
                        aria-hidden="true"
                    />
                </button>
            </a>
        </li>
    )
}
export default ChatItem;