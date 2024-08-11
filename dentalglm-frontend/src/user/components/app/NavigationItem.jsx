import React from 'react'

function NavigationItem({ item, isCurrent }) {
    return (
        <li key={item.name}>
            <a
                href={item.href}
                className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isCurrent ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
                <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                {item.name}
            </a>
        </li>
    )
}

export default NavigationItem