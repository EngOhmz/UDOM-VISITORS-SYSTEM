import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function PasswordInput({ className = '', leftIcon: LeftIcon, ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            {LeftIcon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            )}
            <input
                {...props}
                type={show ? 'text' : 'password'}
                className={`${LeftIcon ? 'pl-10' : ''} pr-10 ${className}`}
            />
            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
                aria-label={show ? 'Hide password' : 'Show password'}
            >
                {show ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
            </button>
        </div>
    );
}
