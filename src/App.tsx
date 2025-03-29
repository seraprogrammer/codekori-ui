import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Form from "./Form"; // Import the Form component
import Header from "./Header"; // Import the Header component
import Formatter from "./Formatter"; // Import the Formatter component
import Models from "./Models"; // Import the new Models component
import Welcome from "./welcome"; // Import the Welcome component

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ModelOption {
  provider: string;
  model: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelOption>({
    provider: "Glider",
    model: "chat-llama-3-1-70b",
  });
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        // If there's an error parsing, clear the corrupted data
        localStorage.removeItem("chatMessages");
      }
    }

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolledUp =
        window.innerHeight + window.scrollY < document.body.offsetHeight - 100;
      setShowScrollButton(isScrolledUp);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add this function to sync messages with localStorage
  const syncMessagesToLocalStorage = (msgs: Message[]) => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(msgs));
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  };

  // Update the clearHistory function
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages([]);
      localStorage.removeItem("chatMessages");
      // Dispatch a custom event that Header will listen for
      window.dispatchEvent(new Event("storageChange"));
    }
  };

  // Update the handleSubmit function to ensure messages are saved
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    syncMessagesToLocalStorage(newMessages); // Save immediately after user message
    setInput("");
    setIsLoading(true);

    // Add a placeholder for the assistant's response
    const placeholderIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    // Start timing the response
    const startTime = Date.now();

    try {
      const response = await fetch(
        "https://olova-research-server.onrender.com/api/get_response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: selectedModel.provider,
            model: selectedModel.model,
            message: input,
            stream: true, // Request streaming if available
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode the chunk and add to accumulated content
          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          // Update the message with the accumulated content
          setMessages((prev) => {
            // Create a new array to avoid reference issues
            const updated = [...prev];
            if (updated.length > placeholderIndex) {
              updated[placeholderIndex] = {
                role: "assistant",
                content: accumulatedContent,
              };
            }
            return updated;
          });

          // Update response time
          setResponseTime(Date.now() - startTime);
        }
      } else {
        // Fallback for non-streaming response
        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
          try {
            responseData = await response.json();
          } catch (jsonError) {
            const textResponse = await response.text();
            responseData = { response: textResponse };
          }
        } else {
          const textResponse = await response.text();
          responseData = { response: textResponse };
        }

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > placeholderIndex) {
            updated[placeholderIndex] = {
              role: "assistant",
              content:
                responseData.response || "Sorry, I couldn't get a response.",
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > placeholderIndex) {
          updated[placeholderIndex] = {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      // Final response time update
      setResponseTime(Date.now() - startTime);
      // Ensure the final state of messages is saved
      setMessages((currentMessages) => {
        syncMessagesToLocalStorage(currentMessages);
        return currentMessages;
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get flat list of model names for the Form component
  const modelNames = [`${selectedModel.provider} - ${selectedModel.model}`];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-[#121212] text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onSelectModel={() => {
          setShowModelSelector(!showModelSelector);
        }}
        onClearHistory={clearHistory}
      />

      {/* Chat container */}
      <div className="flex-1 container mx-auto p-4 overflow-auto pb-32 relative">
        <div className="max-w-3xl mx-auto h-full">
          {showModelSelector && (
            <div className="mb-6">
              <Models
                selectedModel={selectedModel}
                onSelectModel={(model) => {
                  setSelectedModel(model);
                  setShowModelSelector(false);
                }}
                darkMode={darkMode}
              />
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh-240px)]">
              <Welcome
                darkMode={darkMode}
                modelProvider={selectedModel.provider}
                modelName={selectedModel.model}
              />
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.role === "user" ? "mb-8" : "mb-10"}`}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        message.role === "user"
                          ? darkMode
                            ? "bg-purple-700"
                            : "bg-purple-100"
                          : darkMode
                          ? "bg-blue-700"
                          : "bg-blue-100"
                      }`}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </p>
                      <div
                        className={`mt-1 prose ${
                          darkMode ? "prose-invert" : ""
                        } max-w-none`}
                      >
                        {message.role === "assistant" ? (
                          message.content ? (
                            <Formatter
                              content={message.content}
                              darkMode={darkMode}
                            />
                          ) : isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-pulse">Thinking...</div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className={`fixed bottom-24 right-8 p-3 rounded-full shadow-lg ${
                    darkMode
                      ? "bg-gray-800 text-blue-400"
                      : "bg-white text-blue-600"
                  } hover:opacity-90 transition-opacity z-10`}
                  aria-label="Scroll to bottom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Form component */}
      <Form
        message={input}
        setMessage={setInput}
        handleSubmit={handleSubmit}
        loading={isLoading}
        selectedModel={`${selectedModel.provider.replace(
          /_/g,
          " "
        )} - ${selectedModel.model.replace(/_/g, " ")}`}
        setSelectedModel={() => {
          // This is now empty since Models component handles selection
        }}
        models={modelNames}
        darkMode={darkMode}
        responseTime={responseTime}
      />
    </div>
  );
}

export default App;
