import React, { useEffect, useState } from "react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSelectModel: () => void;
  onClearHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  onSelectModel,
  onClearHistory,
}) => {
  const [hasHistory, setHasHistory] = useState(false);

  // Function to check for chat history
  const checkChatHistory = () => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setHasHistory(
          Array.isArray(parsedMessages) && parsedMessages.length > 0
        );
      } catch (error) {
        setHasHistory(false);
      }
    } else {
      setHasHistory(false);
    }
  };

  // Check if there's chat history in localStorage
  useEffect(() => {
    checkChatHistory();

    // Listen for storage events (including our custom one)
    const handleStorageChange = () => {
      checkChatHistory();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for our custom event
    const handleCustomEvent = () => {
      checkChatHistory();
    };

    window.addEventListener("storageChange", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storageChange", handleCustomEvent);
    };
  }, []);

  // Handle clear history with proper state update
  const handleClearHistory = () => {
    onClearHistory();
    // Force update our local state
    setTimeout(checkChatHistory, 100);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-4 z-50">
      <button
        onClick={handleClearHistory}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          darkMode
            ? `bg-red-600 text-white hover:bg-red-700 ${
                !hasHistory ? "opacity-50" : ""
              }`
            : `bg-red-100 text-red-700 hover:bg-red-200 ${
                !hasHistory ? "opacity-50" : ""
              }`
        }`}
        aria-label="Clear history"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={onSelectModel}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          darkMode
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        }`}
        aria-label="Change model"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
      </button>
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-lg transition-all duration-200 ${
          darkMode
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 102 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Header;
