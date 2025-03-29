import React from "react";

interface FormProps {
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  darkMode: boolean;
  responseTime: number | null;
  selectedModel?: string;
  setSelectedModel?: () => void;
  models?: string[];
}

function Form({
  message,
  setMessage,
  handleSubmit,
  loading,
  darkMode,
  responseTime,
}: FormProps) {
  // Calculate and display response time in real-time when loading
  const [currentTime, setCurrentTime] = React.useState<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    // Use number type instead of NodeJS.Timeout
    let intervalId: number | null = null;

    if (loading) {
      // Set the start time when loading begins
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      // Update the current time every 10ms while loading
      intervalId = window.setInterval(() => {
        setCurrentTime(Date.now() - (startTimeRef.current || 0));
      }, 10);
    } else {
      // Reset the start time when loading ends
      startTimeRef.current = null;
      setCurrentTime(null);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [loading]);

  // Format time to show seconds and milliseconds in a cleaner format
  const formatTime = (timeMs: number): string => {
    if (timeMs < 1000) {
      // Less than a second, just show milliseconds
      return `${timeMs}ms`;
    } else {
      // More than a second, show seconds with one decimal place
      const seconds = (timeMs / 1000).toFixed(1);
      return `${seconds}s`;
    }
  };

  // Display either the real-time counter or the final response time
  const displayTime = loading ? currentTime : responseTime;

  return (
    <div
      className={`sticky bottom-0 w-full py-4 ${
        darkMode ? "bg-[#121212]" : "bg-white"
      } border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div
              className={`flex items-center rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-300 bg-white"
              } overflow-hidden`}
            >
              <div className="flex-1 relative">
                {displayTime !== null && (
                  <div
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {formatTime(displayTime)}
                  </div>
                )}
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything..."
                  className={`w-full h-full px-4 ${
                    displayTime !== null ? "pl-14" : "pl-4"
                  } py-3 outline-none ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className={`px-4 py-3 font-medium ${
                  loading || !message.trim()
                    ? darkMode
                      ? "text-gray-500"
                      : "text-gray-400"
                    : darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
