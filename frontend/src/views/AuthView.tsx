import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Check
} from 'lucide-react';

interface AuthViewProps {
  mode: 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode: initialMode }) => {
  const { loginAsDemoUser, login, register, setCurrentView, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check URL params for token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tok = params.get('token');
    if (tok) {
      if (mode === 'reset-password') setResetToken(tok);
      if (mode === 'verify-email') setVerifyToken(tok);
    }
  }, [mode]);

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const strength = calculatePasswordStrength(password);
  const strengthColor =
    strength <= 20
      ? 'bg-rose-500'
      : strength <= 40
      ? 'bg-amber-500'
      : strength <= 60
      ? 'bg-yellow-400'
      : 'bg-emerald-500';

  const strengthText =
    strength <= 20
      ? 'Very Weak'
      : strength <= 40
      ? 'Weak'
      : strength <= 60
      ? 'Moderate'
      : 'Strong';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setErrorMsg('Invalid email or password.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must accept the terms of service to create an account.');
      return;
    }

    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg('Please enter your account email.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!resetToken) {
      setErrorMsg('Reset token is missing. Please use the link provided in your email.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword(resetToken, password);
      showToast(res.message, 'success');
      setMode('login');
    } catch (err: any) {
      setErrorMsg(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verifyToken) {
      setErrorMsg('Verification token missing.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.verifyEmail(verifyToken);
      showToast(res.message, 'success');
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#121118] border border-zinc-200 dark:border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.12)] space-y-6 relative overflow-hidden">
        {/* Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400" />

        {/* Branding & Subtitle */}
        <div className="text-center space-y-2">
          <div className="flex justify-center cursor-pointer" onClick={() => setCurrentView('landing')}>
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-3">
            {mode === 'login' && 'Sign in to Wealth OS'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot-password' && 'Reset Password'}
            {mode === 'reset-password' && 'Choose New Password'}
            {mode === 'verify-email' && 'Verify Email Address'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {mode === 'login' && 'Access your isolated multi-asset terminal, portfolio, and local AI.'}
            {mode === 'signup' && 'Get started with ₹10,00,000 simulated paper buying power.'}
            {mode === 'forgot-password' && 'Enter your email to receive a secure recovery link.'}
            {mode === 'reset-password' && 'Enter and confirm your new secure Argon2id password.'}
            {mode === 'verify-email' && 'Activate your account for full verified features.'}
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Login Highlight (Hackathon Judge Requirement #14) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2.5 text-center shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest block">
              RECOMMENDED FOR JUDGES & EVALUATION
            </span>
            <button
              onClick={loginAsDemoUser}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Continue with 1-Click Demo Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Instantly loads benchmark portfolio (₹8,42,500 across Equities, Bonds, REITs & InvITs).
            </p>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-200 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-[#121118] px-3 text-[10px] text-zinc-400 uppercase font-mono">
              Or Use Your Credentials
            </span>
          </div>
        )}

        {/* ----------------- LOGIN FORM ----------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-10 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <span>Signing In...</span> : <span>Sign In</span>}
            </button>

            <div className="text-center pt-2">
              <p className="text-zinc-500 dark:text-zinc-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ----------------- SIGNUP FORM (Requirement #5) ----------------- */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-10 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Password Strength:</span>
                    <span className="font-bold">{strengthText}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-300`}
                      style={{ width: `${Math.max(10, strength)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-10 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="terms" className="text-[11px] text-zinc-600 dark:text-zinc-400">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setCurrentView('security')}
                  className="text-purple-600 dark:text-purple-400 underline"
                >
                  Terms of Service & Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
            </button>

            <div className="text-center pt-2">
              <p className="text-zinc-500 dark:text-zinc-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ----------------- FORGOT PASSWORD FORM (Requirement #7) ----------------- */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Enter your account email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all cursor-pointer"
            >
              {loading ? <span>Sending Reset Link...</span> : <span>Send Recovery Link</span>}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ----------------- RESET PASSWORD FORM (Requirement #7) ----------------- */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Reset Token
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste token or use link from email"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 font-mono text-zinc-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all cursor-pointer"
            >
              {loading ? <span>Updating Password...</span> : <span>Update Password</span>}
            </button>
          </form>
        )}

        {/* ----------------- VERIFY EMAIL FORM (Requirement #9) ----------------- */}
        {mode === 'verify-email' && (
          <div className="space-y-4 text-xs text-center">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-2 text-left">
                Email Verification Token
              </label>
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                placeholder="Paste verification token here"
                className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleVerifyEmail}
              disabled={loading || !verifyToken}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all cursor-pointer"
            >
              {loading ? <span>Verifying...</span> : <span>Confirm Email Verification</span>}
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Proceed to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
