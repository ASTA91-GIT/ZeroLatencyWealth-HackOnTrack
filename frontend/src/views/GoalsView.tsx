import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { GoalModel } from '../types';
import {
  Target,
  Plus,
  ShieldCheck,
  Plane,
  GraduationCap,
  Home,
  TrendingUp,
  Clock,
  Sparkles,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { showToast, setIsCopilotDrawerOpen } = useApp();
  const [goals, setGoals] = useState<GoalModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New goal form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Emergency');
  const [targetAmount, setTargetAmount] = useState('300000');
  const [currentAmount, setCurrentAmount] = useState('150000');
  const [timePeriod, setTimePeriod] = useState('12 Months');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await api.getGoals();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching goals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || Number(targetAmount) <= 0) return;

    try {
      await api.createGoal({
        title: title.trim(),
        category,
        target_amount: Number(targetAmount),
        current_amount: Number(currentAmount),
        time_period: timePeriod,
        icon: category.toLowerCase()
      });
      setShowAddModal(false);
      setTitle('');
      await fetchGoals();
      showToast('New simulated goal created successfully', 'success');
    } catch (err) {
      showToast('Failed to create goal', 'error');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id);
      await fetchGoals();
      showToast('Simulated goal removed', 'info');
    } catch (err) {
      showToast('Failed to delete goal', 'error');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'emergency':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'travel':
        return <Plane className="w-5 h-5 text-cyan-400" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case 'home':
        return <Home className="w-5 h-5 text-amber-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
    }
  };

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hypothetical Goals & Milestones
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
              HYPOTHETICAL DEMO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate life goals and observe how multi-asset yield (REITs, InvITs, and Bonds) contributes toward funding specific targets.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hypothetical Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => {
          const shortfall = Math.max(0, g.target_amount - g.current_amount);
          return (
            <div
              key={g.id}
              className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {getCategoryIcon(g.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/10 uppercase">
                      {g.category}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{g.title}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Horizon: {g.time_period}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Progress:</span>
                    <span className="text-cyan-300 font-bold">{g.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(g.progress_percent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Financial Target Metrics */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-white/[0.06] font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Current Accumulated</span>
                    <span className="font-bold text-white mt-0.5 block">{formatCurrency(g.current_amount)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Target Needed</span>
                    <span className="font-bold text-slate-300 mt-0.5 block">{formatCurrency(g.target_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Remaining Gap:</span>
                <span className="font-mono font-semibold text-amber-300">{formatCurrency(shortfall)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c101d] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Add Hypothetical Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Higher Education Fund, Home Downpayment"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0c101d] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Emergency">Emergency Fund</option>
                    <option value="Travel">Travel & Leisure</option>
                    <option value="Education">Education</option>
                    <option value="Home">Home Purchase</option>
                    <option value="Retirement">Retirement Wealth</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Target Horizon</label>
                  <input
                    type="text"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    placeholder="e.g. 24 Months"
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    min="10000"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
