import React from "react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  clearPromptHistory: () => void;
  clearChatHistory: () => void;
  promptHistoryCount: number;
  chatHistoryCount: number;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  clearPromptHistory,
  clearChatHistory,
  promptHistoryCount,
  chatHistoryCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-md p-6 mx-4 rounded-lg shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                darkMode ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                  darkMode ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Data Management Section */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Data Management
            </h3>

            {/* Clear Prompt History */}
            <div className="flex justify-between items-center">
              <div>
                <p
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Clear Prompt History
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {promptHistoryCount} saved prompts
                </p>
              </div>
              <button
                onClick={clearPromptHistory}
                disabled={promptHistoryCount === 0}
                className={`px-3 py-1 rounded ${
                  promptHistoryCount > 0
                    ? darkMode
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Clear
              </button>
            </div>

            {/* Clear Chat History */}
            <div className="flex justify-between items-center">
              <div>
                <p
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Clear Chat History
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {chatHistoryCount} messages
                </p>
              </div>
              <button
                onClick={clearChatHistory}
                disabled={chatHistoryCount === 0}
                className={`px-3 py-1 rounded ${
                  chatHistoryCount > 0
                    ? darkMode
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
