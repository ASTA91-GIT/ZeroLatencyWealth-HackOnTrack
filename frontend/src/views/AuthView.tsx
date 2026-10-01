import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AuthViewProps {
  mode: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode: initialMode }) => {
  const { loginAsDemoUser, loading, setCurrentView, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For hackathon, if user inputs credentials or clicks submit, authenticate or redirect to demo
    await loginAsDemoUser();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl fintech-card shadow-[0_0_50px_rgba(124,58,237,0.12)] space-y-6 relative overflow-hidden border-purple-500/30">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400" />

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-xl font-black text-theme tracking-tight mt-4">
            {mode === 'login' ? 'Access Your Unified Terminal' : 'Create ZeroLatency Account'}
          </h2>
          <p className="text-xs text-muted-theme">
            One portfolio. Every asset. Clearer understanding.
          </p>
        </div>

        {/* 1-Click Demo Login Highlight (Judge Demo Flow) */}
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2.5 text-center shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
            RECOMMENDED FOR JUDGES & EVALUATION
          </span>
          <button
            onClick={loginAsDemoUser}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Continue with Demo Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-muted-theme">
            Instantly loads canonical benchmark data (₹8,42,500 across 4 asset classes).
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-theme w-full" />
          <span className="bg-surface px-3 text-[11px] text-muted-theme uppercase font-mono">
            Or Sign In
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="text-theme font-medium block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-theme absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl pl-9 pr-3.5 py-2.5 text-theme focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-theme font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-theme absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@zerolatency.invest"
                className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl pl-9 pr-3.5 py-2.5 text-theme focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-theme font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-theme absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl pl-9 pr-3.5 py-2.5 text-theme focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold transition-all cursor-pointer border border-purple-500/30"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-muted-theme">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-purple-400 font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-purple-400 font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
