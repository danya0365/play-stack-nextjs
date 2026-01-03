"use client";

import { useCallback, useRef, useState } from "react";

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  title?: string;
  description?: string;
  expectedOutput?: string;
  hints?: string[];
  onComplete?: () => void;
}

export function CodeEditor({
  initialCode,
  language = "javascript",
  title,
  description,
  expectedOutput,
  hints = [],
  onComplete,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHints, setShowHints] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync line numbers with scroll
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Calculate line numbers
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Run code safely
  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput([]);
    setIsCorrect(null);

    const logs: string[] = [];
    const originalConsole = { ...console };

    // Override console.log
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map(arg => 
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" "));
      },
      error: (...args: unknown[]) => {
        logs.push(`❌ Error: ${args.join(" ")}`);
      },
      warn: (...args: unknown[]) => {
        logs.push(`⚠️ Warning: ${args.join(" ")}`);
      },
    };

    try {
      // Create a safe execution context
      const executeCode = new Function(
        "console",
        `
        try {
          ${code}
        } catch (e) {
          console.error(e.message);
        }
        `
      );

      executeCode(customConsole);

      setOutput(logs);

      // Check if output matches expected
      if (expectedOutput) {
        const outputStr = logs.join("\n").trim();
        const isMatch = outputStr.includes(expectedOutput.trim());
        setIsCorrect(isMatch);
        if (isMatch && onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      setOutput([`❌ Error: ${(error as Error).message}`]);
      setIsCorrect(false);
    } finally {
      setIsRunning(false);
      Object.assign(console, originalConsole);
    }
  }, [code, expectedOutput, onComplete]);

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Reset code
  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setIsCorrect(null);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400">
            {title || `${language} Editor`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded transition-colors"
          >
            🔄 Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
          >
            {isRunning ? "⏳ Running..." : "▶️ Run"}
          </button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      )}

      {/* Code Editor */}
      <div className="relative flex">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 w-12 bg-slate-800/50 text-right pr-3 py-4 text-gray-500 text-sm font-mono select-none overflow-hidden"
          style={{ height: "300px" }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">{num}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none leading-6"
          style={{ height: "300px" }}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {output.length > 0 && (
        <div className="border-t border-slate-700">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
            <span className="text-sm text-gray-400">📤 Output</span>
            {isCorrect !== null && (
              <span className={`text-sm ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {isCorrect ? "✅ Correct!" : "❌ Try again"}
              </span>
            )}
          </div>
          <div className="p-4 bg-black/30 font-mono text-sm max-h-48 overflow-auto">
            {output.map((line, i) => (
              <div key={i} className="text-gray-300 whitespace-pre-wrap">{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && (
        <div className="border-t border-slate-700">
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-gray-300 bg-slate-800/50"
          >
            💡 {showHints ? "Hide Hints" : "Show Hints"} ({hints.length})
          </button>
          {showHints && (
            <div className="p-4 bg-slate-800/30">
              <ul className="space-y-2">
                {hints.map((hint, i) => (
                  <li key={i} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-yellow-500">💡</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Success message */}
      {isCorrect && (
        <div className="px-4 py-3 bg-green-900/30 border-t border-green-500/30">
          <div className="flex items-center gap-2 text-green-400">
            <span className="text-xl">🎉</span>
            <span className="font-semibold">ยอดเยี่ยม! คุณทำถูกต้อง!</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick code sandbox for simple examples
export function CodeSandbox({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <CodeEditor
      initialCode={code}
      language={language}
      title="Try it yourself"
    />
  );
}
