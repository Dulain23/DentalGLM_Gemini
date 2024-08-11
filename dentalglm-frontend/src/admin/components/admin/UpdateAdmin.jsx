import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

function UpdateAdmin({ admin, modalOpen, setModalOpen, setAlert, fetchAdmins }) {
    const [values, setValues] = useState({
        name: admin.name,
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValues({
            name: admin.name,
            password: '',
        });
    }, [admin]);

    const validateInput = (name, value) => {
        switch (name) {
            case 'name':
                if (!value) return 'Full Name is required.';
                if (value.length < 3) return 'Full Name must be at least 3 characters long.';
                if (value.length > 70) return 'Full Name must not exceed 70 characters.';
                if (value === admin.name) return 'Full Name must be from current full name.';
                return '';
            case 'password':
                if (value && value.length < 6) return 'Password must be at least 6 characters long.';
                if (value.length > 127) return 'Password must not exceed 127 characters.';
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
                const res = await fetch(`/api/user/update/admin/${admin._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                const data = await res.json();
                if (data.success){
                    setAlert({
                        status: true,
                        success: data.success,
                        message: data.message,
                    });
                    fetchAdmins();
                }else{
                    setAlert({
                        status: true,
                        success: data.success,
                        message: data.message,
                    });
                }
            } catch (error) {
                setAlert({
                    status: true,
                    success: false,
                    message: "Internal Server Error",
                });
            } finally {
                setLoading(false);
                closeModal();
            }
        }
    };

    const closeModal = () => {
        setErrors({});
        setModalOpen(false);
    };

    return (
        <>
            <Transition appear show={modalOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto xl:pl-72">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-200">
                                        Update Admin
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-400">
                                            Fill the details below to update admin.
                                        </p>
                                        <form onSubmit={handleSubmit} className="space-y-5 mt-3">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                                                    Full Name
                                                </label>
                                                <div className="relative mt-1 rounded-md shadow-sm">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        value={values.name}
                                                        className={`border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6`}
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
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                                                    Email
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        defaultValue={admin.email}
                                                        disabled
                                                        className="border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-400 focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                                    Password
                                                </label>
                                                <div className="relative mt-1 rounded-md shadow-sm">
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        className={`border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6`}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.password &&
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                        </div>
                                                    }
                                                </div>
                                                {errors.password && <p id="password-error" className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className={`flex justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-medium text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                                >
                                                    {loading ?
                                                        <svg className="animate-spin mx-1.5 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        : "Save"
                                                    }
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                    onClick={closeModal}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default UpdateAdmin;
