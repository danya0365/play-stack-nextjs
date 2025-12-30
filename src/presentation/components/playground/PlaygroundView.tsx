"use client";

import {
    PlaygroundExample,
    playgroundExamples,
} from "@/src/data/master/playground";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { useState } from "react";

export function PlaygroundView() {
  const { layout } = useLayoutStore();
  const [selectedExample, setSelectedExample] = useState<PlaygroundExample>(
    playgroundExamples[0]
  );
  const [code, setCode] = useState(selectedExample.code);
  const [output, setOutput] = useState<string[]>([]);

  const categories = [
    { id: "basics", name: "Basics", icon: "📚" },
    { id: "2d", name: "2D Games", icon: "🎮" },
    { id: "3d", name: "3D Games", icon: "🎲" },
    { id: "multiplayer", name: "Multiplayer", icon: "🌐" },
  ];

  const handleSelectExample = (example: PlaygroundExample) => {
    setSelectedExample(example);
    setCode(example.code);
    setOutput([]);
  };

  const runCode = () => {
    setOutput([]);
    const logs: string[] = [];

    // Override console.log
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map((a) => String(a)).join(" "));
      originalLog(...args);
    };

    try {
      // Run the code (with eval for demo purposes)
      // In production, use a sandboxed iframe or Web Worker
      new Function(code)();
      setOutput(logs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setOutput([`❌ Error: ${message}`]);
    } finally {
      console.log = originalLog;
    }
  };

  if (layout === "retro") {
    return (
      <div className="retro-page flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="retro-groupbox mb-2">
          <span className="retro-groupbox-title">🎮 Code Playground</span>
          <p className="text-xs py-1">
            เลือกตัวอย่างโค้ดและกด Run เพื่อเรียนรู้!
          </p>
        </div>

        <div className="flex flex-1 gap-2 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0 retro-groupbox overflow-auto">
            <span className="retro-groupbox-title">📁 Examples</span>
            <div className="mt-2 space-y-1">
              {playgroundExamples.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExample(ex)}
                  className={`w-full text-left text-xs p-1 ${
                    selectedExample.id === ex.id
                      ? "bg-blue-900 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  {ex.icon} {ex.titleTh}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Info */}
            <div className="retro-groupbox mb-2 flex-shrink-0">
              <span className="retro-groupbox-title">
                {selectedExample.icon} {selectedExample.titleTh}
              </span>
              <div className="text-xs py-1">
                <p>{selectedExample.descriptionTh}</p>
                <p className="text-gray-500 mt-1">
                  🔧 {selectedExample.engine} | 📊{" "}
                  {selectedExample.difficulty.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="retro-groupbox flex-1 flex flex-col overflow-hidden">
              <span className="retro-groupbox-title">📝 Code</span>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-2 text-xs font-mono bg-black text-green-400 border-2 border-gray-600 resize-none"
                spellCheck={false}
              />
              <div className="mt-2 flex gap-2">
                <button onClick={runCode} className="retro-btn retro-btn-primary">
                  ▶️ Run
                </button>
                <button
                  onClick={() => setCode(selectedExample.code)}
                  className="retro-btn"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="retro-groupbox mt-2 flex-shrink-0 max-h-32 overflow-auto">
              <span className="retro-groupbox-title">📤 Output</span>
              <div className="text-xs font-mono p-1 bg-black text-white min-h-16">
                {output.length > 0 ? (
                  output.map((line, i) => <div key={i}>{line}</div>)
                ) : (
                  <span className="text-gray-500">
                    Click Run to see output...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎮 Code Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            เลือกตัวอย่างโค้ดและทดลองรันเพื่อเรียนรู้!
          </p>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 overflow-auto">
            {categories.map((cat) => {
              const catExamples = playgroundExamples.filter(
                (ex) => ex.category === cat.id
              );
              if (catExamples.length === 0) return null;

              return (
                <div key={cat.id} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {cat.icon} {cat.name}
                  </h3>
                  <div className="space-y-1">
                    {catExamples.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => handleSelectExample(ex)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          selectedExample.id === ex.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {ex.icon} {ex.titleTh}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Info Bar */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 mb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedExample.icon} {selectedExample.titleTh}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedExample.descriptionTh}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {selectedExample.engine}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${
                      selectedExample.difficulty === "easy"
                        ? "bg-green-100 text-green-700"
                        : selectedExample.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedExample.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
                <span className="text-sm text-gray-400">📝 Code Editor</span>
                <div className="flex gap-2">
                  <button
                    onClick={runCode}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    ▶️ Run
                  </button>
                  <button
                    onClick={() => setCode(selectedExample.code)}
                    className="px-4 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 text-sm font-mono bg-gray-900 text-gray-100 resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>

            {/* Output */}
            <div className="mt-4 flex-shrink-0">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-800">
                  <span className="text-sm text-gray-400">📤 Output</span>
                </div>
                <div className="p-4 font-mono text-sm min-h-24 max-h-32 overflow-auto">
                  {output.length > 0 ? (
                    output.map((line, i) => (
                      <div
                        key={i}
                        className={
                          line.startsWith("❌")
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        {line}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      Click Run to see output...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
