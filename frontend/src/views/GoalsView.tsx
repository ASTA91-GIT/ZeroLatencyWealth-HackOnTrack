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
  Trash2,
  X,
  Sparkles
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { showToast, theme } = useApp();
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
        return <Plane className="w-5 h-5 text-purple-400" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'home':
        return <Home className="w-5 h-5 text-amber-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
    }
  };

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="fintech-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-theme tracking-tight">
              Hypothetical Goals & Milestones
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
              SIMULATION
            </span>
          </div>
          <p className="text-xs text-muted-theme mt-1.5 max-w-2xl">
            Simulate life goals and observe how multi-asset yield (REITs quarterly distributions, InvIT cash flows, and Sovereign Gold / Corporate Bonds) steadily compound toward funding specific capital targets.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="fintech-card p-6 rounded-2xl h-48 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => {
            const shortfall = Math.max(0, g.target_amount - g.current_amount);
            const progress = Math.min(g.progress_percent, 100);

            return (
              <div
                key={g.id}
                className="fintech-card p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-purple-500/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      {getCategoryIcon(g.category)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-purple-500/5 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                        {g.category}
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="p-1 rounded text-muted-theme hover:text-rose-400 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-theme tracking-tight group-hover:text-purple-400 transition-colors">
                      {g.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-theme mt-1">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>Horizon: {g.time_period}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-theme">Funded Ratio:</span>
                      <span className="text-purple-400 font-bold">{g.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-theme">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Target Metrics */}
                  <div className="pt-3 grid grid-cols-2 gap-2 text-xs border-t border-theme font-mono">
                    <div>
                      <span className="text-[10px] text-muted-theme block uppercase tracking-wider">Current Accumulated</span>
                      <span className="font-bold text-theme mt-0.5 block">{formatCurrency(g.current_amount)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-theme block uppercase tracking-wider">Target Capital</span>
                      <span className="font-bold text-muted-theme mt-0.5 block">{formatCurrency(g.target_amount)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-center justify-between text-[11px]">
                  <span className="text-muted-theme">Remaining Gap:</span>
                  <span className="font-mono font-bold text-amber-400">{formatCurrency(shortfall)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 shadow-2xl space-y-5 border-purple-500/30">
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <h3 className="text-base font-bold text-theme flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Add Hypothetical Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-theme hover:text-theme p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="text-theme font-semibold block mb-1.5">Goal Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Higher Education Fund, Home Downpayment"
                  className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-theme focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-theme font-semibold block mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-theme focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                  >
                    <option value="Emergency">Emergency Fund</option>
                    <option value="Travel">Travel & Leisure</option>
                    <option value="Education">Education</option>
                    <option value="Home">Home Purchase</option>
                    <option value="Retirement">Retirement Wealth</option>
                  </select>
                </div>

                <div>
                  <label className="text-theme font-semibold block mb-1.5">Target Horizon</label>
                  <input
                    type="text"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    placeholder="e.g. 24 Months"
                    className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-theme focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-theme font-semibold block mb-1.5">Target Amount (₹)</label>
                  <input
                    type="number"
                    min="10000"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-theme focus:outline-none font-mono focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-theme font-semibold block mb-1.5">Current Saved (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full bg-surface-2 border border-theme focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-theme focus:outline-none font-mono focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-theme">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-muted-theme hover:text-theme font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
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
