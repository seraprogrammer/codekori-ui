import React from "react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  children?: React.ReactNode;
}

export default function Settings({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  children,
}: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
          darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-purple-500 mr-2">●</span>
          Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <span className="mr-3">Dark Mode</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <div
                  className={`block w-14 h-8 rounded-full ${
                    darkMode ? "bg-purple-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    darkMode ? "transform translate-x-6" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
} 