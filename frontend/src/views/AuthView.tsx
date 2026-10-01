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
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c101d] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.15)] space-y-6 relative overflow-hidden">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-4">
            {mode === 'login' ? 'Access Your Unified Terminal' : 'Create ZeroLatency Account'}
          </h2>
          <p className="text-xs text-slate-400">
            One portfolio. Every asset. Clearer understanding.
          </p>
        </div>

        {/* 1-Click Demo Login Highlight (Judge Demo Flow) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#121829] to-cyan-950/60 border border-cyan-400/50 space-y-2 text-center shadow-[0_0_20px_rgba(0,242,254,0.15)]">
          <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
            RECOMMENDED FOR JUDGES & EVALUATION
          </span>
          <button
            onClick={loginAsDemoUser}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-black text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-white shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Continue with Demo Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-slate-400">
            Instantly loads canonical benchmark data (₹8,42,500 across 4 asset classes).
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c101d] px-3 text-[11px] text-slate-500 uppercase font-mono">
            Or Sign In
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@zerolatency.invest"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold transition-all cursor-pointer border border-white/10"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-cyan-400 font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 font-semibold hover:underline cursor-pointer"
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
