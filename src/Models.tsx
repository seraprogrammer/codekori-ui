import React from "react";

interface ModelOption {
  provider: string;
  model: string;
}

interface ModelsProps {
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  darkMode: boolean;
}

const Models: React.FC<ModelsProps> = ({
  selectedModel,
  onSelectModel,
  darkMode,
}) => {
  const modelOptions: ModelOption[] = [
    {
      provider: "DeepInfraChat",
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    },
    {
      provider: "DeepInfraChat",
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    },
    { provider: "DeepInfraChat", model: "meta-llama/Llama-3.3-70B-Instruct" },
    { provider: "DeepInfraChat", model: "deepseek-ai/DeepSeek-V3" },
    {
      provider: "DeepInfraChat",
      model: "mistralai/Mistral-Small-24B-Instruct-2501",
    },
    { provider: "DeepInfraChat", model: "deepseek-ai/DeepSeek-R1" },
    { provider: "DeepInfraChat", model: "deepseek-ai/DeepSeek-R1-Turbo" },
    {
      provider: "DeepInfraChat",
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
    },
    {
      provider: "DeepInfraChat",
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    },
    { provider: "DeepInfraChat", model: "microsoft/phi-4" },
    { provider: "DeepInfraChat", model: "microsoft/WizardLM-2-8x22B" },
    { provider: "DeepInfraChat", model: "Qwen/Qwen2.5-72B-Instruct" },
    { provider: "DeepInfraChat", model: "01-ai/Yi-34B-Chat" },
    { provider: "DeepInfraChat", model: "Qwen/Qwen2-72B-Instruct" },
    {
      provider: "DeepInfraChat",
      model: "cognitivecomputations/dolphin-2.6-mixtral-8x7b",
    },
    {
      provider: "DeepInfraChat",
      model: "cognitivecomputations/dolphin-2.9.1-llama-3-70b",
    },
    { provider: "DeepInfraChat", model: "databricks/dbrx-instruct" },
    { provider: "DeepInfraChat", model: "deepinfra/airoboros-70b" },
    { provider: "DeepInfraChat", model: "lizpreciatior/lzlv_70b_fp16_hf" },
    { provider: "DeepInfraChat", model: "microsoft/WizardLM-2-7B" },
    {
      provider: "DeepInfraChat",
      model: "mistralai/Mixtral-8x22B-Instruct-v0.1",
    },
    { provider: "DeepInfraChat", model: "openbmb/MiniCPM-Llama3-V-2_5" },
    {
      provider: "DeepInfraChat",
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct",
    },
    { provider: "Glider", model: "chat-llama-3-1-70b" },
    { provider: "Glider", model: "chat-llama-3-1-8b" },
    { provider: "Glider", model: "chat-llama-3-2-3b" },
    { provider: "Glider", model: "deepseek-ai/DeepSeek-R1" },
    { provider: "Dynaspark", model: "DynaSpark" },
    // Qwen models
    { provider: "Qwen_Qwen_2_5_Max", model: "Qwen_QVQ_72B" },
    { provider: "Qwen_Qwen_2_5_Max", model: "Qwen_Qwen_2_5" },
    { provider: "Qwen_Qwen_2_5_Max", model: "Qwen_Qwen_2_5_Max" },
    { provider: "Qwen_Qwen_2_5_Max", model: "Qwen_Qwen_2_5M" },
    { provider: "Qwen_Qwen_2_5_Max", model: "Qwen_Qwen_2_72B" },

    // Blackbox models
    { provider: "Blackbox", model: "blackboxai-pro" },
    { provider: "Blackbox", model: "gpt-4o-mini" },
    { provider: "Blackbox", model: "GPT-4o" },
    { provider: "Blackbox", model: "o1" },
    { provider: "Blackbox", model: "o3-mini" },
    { provider: "Blackbox", model: "Claude-sonnet-3.7" },
    { provider: "Blackbox", model: "DeepSeek-V3" },
    { provider: "Blackbox", model: "DeepSeek-R1" },
    { provider: "Blackbox", model: "DeepSeek-LLM-Chat-(67B)" },
    { provider: "Blackbox", model: "flux" },
    { provider: "Blackbox", model: "Python Agent" },
    { provider: "Blackbox", model: "HTML Agent" },
    { provider: "Blackbox", model: "Builder Agent" },
    { provider: "Blackbox", model: "Java Agent" },
    { provider: "Blackbox", model: "JavaScript Agent" },
    { provider: "Blackbox", model: "React Agent" },
    { provider: "Blackbox", model: "Android Agent" },
    { provider: "Blackbox", model: "Flutter Agent" },
    { provider: "Blackbox", model: "Next.js Agent" },
    { provider: "Blackbox", model: "AngularJS Agent" },
    { provider: "Blackbox", model: "Swift Agent" },
    { provider: "Blackbox", model: "MongoDB Agent" },
    { provider: "Blackbox", model: "PyTorch Agent" },
    { provider: "Blackbox", model: "Xcode Agent" },
    { provider: "Blackbox", model: "Azure Agent" },
    { provider: "Blackbox", model: "Bitbucket Agent" },
    { provider: "Blackbox", model: "DigitalOcean Agent" },
    { provider: "Blackbox", model: "Docker Agent" },
    { provider: "Blackbox", model: "Electron Agent" },
    { provider: "Blackbox", model: "Erlang Agent" },
    { provider: "Blackbox", model: "FastAPI Agent" },
    { provider: "Blackbox", model: "Firebase Agent" },
    { provider: "Blackbox", model: "Flask Agent" },
    { provider: "Blackbox", model: "Git Agent" },
    { provider: "Blackbox", model: "Gitlab Agent" },
    { provider: "Blackbox", model: "Go Agent" },
    { provider: "Blackbox", model: "Godot Agent" },
    { provider: "Blackbox", model: "Google Cloud Agent" },
    { provider: "Blackbox", model: "Heroku Agent" },

    // Copilot models
    { provider: "Copilot", model: "gpt-4o-mini" },
    { provider: "Copilot", model: "gpt-4o" },

    // Cohere models
    { provider: "CohereForAI_C4AI", model: "command-r-plus" },
    { provider: "CohereForAI_C4AI", model: "command-r" },
  ];

  // Make sure all model entries have valid provider and model values
  const filteredModelOptions: ModelOption[] = modelOptions.filter(
    (option) =>
      typeof option.provider === "string" &&
      typeof option.model === "string" &&
      option.provider.trim() !== "" &&
      option.model.trim() !== ""
  );

  // Group models by provider
  const groupedModels: { [key: string]: ModelOption[] } = {};
  filteredModelOptions.forEach((option) => {
    if (!groupedModels[option.provider]) {
      groupedModels[option.provider] = [];
    }
    groupedModels[option.provider].push(option);
  });

  // State for search and expanded providers
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedProviders, setExpandedProviders] = React.useState<string[]>(
    []
  );

  // Toggle provider expansion
  const toggleProvider = (provider: string) => {
    setExpandedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  // Filter models based on search term
  const filteredProviders = Object.entries(groupedModels).filter(
    ([provider, models]) => {
      if (searchTerm === "") return true;

      const searchTermLower = searchTerm.toLowerCase();

      // Check if provider name matches search
      if (provider.toLowerCase().includes(searchTermLower)) return true;

      // Check if any model name matches search
      return models.some((model) => {
        const modelName = model.model.toLowerCase();

        // Check for exact matches
        if (modelName.includes(searchTermLower)) return true;

        // Check for partial matches with model name parts
        const modelParts = modelName.split(/[-\s/_.]/);
        if (modelParts.some((part) => part.includes(searchTermLower)))
          return true;

        // Check for acronym matches (e.g., "gpt" matches "GPT-4o")
        if (searchTermLower.length >= 2) {
          const modelAcronym = modelParts
            .map((part) => part.charAt(0))
            .join("")
            .toLowerCase();
          if (modelAcronym.includes(searchTermLower)) return true;
        }

        return false;
      });
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-5 ${
          darkMode ? "bg-[#1D1E23]" : "bg-[#1D1E23]"
        } rounded-xl max-h-[80vh] max-w-4xl w-full mx-4 overflow-hidden flex flex-col shadow-xl border border-gray-700 relative`}
      >
        <button
          onClick={() => onSelectModel(selectedModel)}
          className="absolute top-3 right-3 p-1 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          aria-label="Close model selector"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex items-center justify-between mb-5">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by model name, provider, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-grow custom-scrollbar pr-1">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-300">
                No models found
              </h3>
              <p className="mt-1 text-gray-400">
                Try different keywords or check spelling
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map(([provider, models]) => {
                const isExpanded =
                  expandedProviders.includes(provider) ||
                  (searchTerm.length > 0 && searchTerm.length < 15);
                const filteredModels = searchTerm
                  ? models.filter((model) =>
                      model.model
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                  : models;

                return (
                  <div
                    key={provider}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-blue-900/20"
                  >
                    <button
                      onClick={() => toggleProvider(provider)}
                      className="w-full px-4 py-3 flex items-center justify-between text-gray-200 hover:bg-gray-750 transition-colors duration-200"
                    >
                      <h4 className="text-md font-medium flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-blue-600 text-xs text-white font-semibold">
                          {filteredModels.length}
                        </span>
                        <span className="text-blue-300">
                          {provider.replace(/_/g, " ")}
                        </span>
                      </h4>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-3">
                          {isExpanded ? "Hide" : "Show"}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isExpanded ? "transform rotate-180" : ""
                          } text-gray-400`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-gray-850 transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {filteredModels.map((model) => (
                            <button
                              key={`${model.provider}-${model.model}`}
                              className={`p-3 rounded-lg text-left text-sm transition-all duration-200 ${
                                selectedModel.provider === model.provider &&
                                selectedModel.model === model.model
                                  ? "bg-blue-600 text-white shadow-lg border border-blue-500"
                                  : "bg-gray-750 text-gray-300 hover:bg-gray-700 hover:shadow-md border border-gray-700 hover:border-gray-600"
                              }`}
                              onClick={() => onSelectModel(model)}
                            >
                              <div className="truncate font-medium">
                                {model.model.replace(/_/g, " ")}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Models;
