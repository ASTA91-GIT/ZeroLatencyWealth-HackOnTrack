import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const CopilotDrawer: React.FC = () => {
  const { isCopilotDrawerOpen, setIsCopilotDrawerOpen, selectedAsset } = useApp();
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'copilot'; text: string; time: string; suggested?: string[] }>>([
    {
      id: 'welcome-001',
      sender: 'copilot',
      text: (
        "Hello! I am **ZeroLatency Copilot**, your multi-asset awareness partner.\n\n" +
        "I have real-time context of your simulated portfolio holdings across **Equities (52%)**, **Sovereign Bonds (18%)**, **Commercial REITs (15%)**, and **InvITs (10%)**.\n\n" +
        "Ask me to explain any asset instrument, break down distribution yields, or compare cash flows!"
      ),
      time: 'Just now',
      suggested: [
        "What is a REIT?",
        "Explain InvITs simply.",
        "How are bonds different from equities?",
        "Show my demo portfolio allocation.",
        "What percentage is invested in REITs?"
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isCopilotDrawerOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await api.askCopilot(
        userMsg.text,
        selectedAsset ? selectedAsset.asset_id : undefined
      );

      const botMsg = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'copilot' as const,
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested: response.suggested_questions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'copilot' as const,
          text: "I experienced a temporary communication glitch with the analysis engine. Please try asking again!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isCopilotDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#0c0b12] border-l border-zinc-200 dark:border-purple-500/30 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-[#121118]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  ZERO LATENCY COPILOT
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    AWARENESS AI
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Contextual Multi-Asset Education</p>
              </div>
            </div>

            <button
              onClick={() => setIsCopilotDrawerOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Educational Disclaimer Banner */}
          <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-500/20 flex items-center gap-2 text-[11px] text-purple-700 dark:text-purple-300">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span>Educational information — not financial advice or buy/sell calls.</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line font-normal space-y-2">
                        {m.text}
                      </div>
                    </div>

                    <div className={`flex items-center text-[10px] text-zinc-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span>{m.time}</span>
                    </div>

                    {/* Suggested follow-up prompt chips */}
                    {m.suggested && m.suggested.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {m.suggested.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(s)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:border-purple-400 transition-all flex items-center gap-1 text-left cursor-pointer"
                          >
                            <span>{s}</span>
                            <ChevronRight className="w-3 h-3 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-white/[0.08] border border-zinc-300 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-3 items-center text-xs text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 p-3 rounded-xl border border-purple-200 dark:border-purple-800/40 w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-purple-500" />
                <span>ZeroLatency Copilot is synthesizing portfolio context...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Starter bar */}
          <div className="px-4 py-2 bg-zinc-50 dark:bg-[#121118] border-t border-zinc-200 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider shrink-0">Prompts:</span>
            <button
              onClick={() => handleSend("What is a REIT?")}
              className="text-[11px] whitespace-nowrap px-2 py-0.5 rounded bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 border border-zinc-200 dark:border-white/10 cursor-pointer"
            >
              What is a REIT?
            </button>
            <button
              onClick={() => handleSend("Explain InvITs simply.")}
              className="text-[11px] whitespace-nowrap px-2 py-0.5 rounded bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 border border-zinc-200 dark:border-white/10 cursor-pointer"
            >
              Explain InvITs
            </button>
            <button
              onClick={() => handleSend("How are bonds different from equities?")}
              className="text-[11px] whitespace-nowrap px-2 py-0.5 rounded bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 border border-zinc-200 dark:border-white/10 cursor-pointer"
            >
              Bonds vs Equities
            </button>
            <button
              onClick={() => handleSend("Show my demo portfolio allocation.")}
              className="text-[11px] whitespace-nowrap px-2 py-0.5 rounded bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 border border-zinc-200 dark:border-white/10 cursor-pointer"
            >
              My Allocation
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#09090d]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about REITs, InvITs, bonds, or your portfolio..."
                className="flex-1 bg-zinc-50 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/15 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 fill-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
