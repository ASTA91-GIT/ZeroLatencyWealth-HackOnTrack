import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-2.5 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-3 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-purple-500 inline-block" />
              <span>{children}</span>
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white mt-2.5 mb-1 flex items-center gap-1.5">
              <span className="w-1 h-3 rounded bg-indigo-500 inline-block" />
              <span>{children}</span>
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white mt-2 mb-1 flex items-center gap-1.5">
              <span className="text-purple-400">✦</span>
              <span>{children}</span>
            </h5>
          ),
          p: ({ children }) => (
            <p className="my-1.5 text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1 list-none pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1 list-decimal pl-4 text-purple-600 dark:text-purple-400 font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 my-1 text-zinc-800 dark:text-zinc-200 font-normal">
              <span className="text-purple-500 font-bold select-none mt-0.5">•</span>
              <div className="flex-1">{children}</div>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-900 dark:text-white">
              {children}
            </strong>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-medium">
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 my-2 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                <code>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-zinc-200 dark:border-white/10">
              <table className="w-full text-left border-collapse text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-white/10">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-2 sm:p-2.5 font-semibold text-zinc-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2 sm:p-2.5 text-zinc-700 dark:text-zinc-300">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-purple-500 pl-3 my-2 italic text-zinc-600 dark:text-zinc-400 bg-purple-50/50 dark:bg-purple-950/20 py-1 rounded-r">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
