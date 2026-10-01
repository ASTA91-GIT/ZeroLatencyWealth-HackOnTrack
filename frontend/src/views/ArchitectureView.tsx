import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Shield,
  Sparkles,
  Server,
  Code,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  techStack: string;
  responsibilities: string[];
  samplePayload?: string;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: 'user',
    name: '1. Retail Investor / Judge',
    category: 'Client Actor',
    shortDesc: 'Interacts with high-frequency financial terminal and educational awareness modules.',
    techStack: 'Web Browser / Responsive Desktop Client',
    responsibilities: [
      'Authenticates via 1-click Demo Account or session credentials',
      'Inspects consolidated multi-broker portfolio balances (₹8,42,500 benchmark)',
      'Uploads broker CSV statements or simulates aggregator sync',
      'Asks natural language queries to ZeroLatency Copilot'
    ]
  },
  {
    id: 'frontend',
    name: '2. React 19 Frontend',
    category: 'Presentation Layer',
    shortDesc: 'Vite + React 19 + TypeScript + Tailwind CSS terminal with Recharts data visualizers.',
    techStack: 'React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts',
    responsibilities: [
      'Stateless view routing across Dashboard, Holdings, Explorer, Insights, Goals, Academy',
      'Real-time donut & area chart rendering with fractional currency precision',
      'Optimistic state updates with slide-out Copilot drawer',
      'Accessible dark-first fintech terminal aesthetics with electric cyan accents'
    ],
    samplePayload: JSON.stringify({
      view: 'portfolio',
      filters: { asset_type: 'REIT', source: 'Broker A' },
      active_currency: 'INR'
    }, null, 2)
  },
  {
    id: 'api',
    name: '3. FastAPI REST Gateway',
    category: 'Backend Controller',
    shortDesc: 'Asynchronous Python API server with strict Pydantic validation & CORS middleware.',
    techStack: 'Python 3.14, FastAPI 0.141, Uvicorn, Pydantic v2',
    responsibilities: [
      'Provides REST endpoints (/api/portfolio, /api/assets, /api/insights, /api/copilot/chat)',
      'Enforces request data models with schema type safety',
      'Orchestrates asynchronous service layer tasks with sub-millisecond response latency',
      'Manages lifespan database seeding on application launch'
    ],
    samplePayload: JSON.stringify({
      endpoint: 'GET /api/portfolio/summary',
      status: 200,
      benchmark_total: 842500.0,
      latency_ms: 1.8
    }, null, 2)
  },
  {
    id: 'auth',
    name: '4. Authentication & Session Manager',
    category: 'Security Service',
    shortDesc: 'Stateless session handling, demo mode credential generation, and profile management.',
    techStack: 'FastAPI Depends, SHA-256 Token Vault, User Isolation',
    responsibilities: [
      'Provides instant 1-click demo access with preloaded multi-asset fixtures',
      'Maintains user identity boundary across database queries',
      'Enforces demo mode isolation and instant canonical reset functionality'
    ]
  },
  {
    id: 'aggregation',
    name: '5. Portfolio Aggregation Service',
    category: 'Data Ingestion',
    shortDesc: 'Simulates multi-broker API sync (Broker A, Broker B, Depository) and parses CSVs.',
    techStack: 'Python csv parser, Ingestion Pipelines, Mock Connectors',
    responsibilities: [
      'Simulates multi-broker authentication handshakes and holding synchronization',
      'Parses user-uploaded holding CSV statements with robust column mapping',
      'Deduplicates incoming asset symbols against master security reference records'
    ]
  },
  {
    id: 'normalization',
    name: '6. Data Normalization Engine',
    category: 'Data Engineering',
    shortDesc: 'Standardizes disparate ticker symbols, price units, and buy bases into uniform schemas.',
    techStack: 'Pandas-style normalizers, SEBI Master Scheme Mappings',
    responsibilities: [
      'Transforms heterogeneous broker schemas into canonical HoldingModel structure',
      'Normalizes price formats, lots, units, and fractional debenture denominations',
      'Recalculates invested basis and current mark-to-market valuations'
    ]
  },
  {
    id: 'classification',
    name: '7. Asset Classification Engine',
    category: 'Taxonomy Classifier',
    shortDesc: 'Categorizes instruments into four distinct pillars: EQUITY, BOND, REIT, and INVIT.',
    techStack: 'SEBI Security Categorization Rules, Master Metadata Lookup',
    responsibilities: [
      'Assigns statutory asset class tags based on security registration',
      'Determines distribution yield mechanisms (Rent vs Coupon vs Tariff vs Dividend)',
      'Assigns risk rating (Low, Moderate, High) and secondary liquidity tiers'
    ]
  },
  {
    id: 'analytics',
    name: '8. Analytics & Diagnostics Engine',
    category: 'Quantitative Service',
    shortDesc: 'Computes portfolio weights, income forecasts, and concentration risk metrics.',
    techStack: 'Python Vector Math, Weighted Yield Calculator, Time Series Engine',
    responsibilities: [
      'Computes exact percentage allocations (Equities 52%, Bonds 18%, REITs 15%, InvITs 10%)',
      'Calculates total projected annual cash flow (₹37,362 at 4.43% weighted yield)',
      'Generates 12-month historical mark-to-market performance snapshots',
      'Flags single-holding concentration risks exceeding 20%'
    ],
    samplePayload: JSON.stringify({
      allocations: { EQUITY: 52.0, BOND: 18.1, REIT: 14.9, INVIT: 10.0, OTHER: 5.0 },
      annual_projected_cashflow: 37361.93,
      weighted_yield: 4.43
    }, null, 2)
  },
  {
    id: 'copilot',
    name: '9. AI Explanation Layer (Copilot)',
    category: 'Intelligence Engine',
    shortDesc: 'Educational LLM abstraction with deterministic fallback and advice guardrails.',
    techStack: 'AI Service Abstraction, Deterministic Intent Engine, Guardrail Policy',
    responsibilities: [
      'Ingests live portfolio context to explain user holdings in natural language',
      'Explains mechanics of REITs, InvITs, and Sovereign Bonds in beginner-friendly terms',
      'Blocks buy/sell recommendations and speculative price targets with strict educational disclaimers',
      'Runs 100% deterministically without requiring external API keys'
    ]
  },
  {
    id: 'database',
    name: '10. SQLite Database',
    category: 'Persistence Layer',
    shortDesc: 'Relational local database storing users, assets, holdings, goals, and snapshots.',
    techStack: 'SQLite3, Relational Foreign Keys, Local Database File',
    responsibilities: [
      'Stores master asset registry, holdings, transactions, and user goals',
      'Supports transactional integrity and atomic demo resets',
      'Zero external cloud dependencies needed to run'
    ]
  }
];

export const ArchitectureView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(ARCH_NODES[1]); // Default React Frontend

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            System Architecture & Pipeline Flow
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Interactive full-stack architecture diagram illustrating the complete journey: from retail broker aggregation and SEBI asset classification to analytics and AI-powered awareness.
        </p>
      </div>

      {/* Interactive Horizontal Pipeline Visualizer */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <h3 className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase">
          CLICK ANY PIPELINE NODE TO INSPECT SUBSYSTEM DETAILS
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ARCH_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-mono text-cyan-400 block">{node.category}</span>
                <span className="text-xs font-bold block mt-1 truncate">{node.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Technical Details Drawer / Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-cyan-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                {selectedNode.category}
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">SUBSYSTEM DEEP-DIVE</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1 tracking-tight">
              {selectedNode.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{selectedNode.shortDesc}</p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-300">
            Stack: {selectedNode.techStack}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Core Responsibilities & Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedNode.responsibilities.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample JSON / Technical Payload */}
        {selectedNode.samplePayload && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Runtime Diagnostic Payload
            </h4>
            <div className="p-4 rounded-xl bg-[#07090e] border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto">
              <pre>{selectedNode.samplePayload}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
