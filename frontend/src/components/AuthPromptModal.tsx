import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Sparkles, ArrowRight, ShieldCheck, X, UserPlus, LogIn } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  actionTitle = 'access this Wealth OS feature'
}) => {
  const { setCurrentView, loginAsDemoUser } = useApp();

  if (!isOpen) return null;

  const handleNavigate = (view: 'signup' | 'login') => {
    onClose();
    setCurrentView(view);
  };

  const handleDemo = async () => {
    onClose();
    await loginAsDemoUser();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-purple-500/30 p-7 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>

          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight pt-2">
            Create your free account to continue
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            You need an active account or demo session to {actionTitle} and save your personalized multi-asset portfolio.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleNavigate('signup')}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up — Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavigate('login')}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Already have an account? Log In</span>
          </button>
        </div>

        {/* Evaluation Demo Mode Divider */}
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-white/10 text-center">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
            Evaluating for Hackathon or Demonstration?
          </p>
          <button
            onClick={handleDemo}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Continue with Instant Demo Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
