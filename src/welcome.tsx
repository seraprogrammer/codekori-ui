import React from "react";

interface WelcomeProps {
  darkMode: boolean;
  modelProvider: string;
  modelName: string;
}

export default function Welcome({ darkMode, modelName }: WelcomeProps) {
  // State to store current time components separately
  const [hours, setHours] = React.useState<string>("");
  const [minutes, setMinutes] = React.useState<string>("");
  const [seconds, setSeconds] = React.useState<string>("");
  const [ampm, setAmPm] = React.useState<string>("");

  // Update time when component mounts
  React.useEffect(() => {
    // Function to update time
    const updateTime = () => {
      const now = new Date();

      // Format hours (12-hour format)
      let hours = now.getHours() % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      setHours(hours.toString());

      // Format minutes with leading zero
      setMinutes(now.getMinutes().toString().padStart(2, "0"));

      // Format seconds with leading zero
      setSeconds(now.getSeconds().toString().padStart(2, "0"));

      // Set AM/PM
      setAmPm(now.getHours() >= 12 ? "PM" : "AM");
    };

    // Update immediately
    updateTime();

    // Set interval to update every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className={`w-full max-w-5xl ${
        darkMode
          ? "backdrop-blur-md border border-white/10"
          : "border border-gray-200 bg-white/80"
      } rounded-2xl overflow-hidden shadow-2xl`}
    >
      <div
        className={`p-6 ${
          darkMode ? "border-b border-white/10" : "border-b border-gray-200"
        } flex flex-col md:flex-row justify-between items-center gap-4`}
      >
        <div className="flex items-center">
          <div>
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              AI Assistant
            </h3>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-500"
              } text-sm`}
            >
              Ready to help
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 ${
              darkMode
                ? "bg-[#1A1A1A] border-gray-800"
                : "bg-gray-100 border-gray-300"
            } rounded-lg border`}
          >
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Model
            </p>
            <p className="text-sm text-blue-400 truncate max-w-[150px]">
              {modelName.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center justify-center text-center">
        <div
          className={`text-xl ${
            darkMode ? "text-green-400" : "text-green-600"
          } mb-2 flex items-center`}
        >
          <span>
            {hours}:{minutes}:
          </span>
          <span className="inline-block min-w-[2ch] text-center">
            {seconds}
          </span>
          <span> {ampm}</span>
        </div>

        <h2
          className={`text-2xl md:text-3xl font-medium ${
            darkMode ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          {getGreeting()}!
        </h2>

        <div className="mb-4">
          <h1 className="text-4xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">
            Welcome to Codekori!
          </h1>
        </div>

        <p
          className={`text-xl ${
            darkMode ? "text-green-400" : "text-green-600"
          } mb-4`}
        >
          Ramadan Mubarak! 🌙
        </p>

        <p
          className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Ask anything, explore knowledge, and get insights in real-time.
        </p>
      </div>
    </div>
  );
}
