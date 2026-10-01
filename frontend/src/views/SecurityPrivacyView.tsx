import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Key,
  Server,
  Database,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface SecurityFeature {
  title: string;
  category: string;
  status: 'IMPLEMENTED' | 'CONCEPTUAL';
  description: string;
  techDetails: string;
}

const SECURITY_MATRIX: SecurityFeature[] = [
  {
    title: 'Zero Brokerage Credential Exposure',
    category: 'Data Minimization',
    status: 'IMPLEMENTED',
    description: 'ZeroLatency strictly simulates brokerage and depository ingestion. Real broker master passwords, TOTPs, or bank API secrets are never requested or stored.',
    techDetails: 'Mock broker connectors & local file CSV parsing without remote credential proxying.'
  },
  {
    title: 'Client-Side Session Token Management',
    category: 'Authentication',
    status: 'IMPLEMENTED',
    description: 'FastAPI stateless JWT token architecture with session isolation for demo and registered users.',
    techDetails: 'Bearer authorization header validation with SHA-256 hashed password verification.'
  },
  {
    title: 'Local Sandboxed SQLite Database',
    category: 'Storage Isolation',
    status: 'IMPLEMENTED',
    description: 'Demo financial data resides locally on developer/judge environment with complete data sovereignty.',
    techDetails: 'Foreign-key relational schema enforcing user-holding ownership boundary constraints.'
  },
  {
    title: 'Deterministic AI Guardrails (Anti-Advice Filter)',
    category: 'Regulatory Compliance',
    status: 'IMPLEMENTED',
    description: 'ZeroLatency Copilot features hardcoded safety guardrails preventing stock recommendations or financial solicitations.',
    techDetails: 'Regex & intent detection intercepting advice prompts, redirecting to educational context.'
  },
  {
    title: 'SEBI Account Aggregator (AA) Framework Integration',
    category: 'Production Custody',
    status: 'CONCEPTUAL',
    description: 'In production, ZeroLatency connects to RBI/SEBI regulated Account Aggregators (Setu, Anumati) using consent-based digital signatures.',
    techDetails: 'Financial Information Provider (FIP) & Financial Information User (FIU) encrypted XML/JSON flow.'
  },
  {
    title: 'AES-256-GCM At-Rest Database Encryption',
    category: 'Data Protection',
    status: 'CONCEPTUAL',
    description: 'Production cloud deployments leverage hardware security modules (HSM) with envelope encryption for all holding balances.',
    techDetails: 'PostgreSQL TDE or AWS KMS customer-managed key rotation.'
  },
  {
    title: 'Differential Privacy in Multi-Asset Insights',
    category: 'Analytics Privacy',
    status: 'CONCEPTUAL',
    description: 'Anonymized aggregation when comparing user multi-asset diversification against peer cohorts without leaking net worth.',
    techDetails: 'Epsilon-differential privacy noise injection into benchmark statistics.'
  }
];

export const SecurityPrivacyView: React.FC = () => {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Security & Privacy Architecture
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Fintech-grade data protection, ethical AI boundaries, and our clear distinction between implemented hackathon safeguards and conceptual production roadmap.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">No Broker Credentials Needed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The platform is built on data minimization principles. We ingest read-only statements and simulated pipes without asking for sensitive trading PINs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-2">
          <EyeOff className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Ethical AI Neutrality</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ZeroLatency Copilot is designed exclusively as an awareness engine. It will never recommend buying or selling any security or promise yields.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-2">
          <Key className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Local Sandbox Isolation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All demo portfolio state is isolated in a lightweight SQLite database with instantaneous reset controls for complete reproducibility.
          </p>
        </div>
      </div>

      {/* Security Matrix Table: IMPLEMENTED vs CONCEPTUAL */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white tracking-wide">
            Implementation Status & Production Roadmap Matrix
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> IMPLEMENTED (4)
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-3.5 h-3.5" /> CONCEPTUAL (3)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono">
                <th className="py-3 px-3">Security Feature</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4">Architecture & Technical Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {SECURITY_MATRIX.map((item, idx) => {
                const isImpl = item.status === 'IMPLEMENTED';
                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${
                        isImpl
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 space-y-1">
                      <p className="text-slate-300">{item.description}</p>
                      <p className="text-[11px] font-mono text-cyan-400/80">{item.techDetails}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
