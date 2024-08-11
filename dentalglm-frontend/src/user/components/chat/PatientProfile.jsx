import React from 'react'

function PatientProfile({ chat }) {
    return (
        <>
            <div className="w-full bg-gray-800 p-4 rounded-md flex">
                <div className={`flex items-center justify-center h-12 w-12 text-lg text-gray-900 font-semibold rounded-full`} style={{ backgroundColor: chat.systemProperties.colour }}>
                    {chat.systemProperties.initials}
                </div>
                <div className="group my-auto mx-2">
                    <div className='text-md font-medium text-gray-300'>{chat.patient.Patient_Name}</div>
                    <div className="flex">
                        <div className='text-sm font-medium text-gray-500'>{chat.patient.Patient_Age}, {chat.patient.Patient_Gender}</div>
                    </div>
                </div>
            </div>
            <div className='mt-4 text-sm space-y-2'>
                <h3 className="text-md font-medium text-gray-300 text-left">Reason for visit</h3>
                <div className="mt-2 w-full flex flex-col items-center overflow-hidden text-sm">
                    <span className="w-full border-t border-gray-800 text-gray-500 py-2 block transition duration-150">
                        {chat.patient.Reason_For_Visit}
                    </span>
                </div>
                <h3 className="text-md font-medium text-gray-300 text-left">Patient Emotional State</h3>
                <div className="mt-2 w-full flex flex-col items-center overflow-hidden text-sm">
                    <span className="w-full border-t border-gray-800 text-gray-500 py-2 block transition duration-150">
                        {chat.patient.Patient_Emotional_State}
                    </span>
                </div>
                <h3 className="text-md font-medium text-gray-300 text-left">Patient Characteristics</h3>
                <div className="mt-2 w-full flex flex-col items-center overflow-hidden text-sm">
                    <span className="w-full border-t border-gray-800 text-gray-500 py-2 block transition duration-150">
                        {chat.patient.Patient_Characteristics}
                    </span>
                </div>
                <h3 className="text-md font-medium text-gray-300 text-left">Patient Symptoms</h3>
                <div className="mt-2 w-full flex flex-col items-center overflow-hidden text-sm">
                    <span className="w-full border-t border-gray-800 text-gray-500 py-2 block transition duration-150">
                        {chat.patient.Patient_Symptoms}
                    </span>
                </div>
                <h3 className="text-md font-medium text-gray-300 text-left">Patient Medical History</h3>
                <div className="mt-2 w-full flex flex-col items-center overflow-hidden text-sm">
                    <span className="w-full border-t border-gray-800 text-gray-500 py-2 block transition duration-150">
                        {chat.patient.Patient_Medical_History}
                    </span>
                </div>
            </div>
        </>
    )
}

export default PatientProfile