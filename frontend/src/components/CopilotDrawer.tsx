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
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Cpu
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  time: string;
  source?: string;
  suggested?: string[];
}

export const CopilotDrawer: React.FC = () => {
  const { isCopilotDrawerOpen, setIsCopilotDrawerOpen, selectedAsset, aiHealth, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-001',
      sender: 'copilot',
      text: (
        "Hello! I am **ZeroLatency Copilot**, your private local AI financial assistant powered by Ollama.\n\n" +
        "I have context of your multi-asset holdings across **Equities**, **Sovereign Bonds**, **Commercial REITs**, and **InvITs**.\n\n" +
        "Ask me to explain any financial concept, compare instruments, or breakdown your portfolio!"
      ),
      time: 'Just now',
      source: 'ZeroLatency Intelligence Engine',
      suggested: [
        "What is a REIT?",
        "Explain InvITs simply.",
        "How are bonds different from equities?",
        "What does P/E ratio mean?",
        "Show my portfolio allocation."
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isCopilotDrawerOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'copilot',
        text: "Conversation cleared. How can I help you explore markets or your portfolio?",
        time: 'Just now',
        suggested: [
          "What is a REIT?",
          "Explain diversification.",
          "Show my portfolio allocation."
        ]
      }
    ]);
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsSending(true);

    // Format bounded conversation history for LLM
    const apiHistory = newHistory.slice(-8).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const response = await api.askCopilot(
        userMsg.text,
        selectedAsset ? (selectedAsset as any).id || selectedAsset.asset_id : undefined,
        apiHistory
      );

      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'copilot',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
        suggested: response.suggested_questions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'copilot',
          text: "I experienced a temporary communication hiccup. Please ask your question again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'ZeroLatency Offline Safety Fallback'
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isCopilotDrawerOpen) return null;

  const isOllamaOnline = aiHealth?.status === 'ONLINE';

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
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>ZERO LATENCY COPILOT</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                      isOllamaOnline
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600/30'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-600/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOllamaOnline ? 'bg-emerald-500 animate-pulse' : 'bg-purple-500'
                      }`}
                    />
                    <span>{isOllamaOnline ? 'Ollama Online' : 'Local Fallback'}</span>
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {isOllamaOnline
                    ? `Running local model: ${aiHealth?.configured_model || 'llama3.1:8b'}`
                    : 'Private Deterministic Engine Active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCopilotDrawerOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Educational Disclaimer Banner (Requirement #20) */}
          <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-500/20 flex items-center gap-2 text-[11px] text-purple-700 dark:text-purple-300">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span>Educational information — never personalized investment advice or buy/sell calls.</span>
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

                      {/* Bot Source Stamp & Copy Button */}
                      {!isUser && (
                        <div className="mt-3 pt-2 border-t border-zinc-200/60 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span className="truncate max-w-[200px]">{m.source}</span>
                          <button
                            onClick={() => handleCopy(m.id, m.text)}
                            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1"
                            title="Copy response"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
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
                <span>ZeroLatency Copilot is synthesizing response...</span>
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
              onClick={() => handleSend("What does P/E ratio mean?")}
              className="text-[11px] whitespace-nowrap px-2 py-0.5 rounded bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 border border-zinc-200 dark:border-white/10 cursor-pointer"
            >
              P/E Ratio
            </button>
            <button
              onClick={() => handleSend("Show my portfolio allocation.")}
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
                placeholder="Ask any question about markets, instruments, or your portfolio..."
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
