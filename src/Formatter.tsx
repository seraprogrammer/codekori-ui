import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
  vscDarkPlus,
  vs,
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeRaw from "rehype-raw";
import { Tooltip } from "react-tooltip";
import mermaid from "mermaid";

interface FormatterProps {
  content: string;
  darkMode: boolean;
  codeTheme?:
    | "oneDark"
    | "vscDarkPlus"
    | "materialDark"
    | "oneLight"
    | "vs"
    | "materialLight";
}

function Formatter({
  content,
  darkMode,
  codeTheme = darkMode ? "oneDark" : "oneLight",
}: FormatterProps) {
  const [sections, setSections] = useState<
    { type: "regular" | "think" | "mermaid"; content: string }[]
  >([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedCodeBlocks, setExpandedCodeBlocks] = useState<
    Record<string, boolean>
  >({});

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: darkMode ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "'Inter', sans-serif",
    });
  }, [darkMode]);

  useEffect(() => {
    // Parse the content to find <think> tags and mermaid diagrams
    const parseContent = () => {
      const result: {
        type: "regular" | "think" | "mermaid";
        content: string;
      }[] = [];

      // Simple string-based approach
      let remainingContent = content;
      let startIndex: number;
      let endIndex: number;

      // Process the content until no more <think> tags are found
      while (
        (startIndex = remainingContent.indexOf("<think>")) !== -1 &&
        (endIndex = remainingContent.indexOf("</think>", startIndex)) !== -1
      ) {
        // Add the content before the <think> tag
        if (startIndex > 0) {
          result.push({
            type: "regular",
            content: remainingContent.substring(0, startIndex),
          });
        }

        // Add the content inside the <think> tag
        const thinkContent = remainingContent.substring(
          startIndex + "<think>".length,
          endIndex
        );

        result.push({
          type: "think",
          content: thinkContent.trim(),
        });

        // Update the remaining content
        remainingContent = remainingContent.substring(
          endIndex + "</think>".length
        );
      }

      // Add any remaining content
      if (remainingContent) {
        result.push({
          type: "regular",
          content: remainingContent,
        });
      }

      setSections(result);
    };

    parseContent();
  }, [content]);

  // Render mermaid diagrams
  useEffect(() => {
    const mermaidDivs = document.querySelectorAll<HTMLElement>(".mermaid");
    if (mermaidDivs.length > 0) {
      try {
        mermaid.init(undefined, mermaidDivs);
      } catch (error) {
        console.error("Mermaid initialization error:", error);
      }
    }
  }, [sections]);

  // Get the appropriate syntax highlighting theme
  const getCodeTheme = () => {
    if (darkMode) {
      switch (codeTheme) {
        case "vscDarkPlus":
          return vscDarkPlus;
        case "materialDark":
          return materialDark;
        default:
          return oneDark;
      }
    } else {
      switch (codeTheme) {
        case "vs":
          return vs;
        case "materialLight":
          return materialLight;
        default:
          return oneLight;
      }
    }
  };

  // Enhanced styling for think sections
  const thinkSectionClass = `
    my-6 rounded-lg overflow-hidden
    ${
      darkMode
        ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 shadow-lg"
        : "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 shadow-md"
    }
  `;

  const thinkSummaryClass = `
    cursor-pointer p-3 flex items-center gap-2 font-medium
    ${
      darkMode
        ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/40 text-indigo-200 hover:text-indigo-100"
        : "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 hover:text-indigo-800"
    }
    transition-colors duration-200
  `;

  const thinkContentClass = `
    p-4 
    ${darkMode ? "text-gray-300" : "text-gray-700"}
  `;

  // Function to handle copying text to clipboard
  const handleCopyToClipboard = (text: string, index: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Toggle code block expansion
  const toggleCodeBlockExpansion = (codeContent: string) => {
    const codeHash = hashCode(codeContent);
    setExpandedCodeBlocks((prev) => ({
      ...prev,
      [codeHash]: !prev[codeHash],
    }));
  };

  // Add this helper function to create a stable hash from code content
  const hashCode = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };

  // Function to detect language from filename
  const detectLanguageFromFilename = (filename: string) => {
    if (!filename) return null;

    const extensions: Record<string, string> = {
      ".js": "javascript",
      ".jsx": "jsx",
      ".ts": "typescript",
      ".tsx": "tsx",
      ".py": "python",
      ".rb": "ruby",
      ".java": "java",
      ".c": "c",
      ".cpp": "cpp",
      ".cs": "csharp",
      ".go": "go",
      ".php": "php",
      ".html": "html",
      ".css": "css",
      ".scss": "scss",
      ".json": "json",
      ".md": "markdown",
      ".yml": "yaml",
      ".yaml": "yaml",
      ".sh": "bash",
      ".bash": "bash",
      ".sql": "sql",
      ".swift": "swift",
      ".kt": "kotlin",
      ".rs": "rust",
      ".dart": "dart",
    };

    const ext = Object.keys(extensions).find((ext) => filename.endsWith(ext));
    return ext ? extensions[ext] : null;
  };

  // Markdown component configuration
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)(:([^}]+))?/.exec(className || "");
      const codeContent = String(children).replace(/\n$/, "");
      const codeHash = hashCode(codeContent);
      const isExpanded = expandedCodeBlocks[codeHash];

      // Handle mermaid diagrams
      if (match && match[1] === "mermaid") {
        return (
          <div className="mermaid my-4 p-4 rounded-lg overflow-hidden bg-opacity-10 bg-gray-200">
            {codeContent}
          </div>
        );
      }

      // Extract language and filename if present
      let language = match ? match[1] : "";
      let filename = match && match[3] ? match[3].trim() : "";

      // If language is not specified but filename is, try to detect language from filename
      if (!language && filename) {
        const detectedLanguage = detectLanguageFromFilename(filename);
        if (detectedLanguage) language = detectedLanguage;
      }

      // Handle regular code blocks
      if (!inline && (match || filename)) {
        const isLongCode = codeContent.split("\n").length > 15;
        const displayedCode =
          isLongCode && !isExpanded
            ? codeContent.split("\n").slice(0, 15).join("\n") +
              "\n// ... more lines ..."
            : codeContent;

        // Get language display name
        const getLanguageDisplayName = () => {
          if (language === "js" || language === "javascript")
            return "JavaScript";
          if (language === "ts" || language === "typescript")
            return "TypeScript";
          if (language === "jsx") return "JSX";
          if (language === "tsx") return "TSX";
          if (language === "py" || language === "python") return "Python";
          if (language === "rb" || language === "ruby") return "Ruby";
          if (language === "cpp") return "C++";
          if (language === "c") return "C";
          if (language === "cs") return "C#";
          if (language === "java") return "Java";
          if (language === "go") return "Go";
          if (language === "php") return "PHP";
          if (language === "html") return "HTML";
          if (language === "css") return "CSS";
          if (language === "scss") return "SCSS";
          if (language === "json") return "JSON";
          if (language === "md" || language === "markdown") return "Markdown";
          if (language === "bash" || language === "sh") return "Bash";
          if (language === "sql") return "SQL";
          if (language === "swift") return "Swift";
          if (language === "kotlin") return "Kotlin";
          if (language === "rust") return "Rust";
          if (language === "dart") return "Dart";
          return language.charAt(0).toUpperCase() + language.slice(1);
        };

        return (
          <div className="relative group my-6 rounded-md overflow-hidden border border-gray-700 shadow-lg">
            {/* Code editor header with macOS-style buttons */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-gray-700">
              <div className="flex items-center">
                {/* Traffic light buttons */}
                <div className="flex space-x-1.5 mr-3">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                </div>
                {/* Language or filename */}
                <span className="text-xs text-gray-400 font-mono">
                  {filename || getLanguageDisplayName() || "Code"}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {isLongCode && (
                  <button
                    onClick={() => toggleCodeBlockExpansion(codeContent)}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                    data-tooltip-id="code-tooltip"
                    data-tooltip-content={
                      isExpanded ? "Collapse code" : "Expand code"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isExpanded ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      )}
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleCopyToClipboard(codeContent, codeHash)}
                  className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                  data-tooltip-id="copy-tooltip"
                  data-tooltip-content={
                    copiedIndex === codeHash ? "Copied!" : "Copy code"
                  }
                >
                  {copiedIndex === codeHash ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Code content with improved styling */}
            <SyntaxHighlighter
              style={getCodeTheme()}
              language={language}
              PreTag="div"
              showLineNumbers={true}
              wrapLines={true}
              customStyle={{
                margin: 0,
                padding: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                fontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
                backgroundColor: "#282c34",
                borderRadius: 0,
              }}
              lineNumberStyle={{
                minWidth: "2em",
                paddingRight: "1em",
                color: "#636d83",
                textAlign: "right",
                userSelect: "none",
                borderRight: "1px solid #3e4451",
                marginRight: "0.5em",
              }}
              {...props}
            >
              {displayedCode}
            </SyntaxHighlighter>

            {/* Show more button */}
            {isLongCode && !isExpanded && (
              <div
                className="text-center py-1.5 cursor-pointer bg-[#1e1e1e] text-blue-400 hover:bg-[#252525] transition-colors duration-200 text-xs border-t border-gray-700"
                onClick={() => toggleCodeBlockExpansion(codeContent)}
              >
                Show more
              </div>
            )}
          </div>
        );
      }

      // Inline code
      return (
        <code
          className={`${className} ${
            darkMode ? "bg-[#2a2a2a]" : "bg-gray-100"
          } px-2 py-0.5 rounded-md font-mono text-sm border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } shadow-sm`}
          style={{
            fontFamily: "'Consolas', 'Menlo', monospace",
            wordBreak: "break-word",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold my-4 pb-2 border-b border-gray-300 dark:border-gray-700">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-bold my-3 pb-1 border-b border-gray-200 dark:border-gray-800">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-bold my-2">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="my-2 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-6 my-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-6 my-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => <li className="my-1">{children}</li>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        className={`${
          darkMode
            ? "text-blue-400 hover:text-blue-300"
            : "text-blue-600 hover:text-blue-700"
        } underline transition-colors duration-200`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }: any) => (
      <blockquote
        className={`border-l-4 ${
          darkMode
            ? "border-gray-600 bg-gray-800/50"
            : "border-gray-300 bg-gray-50"
        } pl-4 py-1 my-2 italic`}
      >
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table
          className={`min-w-full ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } border rounded-lg`}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr
        className={`${
          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
        } transition-colors duration-150`}
      >
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th
        className={`px-4 py-2 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } border text-left font-medium`}
      >
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td
        className={`px-4 py-2 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } border`}
      >
        {children}
      </td>
    ),
    hr: () => (
      <hr
        className={`my-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      />
    ),
    img: ({ src, alt }: any) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto my-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        loading="lazy"
      />
    ),
    pre: ({ children }: any) => (
      <pre className="my-4 rounded-lg overflow-hidden">{children}</pre>
    ),
  };

  return (
    <div className={`markdown-body ${darkMode ? "dark" : "light"}`}>
      {sections.map((section, index) =>
        section.type === "regular" ? (
          <ReactMarkdown
            key={`section-${index}`}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={markdownComponents}
          >
            {section.content}
          </ReactMarkdown>
        ) : (
          <details key={`think-${index}`} className={thinkSectionClass}>
            <summary className={thinkSummaryClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span>Reasoning Process</span>
            </summary>
            <div className={thinkContentClass}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={markdownComponents}
              >
                {section.content}
              </ReactMarkdown>
            </div>
          </details>
        )
      )}
      <Tooltip id="copy-tooltip" />
      <Tooltip id="code-tooltip" />
    </div>
  );
}

export default Formatter;
