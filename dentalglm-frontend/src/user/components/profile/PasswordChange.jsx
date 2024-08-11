import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import Alert from '../Alert'

function PasswordChange() {

    const user = useSelector((state) => state.user.currentUser);

    const [values, setValues] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
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
            case 'current_password':
                if (!value) return 'Password is required.';
                if (value.length < 6) return 'Password must be at least 6 characters long.';
                if (value.length > 127) return 'Password must not exceed 127 characters.';
                return '';
            case 'new_password':
                if (!value) return 'Password is required.';
                if (value.length < 6) return 'Password must be at least 6 characters long.';
                if (value.length > 127) return 'Password must not exceed 127 characters.';
                if (value === values.current_password) return 'New password must be different.';
                return '';
            case 'confirm_password':
                if (!value) return 'Password is required.';
                if (value.length < 6) return 'Password must be at least 6 characters long.';
                if (value.length > 127) return 'Password must not exceed 127 characters.';
                if (value !== values.new_password) return 'Confirm password does not match.';
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
                const res = await fetch('/api/user/update/password/' + user._id, {
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
                    setValues({
                        current_password: '',
                        new_password: '',
                        confirm_password: '',
                    });
                } else {
                    setAlert({
                        status: true,
                        success: data.success,
                        message: data.message,
                    });
                }
            } catch (error) {
                setLoading(false);
                setAlert({
                    status: true,
                    success: false,
                    message: "Internal Server Error",
                });
            }
        }
    };


    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-200">Change Password</h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">To change your password, please fill the fields given on the right. If you signed up using Google, you don't need to worry about your password.</p>
            </div>
            <div className="md:col-span-2">
                <form className="bg-gray-800 shadow-sm rounded-xl" onSubmit={handleSubmit}>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-6">
                            <div className="sm:col-span-full">
                                <label htmlFor="current_password" className="block text-sm font-medium leading-6 text-gray-200">
                                    Current Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type="password"
                                        name="current_password"
                                        id="current_password"
                                        value={values.current_password}
                                        onChange={handleChange}
                                        className="border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                    />
                                    {errors.current_password &&
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                        </div>
                                    }
                                </div>
                                {errors.current_password && <p id="name-error" className="mt-1 text-sm text-red-500">{errors.current_password}</p>}
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="new_password" className="block text-sm font-medium leading-6 text-gray-200">
                                    New Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type="password"
                                        name="new_password"
                                        id="new_password"
                                        value={values.new_password}
                                        onChange={handleChange}
                                        className="border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                    />
                                    {errors.new_password &&
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                        </div>
                                    }
                                </div>
                                {errors.new_password && <p id="name-error" className="mt-1 text-sm text-red-500">{errors.new_password}</p>}
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="confirm_password" className="block text-sm font-medium leading-6 text-gray-200">
                                    Confirm Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        id="confirm_password"
                                        value={values.confirm_password}
                                        onChange={handleChange}
                                        className="border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                    />
                                    {errors.confirm_password &&
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                        </div>
                                    }
                                </div>
                                {errors.confirm_password && <p id="name-error" className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>}
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
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export default PasswordChange