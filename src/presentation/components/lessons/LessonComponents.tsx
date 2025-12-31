"use client";

import { ReactNode } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
}

export function CodeBlock({ code, language = "javascript", title, description }: CodeBlockProps) {
  return (
    <div className="my-4">
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <span className="text-gray-400 text-xs">{language}</span>
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
