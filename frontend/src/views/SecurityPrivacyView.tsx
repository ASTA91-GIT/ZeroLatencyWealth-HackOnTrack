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
  Sparkles,
  Layers
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
      <div className="fintech-card p-6 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-theme tracking-tight">
            Security & Privacy Architecture
          </h1>
        </div>
        <p className="text-xs text-muted-theme mt-1.5 max-w-3xl">
          Fintech-grade data protection, ethical AI boundaries, and a transparent distinction between active hackathon safeguards and conceptual production roadmap.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fintech-card p-5 rounded-2xl space-y-2.5 hover:border-purple-500/30 transition-all">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-theme">Zero Broker Credentials Required</h3>
          <p className="text-xs text-muted-theme leading-relaxed">
            The platform is built on data minimization principles. We ingest read-only statements and simulated pipes without asking for sensitive trading PINs or depository master keys.
          </p>
        </div>

        <div className="fintech-card p-5 rounded-2xl space-y-2.5 hover:border-purple-500/30 transition-all">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <EyeOff className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-theme">Ethical AI Neutrality</h3>
          <p className="text-xs text-muted-theme leading-relaxed">
            ZeroLatency Copilot is designed exclusively as an awareness engine. It will never recommend buying or selling any security or promise guaranteed yields.
          </p>
        </div>

        <div className="fintech-card p-5 rounded-2xl space-y-2.5 hover:border-purple-500/30 transition-all">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Key className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-theme">Local Sandbox Sovereignty</h3>
          <p className="text-xs text-muted-theme leading-relaxed">
            All demo portfolio state is isolated in a lightweight SQLite database with instantaneous reset controls for complete demo reproducibility.
          </p>
        </div>
      </div>

      {/* Security Matrix Table: IMPLEMENTED vs CONCEPTUAL */}
      <div className="fintech-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme pb-4">
          <div>
            <h3 className="text-base font-bold text-theme tracking-wide">
              Implementation Status & Production Roadmap Matrix
            </h3>
            <p className="text-xs text-muted-theme mt-0.5">
              Clear verification criteria for hackathon evaluation and compliance boundaries
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> IMPLEMENTED (4)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-3.5 h-3.5" /> CONCEPTUAL (3)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-theme text-muted-theme font-mono">
                <th className="py-3 px-3">Security Feature</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4">Architecture & Technical Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme text-muted-theme">
              {SECURITY_MATRIX.map((item, idx) => {
                const isImpl = item.status === 'IMPLEMENTED';
                return (
                  <tr key={idx} className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-theme">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-muted-theme">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border font-mono ${
                        isImpl
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <p className="text-theme">{item.description}</p>
                      <p className="text-[11px] font-mono text-purple-400">{item.techDetails}</p>
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
