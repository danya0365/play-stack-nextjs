"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
}

export function CodeBlock({ code, language = "javascript", title, description }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4">
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">{language}</span>
            <button
              onClick={copyCode}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
      <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm ${title ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code>{code.trim()}</code>
      </pre>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{description}</p>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

interface TipBoxProps {
  type?: "tip" | "warning" | "info" | "success";
  children: ReactNode;
}

export function TipBox({ type = "tip", children }: TipBoxProps) {
  const styles = {
    tip: "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200",
    info: "bg-gray-50 dark:bg-gray-800 border-gray-500 text-gray-800 dark:text-gray-200",
    success: "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200",
  };

  const icons = {
    tip: "💡",
    warning: "⚠️",
    info: "ℹ️",
    success: "✅",
  };

  return (
    <div className={`border-l-4 p-4 my-4 rounded-r-lg ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{icons[type]}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}

interface TableProps {
  headers: string[];
  rows: string[][];
}

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ObjectivesProps {
  items: string[];
}

export function Objectives({ items }: ObjectivesProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg mb-6">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <span>🎯</span> สิ่งที่คุณจะได้เรียนรู้
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface DiagramProps {
  children: ReactNode;
  caption?: string;
}

export function Diagram({ children, caption }: DiagramProps) {
  return (
    <div className="my-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg font-mono text-sm overflow-x-auto">
      <pre className="text-center">{children}</pre>
      {caption && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-3 text-sm not-italic">{caption}</p>
      )}
    </div>
  );
}

// ============================================
// INTERACTIVE COMPONENTS
// ============================================

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export function Quiz({ questions, title = "ทดสอบความเข้าใจ" }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === questions[currentQ].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="my-6 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-4">🎉 Quiz Complete!</h3>
        <div className="text-4xl font-bold mb-2">{percentage}%</div>
        <p className="mb-4">คุณตอบถูก {score} จาก {questions.length} ข้อ</p>
        {percentage === 100 && <p className="text-yellow-300">🌟 Perfect Score!</p>}
        <button
          onClick={restart}
          className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">📝 {title}</h3>
        <span className="text-sm text-gray-500">
          {currentQ + 1} / {questions.length}
        </span>
      </div>
      
      <p className="text-lg font-medium mb-4">{q.question}</p>
      
      <div className="space-y-2">
        {q.options.map((option, i) => {
          let bgClass = "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700";
          if (answered) {
            if (i === q.correctIndex) {
              bgClass = "bg-green-100 dark:bg-green-900/50 border-green-500";
            } else if (i === selected) {
              bgClass = "bg-red-100 dark:bg-red-900/50 border-red-500";
            }
          }
          
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all ${bgClass} ${
                selected === i && !answered ? "border-indigo-500" : "border-transparent"
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && q.explanation && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm">
          <span className="font-medium">💡 คำอธิบาย:</span> {q.explanation}
        </div>
      )}

      {answered && (
        <button
          onClick={nextQuestion}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          {currentQ < questions.length - 1 ? "ข้อถัดไป →" : "ดูผลลัพธ์"}
        </button>
      )}
    </div>
  );
}

interface InteractiveDemoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function InteractiveDemo({ title, description, children }: InteractiveDemoProps) {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="my-6 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl overflow-hidden">
      <div className="bg-indigo-100 dark:bg-indigo-900/50 px-4 py-3 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
            <span>🎮</span> {title}
          </h4>
          {description && (
            <p className="text-sm text-indigo-600 dark:text-indigo-300">{description}</p>
          )}
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
            isRunning 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isRunning ? "⏹ Stop" : "▶ Run"}
        </button>
      </div>
      <div className="p-4 bg-gray-900 min-h-[200px] flex items-center justify-center">
        {isRunning ? children : (
          <p className="text-gray-400 text-center">
            กด <span className="text-green-400 font-medium">▶ Run</span> เพื่อเริ่ม demo
          </p>
        )}
      </div>
    </div>
  );
}

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="my-6 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-4 py-3 text-left font-medium flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>{item.title}</span>
            <span className={`transform transition-transform ${openIndex === i ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {openIndex === i && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface ProgressCheckProps {
  items: string[];
}

export function ProgressCheck({ items }: ProgressCheckProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));

  const toggle = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const progress = Math.round((checked.filter(Boolean).length / items.length) * 100);

  return (
    <div className="my-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>✅</span> Progress Check
        </h3>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          {progress}% Complete
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <label 
            key={i} 
            className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => toggle(i)}
              className="w-5 h-5 accent-green-500"
            />
            <span className={checked[i] ? "line-through text-gray-400" : ""}>
              {item}
            </span>
          </label>
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/50 rounded-lg text-center">
          <span className="text-2xl">🎉</span>
          <p className="font-medium text-green-700 dark:text-green-300">ยอดเยี่ยม! คุณเข้าใจทุกหัวข้อแล้ว!</p>
        </div>
      )}
    </div>
  );
}

interface CodeChallengeProps {
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints?: string[];
}

export function CodeChallenge({ title, description, starterCode, solution, hints = [] }: CodeChallengeProps) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  return (
    <div className="my-6 border-2 border-amber-200 dark:border-amber-800 rounded-xl overflow-hidden">
      <div className="bg-amber-100 dark:bg-amber-900/50 px-4 py-3">
        <h4 className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <span>🏆</span> Challenge: {title}
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{description}</p>
      </div>
      
      <div className="p-4">
        <CodeBlock code={starterCode} title="Starter Code" language="javascript" />
        
        <div className="flex gap-2 mt-4">
          {hints.length > 0 && (
            <button
              onClick={() => {
                setShowHints(true);
                if (currentHint < hints.length - 1) {
                  setCurrentHint(c => c + 1);
                }
              }}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
            >
              💡 Hint ({currentHint + 1}/{hints.length})
            </button>
          )}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
          >
            {showSolution ? "🙈 Hide" : "👀 Show"} Solution
          </button>
        </div>

        {showHints && currentHint > 0 && (
          <div className="mt-4 space-y-2">
            {hints.slice(0, currentHint).map((hint, i) => (
              <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm">
                <span className="font-medium">Hint {i + 1}:</span> {hint}
              </div>
            ))}
          </div>
        )}

        {showSolution && (
          <div className="mt-4">
            <CodeBlock code={solution} title="✅ Solution" language="javascript" />
          </div>
        )}
      </div>
    </div>
  );
}

interface LiveCanvasProps {
  width?: number;
  height?: number;
  draw: (ctx: CanvasRenderingContext2D, frame: number) => void;
}

export function LiveCanvas({ width = 400, height = 300, draw }: LiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      draw(ctx, frameRef.current);
      frameRef.current++;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, draw, width, height]);

  return (
    <div className="my-6">
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isRunning ? "⏹ Stop" : "▶ Start Animation"}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="mx-auto border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-900"
      />
    </div>
  );
}

