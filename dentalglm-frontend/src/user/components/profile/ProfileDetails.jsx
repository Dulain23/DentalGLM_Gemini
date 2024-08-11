import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import Alert from '../Alert'
import { updateSuccess } from '../../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function ProfileDetails() {

    const user = useSelector((state) => state.user.currentUser);
    const disptach = useDispatch();

    const [values, setValues] = useState({
        name: user.name,
    })

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        status: false,
        success: null,
        message: null,
    });

    const validateInput = (name, value) => {
        switch (name) {
            case 'name':
                if (!value) return 'Full Name is required.';
                if (value.length < 3) return 'Full Name must be at least 3 characters long.';
                if (value.length > 70) return 'Full Name must not exceed 70 characters.';
                if (value === user.name) return 'Full Name must be from current full name.';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const error = validateInput(name, value);
        setErrors({ ...errors, [name]: error });
        setValues({ ...values, [name]: value });
    };

    const isFormValid = () => {
        const newErrors = Object.keys(values).reduce((acc, key) => {
            const error = validateInput(key, values[key]);
            if (error) acc[key] = error;
            return acc;
        }, {});
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isFormValid()) {
            setLoading(true);
            setAlert({
                status: false,
                success: null,
                message: null,
            });
            try {
                const res = await fetch('/api/user/update/profile/' + user._id, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                const data = await res.json();
                setLoading(false);
                if (data.success) {
                    setAlert({
                        status: true,
                        success: data.success,
                        message: data.message,
                    });
                    disptach(updateSuccess(data.body));
                    return;
                } else {
                    setAlert({
                        status: true,
                        success: data.success,
                        message: data.message,
                    });
                    return;
                }
            } catch (error) {
                setLoading(false);
                setAlert({
                    status: true,
                    success: false,
                    message: "Internal Server Error",
                });
                return;
            }
        }
    };

    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-200">Profile Details</h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                    This information will be displayed publicly so be careful what you share, and ensure information is accurate.
                </p>
            </div>

            <div className='md:col-span-2'>
                <form className="bg-gray-800 shadow-sm rounded-xl" onSubmit={handleSubmit}>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-6">
                            <div className="sm:col-span-full">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-200">
                                    Full Name
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        defaultValue={user.name}
                                        className="border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                        onChange={handleChange}
                                    />
                                    {errors.name &&
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                        </div>
                                    }
                                </div>
                                {errors.name && <p id="name-error" className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-full">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        defaultValue={user.email}
                                        disabled
                                        className="border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-400 focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-700 px-4 py-4 sm:px-8">
                        <a href="/user/profile" className="text-sm font-semibold leading-6 text-gray-200">
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {loading ?
                                <svg className="animate-spin mx-1.5 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                : "Save"
                            }
                        </button>
                    </div>
                </form>
                {alert.status &&
                    <Alert className={'sm:col-span-full mt-3'} alert={alert} />
                }
            </div>
        </div>
    )
}

export default ProfileDetails