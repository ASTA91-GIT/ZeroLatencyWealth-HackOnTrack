import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Database,
  Building,
  RefreshCw,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

interface BrokerSource {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'Ready to Connect' | 'Connected' | 'Syncing';
  sampleAssets: string;
}

export const PortfolioImportView: React.FC = () => {
  const { refreshPortfolio, showToast, setCurrentView } = useApp();

  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [importedItems, setImportedItems] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);

  const sources: BrokerSource[] = [
    {
      id: 'Broker A',
      name: 'Broker A (Zerodha / Upstox Style)',
      type: 'Direct Equities & ETFs',
      description: 'Simulates API connection to trade records, bringing INFY and Kotak Bank demo shares.',
      status: 'Ready to Connect',
      sampleAssets: 'Equities (Tech & Private Banking)'
    },
    {
      id: 'Broker B',
      name: 'Broker B (Groww / ICICI Style)',
      type: 'Alternative Assets & REITs',
      description: 'Simulates aggregator sync to import Nexus Select Trust REIT and Sovereign Gold Bonds.',
      status: 'Ready to Connect',
      sampleAssets: 'REITs & Sovereign Gold'
    },
    {
      id: 'Depository',
      name: 'Depository (CDSL / NSDL CAS)',
      type: 'Central Depositories',
      description: 'Simulates official depository statement aggregation for NHAI InvIT & REC Tax-Free Bonds.',
      status: 'Ready to Connect',
      sampleAssets: 'InvITs & Institutional Bonds'
    }
  ];

  const stepsList = [
    'CONNECTING',
    'FETCHING DEMO DATA',
    'NORMALIZING ASSETS',
    'CLASSIFYING ASSETS',
    'UNIFIED PORTFOLIO READY'
  ];

  const handleSimulatedConnect = async (sourceName: string) => {
    setConnectingSource(sourceName);
    setImportedItems([]);

    // Step 1: CONNECTING
    setActiveStep('CONNECTING');
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: FETCHING DEMO DATA
    setActiveStep('FETCHING DEMO DATA');
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: NORMALIZING ASSETS
    setActiveStep('NORMALIZING ASSETS');
    await new Promise((r) => setTimeout(r, 700));

    // Step 4: CLASSIFYING ASSETS
    setActiveStep('CLASSIFYING ASSETS');
    await new Promise((r) => setTimeout(r, 600));

    // Execute API Call
    try {
      const res = await api.simulateImport(sourceName);
      setActiveStep('UNIFIED PORTFOLIO READY');
      setImportedItems(res.holdings_added);
      await refreshPortfolio();
      showToast(`Imported ${res.imported_count} holdings from ${sourceName}`, 'success');
    } catch (err) {
      showToast('Error synchronizing source', 'error');
    } finally {
      setConnectingSource(null);
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    try {
      setIsUploadingCsv(true);
      const res = await api.uploadCsv(csvFile);
      setImportedItems(res.holdings_added);
      await refreshPortfolio();
      showToast(res.message, 'success');
      setCsvFile(null);
    } catch (err) {
      showToast('Failed to parse uploaded CSV. Ensure format is valid.', 'error');
    } finally {
      setIsUploadingCsv(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      "Symbol,Name,AssetType,Units,BuyPrice,CurrentPrice\n" +
      "BHARTIARTL,Bharti Airtel Ltd (Demo),EQUITY,40,1180.00,1240.00\n" +
      "IRFC-BOND,IRFC 7.53% Tax-Free Bond 2031,BOND,25,1080.00,1105.00\n" +
      "NEXUS-REIT,Nexus Select Trust REIT (Demo),REIT,80,135.00,141.50\n" +
      "ORIENT-INVIT,Oriental InfraTrust (Demo),INVIT,150,152.00,158.00\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'zerolatency_sample_holdings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded sample portfolio CSV template', 'info');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Portfolio Ingestion & Normalization Simulator
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Simulate multi-broker API synchronization and central depository ingestion. Experience automated SEBI asset normalization into one unified dashboard without exposing real credentials.
        </p>
      </div>

      {/* Pipeline Status Indicator (when active) */}
      {activeStep && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0c101d] to-[#07090e] border border-cyan-500/40 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              INGESTION PIPELINE: <strong className="text-white">{connectingSource || 'PROCESSING'}</strong>
            </span>
            <span className="text-cyan-400 font-bold">{activeStep}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stepsList.map((step, idx) => {
              const currentIdx = stepsList.indexOf(activeStep);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={step}
                  className={`p-2.5 rounded-xl border text-center text-[10px] font-mono font-bold transition-all ${
                    isPast
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                      : isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,242,254,0.3)] animate-pulse'
                      : 'bg-white/[0.02] border-white/5 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    <span>{step}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {activeStep === 'UNIFIED PORTFOLIO READY' && (
            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Holdings integrated into unified portfolio successfully!
              </span>
              <button
                onClick={() => setCurrentView('portfolio')}
                className="text-xs text-cyan-300 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View in Unified Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Simulated Broker Sources Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase">
          SIMULATED BROKERAGE & DEPOSITORY SOURCES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sources.map((s) => {
            const isConnecting = connectingSource === s.id;
            return (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-cyan-300 border border-white/10 font-bold uppercase">
                      {s.type}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">{s.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Sample Assets: <span className="text-slate-300 font-medium">{s.sampleAssets}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSimulatedConnect(s.id)}
                  disabled={Boolean(connectingSource)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>{isConnecting ? 'Simulating Sync...' : `Connect ${s.id}`}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSV Ingestion Section (Real Working File Upload & Parser) */}
      <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Direct CSV Portfolio File Ingestion
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload any standard brokerage holding CSV. Our parser dynamically reads Symbol, Name, Asset Type, Units, and Prices.
            </p>
          </div>

          <button
            onClick={downloadSampleCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/10 hover:border-cyan-400 hover:text-white transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Sample CSV Template</span>
          </button>
        </div>

        <form onSubmit={handleCsvUpload} className="p-6 rounded-xl bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-cyan-500/40 text-center space-y-3 transition-all">
          <input
            type="file"
            accept=".csv"
            id="csv-file-input"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <label htmlFor="csv-file-input" className="cursor-pointer block space-y-2">
            <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
            <div className="text-xs font-semibold text-white">
              {csvFile ? `Selected: ${csvFile.name}` : 'Click to select CSV file or drag and drop here'}
            </div>
            <p className="text-[11px] text-slate-500">Supports .csv statement formats</p>
          </label>

          {csvFile && (
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="submit"
                disabled={isUploadingCsv}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isUploadingCsv ? 'Parsing & Ingesting...' : 'Ingest CSV File Now'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCsvFile(null)}
                className="px-3 py-2 rounded-lg bg-white/10 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Recently Ingested Instruments Log */}
      {importedItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Newly Integrated Holdings</span>
            </h4>
            <span className="text-xs font-mono text-emerald-400">{importedItems.length} Added</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {importedItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate">{item.name}</p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>{item.units} units</span>
                  <span className="text-emerald-400 font-semibold">₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
