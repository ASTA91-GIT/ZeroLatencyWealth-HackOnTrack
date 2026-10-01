import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MarkdownRenderer } from './copilot/MarkdownRenderer';
import { AIStatusPanel } from './copilot/AIStatusPanel';
import {
  Sparkles,
  Send,
  X,
  User,
  ShieldAlert,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  Info,
  Maximize2,
  Minimize2,
  PieChart,
  BookOpen,
  TrendingUp,
  HelpCircle,
  Layers,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  time: string;
  source?: string;
  suggested?: string[];
  feedback?: 'up' | 'down' | null;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

const FEATURE_CARDS = [
  {
    icon: PieChart,
    title: 'Portfolio Allocation',
    subtitle: 'Understand your multi-asset weighting & yield',
    prompt: 'Show my portfolio allocation and weighted yield.',
    badge: 'Allocation',
  },
  {
    icon: BookOpen,
    title: 'Asset Classes',
    subtitle: 'Learn equities, sovereign bonds, REITs & InvITs',
    prompt: 'What is a REIT and how does it generate 90% rental yields?',
    badge: 'Education',
  },
  {
    icon: TrendingUp,
    title: 'Market Terminology',
    subtitle: 'Demystify P/E ratios, NAV, and coupon rates',
    prompt: 'What is P/E ratio and how does it compare to REIT NAV?',
    badge: 'Valuation',
  },
  {
    icon: HelpCircle,
    title: 'Paper Trading',
    subtitle: 'How the simulated ₹10,00,000 desk operates',
    prompt: 'How does paper trading work in ZeroLatency Wealth?',
    badge: 'Simulation',
  },
];

const SUGGESTED_QUESTIONS = [
  'What is a REIT?',
  'Explain bonds simply',
  'What is P/E ratio?',
  'Explain diversification',
  'Show my portfolio allocation',
  'Explain my largest holding',
  'How does paper trading work?',
  "What's the difference between REITs and InvITs?",
];

export const CopilotDrawer: React.FC = () => {
  const { isCopilotDrawerOpen, setIsCopilotDrawerOpen, selectedAsset, aiHealth, user, summary, holdings } = useApp();

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-default',
      title: 'Current Session',
      createdAt: 'Today',
      messages: [],
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-default');

  // Active messages derived from current session
  const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotDrawerOpen) {
      scrollToBottom();
      textareaRef.current?.focus();
    }
  }, [messages, isCopilotDrawerOpen, isSending]);

  const updateCurrentSessionMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId) {
          const updatedMsgs = updater(s.messages);
          // Auto-title session after first user message
          let newTitle = s.title;
          if (s.title === 'Current Session' || s.title === 'New Conversation') {
            const firstUserMsg = updatedMsgs.find((m) => m.sender === 'user');
            if (firstUserMsg) {
              newTitle = firstUserMsg.text.slice(0, 28) + (firstUserMsg.text.length > 28 ? '...' : '');
            }
          }
          return { ...s, messages: updatedMsgs, title: newTitle };
        }
        return s;
      })
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleFeedback = (messageId: string, feedbackType: 'up' | 'down') => {
    updateCurrentSessionMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            feedback: m.feedback === feedbackType ? null : feedbackType,
          };
        }
        return m;
      })
    );
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: 'Just now',
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setInput('');
  };

  const handleClearHistory = () => {
    updateCurrentSessionMessages(() => []);
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
    updateCurrentSessionMessages(() => newHistory);
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
        source: response.source || 'ZeroLatency Copilot',
        suggested: response.suggested_questions,
        feedback: null,
      };

      updateCurrentSessionMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      updateCurrentSessionMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'copilot',
          text: "I experienced a temporary communication glitch while synthesizing that response. Please ask your question again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'ZeroLatency Intelligence',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isCopilotDrawerOpen) return null;

  const isOllamaOnline = aiHealth?.status === 'ONLINE';
  const configuredModel = aiHealth?.configured_model || 'llama3.1:8b';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6">
          <div
            className={`w-screen transition-all duration-300 bg-white dark:bg-[#09090d] border-l border-zinc-200 dark:border-purple-500/25 shadow-2xl flex flex-col ${
              isExpanded ? 'max-w-4xl' : 'max-w-2xl sm:max-w-2xl'
            }`}
          >
            {/* Top Product Header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-[#111116] shrink-0">
              <div className="flex items-center gap-3">
                {/* Brand Monogram Avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] shrink-0">
                  <span className="font-extrabold text-sm tracking-wider font-mono">ZL</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                      <span>ZERO LATENCY COPILOT</span>
                    </h2>

                    {/* Small dynamic status indicator pill */}
                    <button
                      onClick={() => setIsStatusModalOpen(true)}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border transition-all cursor-pointer ${
                        isOllamaOnline
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/30 hover:border-emerald-500'
                          : 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-white/15 hover:border-purple-400'
                      }`}
                      title="Click to view AI system architecture & telemetry"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOllamaOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                        }`}
                      />
                      <span>{isOllamaOnline ? `Local AI • ${configuredModel}` : 'Local AI Offline • Fallback'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Your personal multi-asset financial awareness assistant
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  onClick={() => setIsStatusModalOpen(true)}
                  className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                  title="AI System Telemetry"
                >
                  <Cpu className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNewChat}
                  className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                  title="New Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                  title="Clear Current Messages"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer hidden md:block"
                  title={isExpanded ? 'Collapse width' : 'Expand width'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                  className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer hidden lg:block"
                  title={isSidePanelOpen ? 'Hide Context Panel' : 'Show Context Panel'}
                >
                  {isSidePanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                </button>

                <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-1" />

                <button
                  onClick={() => setIsCopilotDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                  title="Close Copilot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Offline Fallback Graceful Banner (if Ollama offline) */}
            {!isOllamaOnline && (
              <div className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>
                    <strong>Local AI offline</strong> — ZeroLatency's built-in financial knowledge engine is answering your questions smoothly.
                  </span>
                </div>
                <button
                  onClick={() => setIsStatusModalOpen(true)}
                  className="underline text-[10px] font-mono hover:text-purple-900 dark:hover:text-white cursor-pointer ml-2 shrink-0"
                >
                  Telemetry
                </button>
              </div>
            )}

            {/* Main Content Area: Chat Feed + Optional Context Side Panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Messages Feed */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
                  {/* Empty / Welcome State */}
                  {messages.length === 0 ? (
                    <div className="py-6 sm:py-8 px-2 max-w-lg mx-auto text-center space-y-6 animate-in fade-in duration-300">
                      {/* Welcome Glow Icon */}
                      <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 bg-purple-600/30 blur-2xl rounded-full" />
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-xl">
                          <Sparkles className="w-7 h-7 fill-white/90" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                          ZERO LATENCY COPILOT
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                          Your private financial awareness assistant. Understand your portfolio, explore statutory asset mechanics, and ask questions in plain language.
                        </p>
                      </div>

                      {/* 4 Interactive Feature Starter Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                        {FEATURE_CARDS.map((card, idx) => {
                          const IconComp = card.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSend(card.prompt)}
                              className="p-3.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 bg-white dark:bg-[#121118] hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all text-left group shadow-xs cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform">
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-300">
                                  {card.badge}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                {card.title}
                              </h4>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                                {card.subtitle}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Regulatory Notice Banner */}
                      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 max-w-sm mx-auto">
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Objective financial education — never speculative buy/sell calls.</span>
                      </div>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isUser = m.sender === 'user';
                      return (
                        <div
                          key={m.id}
                          className={`flex gap-3 animate-in fade-in duration-150 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {/* Bot Avatar */}
                          {!isUser && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs border border-purple-400/30">
                              <Sparkles className="w-4 h-4 fill-white" />
                            </div>
                          )}

                          <div className={`max-w-[90%] sm:max-w-[85%] space-y-2`}>
                            {/* Message Bubble Card */}
                            <div
                              className={`rounded-2xl transition-all ${
                                isUser
                                  ? 'p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md font-medium text-xs sm:text-sm'
                                  : 'p-4 bg-zinc-50 dark:bg-[#121118] border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm'
                              }`}
                            >
                              {/* Bot Header Card Stamp */}
                              {!isUser && (
                                <div className="mb-2 pb-2 border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-zinc-900 dark:text-white tracking-wide">
                                      ZeroLatency Copilot
                                    </span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium">
                                      {isOllamaOnline ? 'Local AI' : 'Copilot'}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-zinc-400 font-mono">
                                    {m.time}
                                  </span>
                                </div>
                              )}

                              {/* Render Message Content */}
                              {isUser ? (
                                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                                  {m.text}
                                </div>
                              ) : (
                                <MarkdownRenderer content={m.text} />
                              )}

                              {/* Bot Response Actions Footer */}
                              {!isUser && (
                                <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                                  <div className="flex items-center gap-1">
                                    {/* Copy Action */}
                                    <button
                                      onClick={() => handleCopy(m.id, m.text)}
                                      className="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1"
                                      title="Copy response"
                                    >
                                      {copiedId === m.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                                          <span className="text-emerald-500 font-semibold text-[10px]">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span className="text-[10px]">Copy</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Regenerate Action */}
                                    <button
                                      onClick={() => handleSend(messages[messages.indexOf(m) - 1]?.text || 'Explain again')}
                                      className="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1"
                                      title="Regenerate this response"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span className="text-[10px]">Retry</span>
                                    </button>
                                  </div>

                                  {/* Feedback Thumbs */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleFeedback(m.id, 'up')}
                                      className={`p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 transition-all cursor-pointer ${
                                        m.feedback === 'up'
                                          ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                                          : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                                      }`}
                                      title="Helpful response"
                                    >
                                      <ThumbsUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(m.id, 'down')}
                                      className={`p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 transition-all cursor-pointer ${
                                        m.feedback === 'down'
                                          ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                                          : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                                      }`}
                                      title="Not helpful"
                                    >
                                      <ThumbsDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* User Timestamp */}
                            {isUser && (
                              <div className="text-[10px] text-zinc-400 text-right pr-1">
                                {m.time}
                              </div>
                            )}

                            {/* Follow-up question chips */}
                            {m.suggested && m.suggested.length > 0 && (
                              <div className="pt-1 flex flex-wrap gap-1.5">
                                {m.suggested.map((s, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSend(s)}
                                    className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 hover:border-purple-400 transition-all flex items-center gap-1 text-left cursor-pointer"
                                  >
                                    <span>{s}</span>
                                    <ChevronRight className="w-3 h-3 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* User Avatar */}
                          {isUser && (
                            <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-white/[0.08] border border-zinc-300 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shrink-0 mt-0.5">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {/* Thinking / Generation Indicator */}
                  {isSending && (
                    <div className="flex gap-3 items-center text-xs text-purple-700 dark:text-purple-300 bg-purple-50/70 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-200 dark:border-purple-800/40 w-fit animate-pulse">
                      <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
                        <Sparkles className="w-3.5 h-3.5 fill-white animate-spin" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>✦ ZeroLatency Copilot is thinking</span>
                          <span className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-purple-500 animate-bounce" />
                            <span className="w-1 h-1 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-1 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          Synthesizing multi-asset portfolio context...
                        </p>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Ticker Bar */}
                <div className="px-4 py-2 bg-zinc-50 dark:bg-[#111116] border-t border-zinc-200 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold shrink-0">
                    Prompts:
                  </span>
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 border border-zinc-200 dark:border-white/10 transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Command Bar Message Input */}
                <div className="p-3 sm:p-4 border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#09090d] shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative flex items-end gap-2 p-1.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/15 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all"
                  >
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask ZeroLatency Copilot anything (Enter to send, Shift+Enter for newline)..."
                      className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none resize-none max-h-32 min-h-[38px] leading-relaxed"
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || isSending}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer shrink-0"
                      title="Send message"
                    >
                      <Send className="w-4 h-4 fill-white" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 px-2 pt-1.5">
                    <span>Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline</span>
                    <span className="flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Local Inference</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Right Context Panel (Requirement #14) */}
              {isSidePanelOpen && (
                <div className="w-64 border-l border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#0d0c13] p-4 flex flex-col justify-between hidden lg:flex shrink-0 text-xs">
                  <div className="space-y-4">
                    {/* Telemetry Header */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Copilot Telemetry
                      </h4>
                      <div className="mt-2 p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 dark:text-zinc-400">Engine</span>
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {isOllamaOnline ? 'Ollama' : 'Deterministic'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 dark:text-zinc-400">Model</span>
                          <span className="font-mono text-purple-600 dark:text-purple-300 font-semibold">
                            {configuredModel}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 dark:text-zinc-400">Privacy</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            100% Local
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Awareness Card */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Context Injected
                      </h4>
                      <div className="mt-2 p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 dark:text-zinc-400">Total Value</span>
                          <span className="font-bold text-zinc-900 dark:text-white">
                            ₹{summary ? summary.total_value.toLocaleString('en-IN') : '8,42,500'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 dark:text-zinc-400">Holdings</span>
                          <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                            {holdings ? holdings.length : 13} Assets
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 dark:text-zinc-400">Weighted Yield</span>
                          <span className="font-mono text-emerald-500 font-bold">
                            {summary ? `${summary.weighted_yield.toFixed(2)}%` : '4.43%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Suggestions in sidebar */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Topic Starters
                      </h4>
                      <div className="mt-2 space-y-1">
                        <button
                          onClick={() => handleSend("What is a REIT?")}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 truncate cursor-pointer transition-colors"
                        >
                          • What is a REIT?
                        </button>
                        <button
                          onClick={() => handleSend("Explain bonds simply")}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 truncate cursor-pointer transition-colors"
                        >
                          • Explain bonds simply
                        </button>
                        <button
                          onClick={() => handleSend("Show my portfolio allocation")}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 truncate cursor-pointer transition-colors"
                        >
                          • Show portfolio allocation
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Regulatory Card */}
                  <div className="p-3 bg-purple-50/80 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/40 text-[10px] text-purple-900 dark:text-purple-300 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                      <span>Statutory Notice</span>
                    </div>
                    <p className="leading-snug opacity-90">
                      ZeroLatency Copilot provides educational and financial-awareness information. It does not provide personalized buy/sell recommendations or financial advice.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI System Telemetry & Architecture Modal */}
      <AIStatusPanel
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        aiHealth={aiHealth}
        messageCount={messages.length}
      />
    </>
  );
};
