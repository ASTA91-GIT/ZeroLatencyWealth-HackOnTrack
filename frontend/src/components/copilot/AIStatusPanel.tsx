import React from 'react';
import { X, Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Database, Zap } from 'lucide-react';
import { AiHealthResponse } from '../../types';

interface AIStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
  aiHealth: AiHealthResponse | null;
  messageCount: number;
}

export const AIStatusPanel: React.FC<AIStatusPanelProps> = ({
  isOpen,
  onClose,
  aiHealth,
  messageCount,
}) => {
  if (!isOpen) return null;

  const isOnline = aiHealth?.status === 'ONLINE';

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-[#121118] border border-zinc-200 dark:border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-[#181822]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                AI System Architecture & Status
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Transparent local intelligence telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Badge Block */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-600/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-600/30 text-amber-800 dark:text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {isOnline ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <div className="font-bold text-xs uppercase tracking-wider">
                  {isOnline ? 'Local Ollama LLM Active' : 'Deterministic Fallback Active'}
                </div>
                <div className="text-[11px] opacity-80">
                  {isOnline
                    ? 'Connected to local workstation inference engine'
                    : 'Ollama is offline or starting; fallback answering smoothly'}
                </div>
              </div>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          </div>

          {/* Diagnostic Metrics Table */}
          <div className="space-y-2 border border-zinc-200 dark:border-white/10 rounded-xl p-3 bg-zinc-50 dark:bg-white/[0.02]">
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-white/5">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Provider
              </span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                Ollama (Self-Hosted)
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-white/5">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Configured Model
              </span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                {aiHealth?.configured_model || 'llama3.1:8b'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-white/5">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Inference Mode
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Local On-Device (Zero Cloud Keys)
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-white/5">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-violet-400" /> Fallback Engine
              </span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">
                SEBI Multi-Asset Knowledge Engine
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500 dark:text-zinc-400">Context Memory</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                Active ({messageCount} messages in memory)
              </span>
            </div>
          </div>

          {/* Privacy & Sovereignty Guarantee */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>✦</span> Zero External AI API Guarantee
            </div>
            <p className="leading-relaxed opacity-90">
              No prompts, portfolio holdings, or messages are ever sent to external cloud APIs (OpenAI, Gemini, Claude). All intelligence is processed on your local machine.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#181822] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-800 dark:text-white font-medium text-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
