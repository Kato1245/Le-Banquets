// src/shared/components/ClinkingGlasses.jsx
import React from 'react';

const ClinkingGlasses = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size] || sizeClasses.md}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full fill-none stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Left Glass */}
        <g className="animate-toast-left">
          <path d="M35,30 L45,30 L45,60 C45,65 40,70 35,70 L35,70 C30,70 25,65 25,60 L25,30 Z" />
          <path d="M35,70 L35,85" />
          <path d="M28,85 L42,85" />
          {/* Liquid */}
          <path d="M25,45 Q35,40 45,45 L45,60 C45,65 40,70 35,70 C30,70 25,65 25,60 Z" fill="currentColor" fillOpacity="0.2" stroke="none" />
        </g>

        {/* Right Glass */}
        <g className="animate-toast-right">
          <path d="M65,30 L55,30 L55,60 C55,65 60,70 65,70 L65,70 C70,70 75,65 75,60 L75,30 Z" />
          <path d="M65,70 L65,85" />
          <path d="M58,85 L72,85" />
          {/* Liquid */}
          <path d="M75,45 Q65,40 55,45 L55,60 C55,65 60,70 65,70 C70,70 75,65 75,60 Z" fill="currentColor" fillOpacity="0.2" stroke="none" />
        </g>

        {/* Bubbles/Sparkles on impact */}
        <g className="animate-toast-sparkle opacity-0">
          <circle cx="50" cy="30" r="2" fill="currentColor" />
          <circle cx="45" cy="25" r="1.5" fill="currentColor" />
          <circle cx="55" cy="25" r="1.5" fill="currentColor" />
        </g>
      </svg>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toast-left {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          50% { transform: rotate(-15deg) translateX(-5px); }
          55% { transform: rotate(10deg) translateX(2px); }
        }
        @keyframes toast-right {
          0%, 100% { transform: rotate(0deg) translateX(0px); }
          50% { transform: rotate(15deg) translateX(5px); }
          55% { transform: rotate(-10deg) translateX(-2px); }
        }
        @keyframes toast-sparkle {
          0%, 45%, 100% { opacity: 0; transform: scale(0.5) translateY(10px); }
          50%, 60% { opacity: 1; transform: scale(1.2) translateY(0px); }
        }
        .animate-toast-left {
          animation: toast-left 1.5s ease-in-out infinite;
          transform-origin: 35px 85px;
        }
        .animate-toast-right {
          animation: toast-right 1.5s ease-in-out infinite;
          transform-origin: 65px 85px;
        }
        .animate-toast-sparkle {
          animation: toast-sparkle 1.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default ClinkingGlasses;
