import React from 'react';

export default function UdomLogo({ className = 'w-12 h-12', alt = 'University of Dodoma' }) {
    return (
        <img
            src="/images/udom-logo.png"
            alt={alt}
            className={`${className} object-contain shrink-0 bg-white rounded-full`}
            draggable={false}
        />
    );
}
