import React, { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'

function DeleteAdmin({ admin, fetchAdmins, setAlert }) {

    const [loading, setLoading] = useState(false);

    const handleAdminDelete = async (id, e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/user/delete/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                setAlert({
                    status: true,
                    success: data.success,
                    message: data.message,
                });
                fetchAdmins();
            } else {
                setAlert({
                    status: true,
                    success: data.success,
                    message: data.message,
                });
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => handleAdminDelete(admin._id, e)}
                className='bg-gray-800 p-1.5 rounded-md hover:bg-gray-700 cursor-pointer'
            >
                {loading ?
                    <svg className="animate-spin mx-1.5 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    : <TrashIcon aria-hidden="true" className="h-5 w-5 text-gray-500 hover:text-red-500" />
                }
            </button>
        </>
    )
}

export default DeleteAdmin