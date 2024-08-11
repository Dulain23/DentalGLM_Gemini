import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setSuccess } from '../../../redux/error/errorSlice';
import { XCircleIcon, LightBulbIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';
import { reasonsForVisit, patientCharacteristics } from './chatProperties';

import Alert from '../Alert';

function StartChat() {
    const dispatch = useDispatch();

    const [values, setValues] = useState({
        reasonsForVisit: {},
        patientCharacteristics: [],
    });

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState({
        status: false,
        success: null,
        message: null,
    });

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [characteristicsSearchTerm, setCharacteristicsSearchTerm] = useState("");

    const handleReasonForVisitSelect = (item) => {
        setValues(prev => ({
            ...prev,
            reasonsForVisit: item,
        }));
        setSearchTerm(item.value);
    }

    const handleClearReasonForVisit = () => {
        setValues(prev => ({
            ...prev,
            reasonsForVisit: {},
        }));
        setSearchTerm("");
    }

    const handlePatientCharacteristicsSelect = (item) => {
        if (values.patientCharacteristics.find(tag => tag.id === item.id)) {
            const newTags = values.patientCharacteristics.filter(tag => tag.id !== item.id);
            setValues(prev => ({
                ...prev,
                patientCharacteristics: newTags,
            }));
        } else {
            if (values.patientCharacteristics.length < 3) {
                setValues(prev => ({
                    ...prev,
                    patientCharacteristics: [...prev.patientCharacteristics, item],
                }));
            }
        }
        setCharacteristicsSearchTerm("");
    }

    const handleClearPatientCharacteristic = (item) => {
        const newTags = values.patientCharacteristics.filter(tag => tag.id !== item.id);
        setValues(prev => ({
            ...prev,
            patientCharacteristics: newTags,
        }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/create/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success) {
                //Show success in Global Alert
                dispatch(setSuccess(data.message));
                navigate(`/user/chats/${data.body.id}`);
            } else {
                setLoading(false);
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
              message: error.message,
            });
            return;
        }
    }

    const filteredReasons = reasonsForVisit.filter(item =>
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 3);

    const filteredCharacteristics = patientCharacteristics.filter(item =>
        item.value.toLowerCase().includes(characteristicsSearchTerm.toLowerCase())
    ).slice(0, 3);

    return (
        <>
            <div className="mx-auto max-w-lg">
                <div>
                    <div className="text-center">
                        <img
                            className="mx-auto h-20 p-3.5 w-auto bg-gray-800 rounded-full"
                            src="/Dental_GLM_Logo.png"
                        />
                        <h2 className="mt-2 text-lg font-semibold leading-6 text-white">Generate a training patient</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        You can customise the generated patient by specifying a combination of the details given in the form below.
                    </p>
                </div>
                <ul role="list" className="mt-4 space-y-4">
                    <li key='ReasonForVisit'>
                        <div className="bg-gray-800 rounded-md px-4 py-4">
                            <div className="group relative flex text-left space-x-3 items-center">
                                <div className="flex-shrink-0">
                                    <span className='bg-indigo-600 inline-flex h-10 w-10 items-center justify-center rounded-lg'>
                                        <LightBulbIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-white">
                                        <a>
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            Reason For Visit
                                        </a>
                                    </div>
                                    <p className="text-sm text-gray-400">The reason why your patient will be visiting the dentist. Select only one that applies.</p>
                                </div>
                            </div>
                            <div className="mt-4 relative">
                                {Object.keys(values.reasonsForVisit).length === 0 ? (
                                    <>
                                        <input
                                            type="text"
                                            className="w-full p-2 px-3 text-sm rounded-lg block bg-gray-700 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                            placeholder="Reason for visit"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <div className="absolute z-10 w-full mt-1 bg-gray-700 text-gray-200 rounded-md shadow-lg py-1.5">
                                                {filteredReasons.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="p-2 px-3 cursor-pointer hover:bg-gray-600 text-sm"
                                                        onClick={() => handleReasonForVisitSelect(item)}
                                                    >
                                                        {item.value}
                                                    </div>
                                                ))}
                                                {filteredReasons.length >= 3 && (
                                                    <div className="px-3 text-xs text-gray-400 bg-gray-700 rounded-b-md">
                                                        Showing first 3 results. Please continue your search.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between p-2.5 px-3 text-gray-200 rounded-md text-sm bg-gray-700">
                                        <span>{values.reasonsForVisit.value}</span>
                                        <button onClick={handleClearReasonForVisit}>
                                            <XCircleIcon className="h-5 w-5 text-gray-200 hover:text-gray-300" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                    <li key='PatientCharacterisitcs'>
                        <div className="bg-gray-800 rounded-md px-4 py-4">
                            <div className="group relative flex text-left space-x-3 items-center">
                                <div className="flex-shrink-0">
                                    <span className='bg-indigo-600 inline-flex h-10 w-10 items-center justify-center rounded-lg'>
                                        <UserCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-white">
                                        <a>
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            Patient Characteristics
                                        </a>
                                    </div>
                                    <p className="text-sm text-gray-400">These are the emotions of your patient that will affect how they behave. Select up to three characteristics that apply.</p>
                                </div>
                            </div>
                            <div className="mt-4 relative">
                                <input
                                    type="text"
                                    className="w-full p-2 px-3 text-sm rounded-lg block bg-gray-700 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6"
                                    placeholder="Patient characteristics"
                                    value={characteristicsSearchTerm}
                                    onChange={(e) => setCharacteristicsSearchTerm(e.target.value)}
                                    disabled={values.patientCharacteristics.length >= 3}
                                />
                                {characteristicsSearchTerm && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-700 text-gray-200 rounded-md shadow-lg py-1.5">
                                        {filteredCharacteristics.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-2 px-3 cursor-pointer hover:bg-gray-600 text-sm"
                                                onClick={() => handlePatientCharacteristicsSelect(item)}
                                            >
                                                {item.value}
                                            </div>
                                        ))}
                                        {filteredCharacteristics.length >= 3 && (
                                            <div className="px-3 text-xs text-gray-400 bg-gray-700 rounded-b-md">
                                                Showing first 3 results. Please continue your search.
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {values.patientCharacteristics.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-2 px-3 rounded-md text-sm text-gray-200 bg-gray-700"
                                        >
                                            <span>{item.value}</span>
                                            <button onClick={() => handleClearPatientCharacteristic(item)}>
                                                <XCircleIcon className="h-5 w-5 text-gray-200 hover:text-gray-300 ml-1" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                {alert.status &&
                    <Alert className={'w-full mt-3'} alert={alert} />
                }
                <div className="mt-4 flex justify-center items-center">
                    {values.patientCharacteristics.length > 0 && Object.keys(values.reasonsForVisit).length > 0 && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center items-center rounded-md bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSubmit}
                        >
                            {loading &&
                                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            }
                            <span>Generate Patient</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default StartChat
