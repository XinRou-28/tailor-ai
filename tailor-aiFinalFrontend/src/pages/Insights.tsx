import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import { motion, AnimatePresence } from "motion/react";

interface RangeData {
  accountsCount: number;
  affectedTier: string;
  confidence: string;
  vsPeriod: string;
  analyticsUnused: number;
  poorOnboarding: number;
  missingIntegrations: number;
  paymentFriction: number;
  analyticsCount: number;
  onboardingCount: number;
  integrationsCount: number;
  pulseValue: string;
  analyticsUnusedSub: string;
}

const dataByRange: Record<string, RangeData> = {
  "7d": {
    accountsCount: 124,
    affectedTier: "Enterprise",
    confidence: "Medium",
    vsPeriod: "1 pt",
    analyticsUnused: 38,
    poorOnboarding: 35,
    missingIntegrations: 12,
    paymentFriction: 15,
    analyticsCount: 15,
    onboardingCount: 24,
    integrationsCount: 8,
    pulseValue: "$11k",
    analyticsUnusedSub: "Concentrated in Enterprise-tier accounts onboarded in the last 7 days."
  },
  "30d": {
    accountsCount: 524,
    affectedTier: "Enterprise",
    confidence: "High",
    vsPeriod: "3 pts",
    analyticsUnused: 42,
    poorOnboarding: 30,
    missingIntegrations: 18,
    paymentFriction: 10,
    analyticsCount: 62,
    onboardingCount: 114,
    integrationsCount: 28,
    pulseValue: "$42k",
    analyticsUnusedSub: "Concentrated in Enterprise-tier accounts onboarded in the last 90 days."
  },
  "90d": {
    accountsCount: 1480,
    affectedTier: "Enterprise Plus",
    confidence: "High",
    vsPeriod: "8 pts",
    analyticsUnused: 45,
    poorOnboarding: 28,
    missingIntegrations: 15,
    paymentFriction: 12,
    analyticsCount: 188,
    onboardingCount: 312,
    integrationsCount: 94,
    pulseValue: "$126k",
    analyticsUnusedSub: "Concentrated across multiple mid-market & Enterprise accounts."
  }
};

export default function Insights({ cachedInsights }: { cachedInsights: { total_accounts: number; top_reasons: any[]; ai_pulse?: string; ai_strategy?: string; affected_tier?: string; avg_confidence?: number } | null }) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const insightsData = cachedInsights ?? { total_accounts: 0, top_reasons: [], ai_pulse: "", ai_strategy: "", affected_tier: "N/A", avg_confidence: 0 };
  const activeData = dataByRange[timeRange];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast("Insights report exported successfully in CSV format.");
    }, 1200);
  };

  // Mock interactive drilldowns for bottom detail list rows
  const getPatternDetails = (patternName: string) => {
    switch (patternName) {
      case "Advanced Analytics unused":
        return {
          title: "Advanced Analytics Unused",
          count: activeData.analyticsCount,
          description: "Accounts upgraded or signed up to Enterprise, but haven't query-hit the analytical endpoints for 14+ days.",
          affected: [
            { name: "Acme Global", value: "$45,000 MRR", risk: "92% Churn Probability", tier: "Enterprise" },
            { name: "Initech Systems", value: "$15,000 MRR", risk: "88% Churn Probability", tier: "Pro Tier" },
            { name: "Delta Aviation", value: "$22,000 MRR", risk: "74% Churn Probability", tier: "Enterprise" }
          ]
        };
      case "Partial Onboarding completion":
        return {
          title: "Partial Onboarding Completion",
          count: activeData.onboardingCount,
          description: "Accounts stuck in onboarding pipeline, missing critical setup checkboxes.",
          affected: [
            { name: "Globex Corp", value: "$38,000 MRR", risk: "62% Churn Probability", tier: "Enterprise" },
            { name: "Tyrell Tech", value: "$18,000 MRR", risk: "54% Churn Probability", tier: "Pro Tier" },
            { name: "Weyland Industries", value: "$55,000 MRR", risk: "71% Churn Probability", tier: "Enterprise Plus" }
          ]
        };
      case "Missing core integrations":
        return {
          title: "Missing Core Integrations",
          count: activeData.integrationsCount,
          description: "Data-dependent accounts that haven't authorized Stripe, Salesforce, or Hubspot APIs.",
          affected: [
            { name: "Cyberdyne Systems", value: "$28,000 MRR", risk: "79% Churn Probability", tier: "Enterprise" },
            { name: "Soylent Green Co", value: "$12,000 MRR", risk: "66% Churn Probability", tier: "Pro Tier" }
          ]
        };
      default:
        return null;
    }
  };

  const patternDetails = selectedPattern ? getPatternDetails(selectedPattern) : null;

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full relative" id="insights-view-container">
      {/* Background Glows */}
      <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.06] blur-[100px] pointer-events-none -z-10" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.06] blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[140px] pointer-events-none -z-10" />

      {/* Dynamic Toast Alert banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 text-white px-4.5 py-2.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.15)] z-50 flex items-center gap-3 relative overflow-hidden"
          >
            <span className="material-symbols-outlined text-cyan-400 animate-pulse">check_circle</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10" id="insights-header">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-1.5">Insights</h1>
          <p className="text-slate-400 text-sm">
            Company-wide patterns across your portfolio — this week's read across {activeData.accountsCount} accounts.
          </p>
        </div>
        <div className="flex bg-white/[0.03] backdrop-blur-md border border-white/10 p-1 rounded-xl gap-1.5">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              timeRange === "7d"
                ? "bg-white/10 border border-cyan-400/40 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.18)]"
                : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              timeRange === "30d"
                ? "bg-white/10 border border-cyan-400/40 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.18)]"
                : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              timeRange === "90d"
                ? "bg-white/10 border border-cyan-400/40 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.18)]"
                : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            Last 90 days
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left Column: Top reasons for value loss */}
        <div className="lg:col-span-9">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1b153a] via-[#09081a] to-[#160d30] border border-purple-500/25 border-t-purple-400/40 border-b-indigo-950 rounded-3xl p-6 md:p-8 h-full shadow-[0_16px_48px_rgba(139,92,246,0.2),_inset_0_1px_1px_rgba(255,255,255,0.07)] hover:border-purple-400/50 hover:shadow-[0_20px_56px_rgba(139,92,246,0.28)] transition-all duration-300 flex flex-col before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px] before:bg-gradient-to-b before:from-pink-500 before:via-purple-600 before:to-indigo-600">
            {/* Ambient inner glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[45px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/5 rounded-full blur-[35px] pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-rose-400 text-xl font-bold bg-rose-500/15 p-1.5 rounded-lg border border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.2)]" data-icon="trending_down">trending_down</span>
                <h3 className="text-sm font-bold text-slate-100 tracking-tight">Top reasons for value loss</h3>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md hover:border-purple-500/30"
              >
                {isExporting ? "Exporting..." : "Export Analysis"}{" "}
                <span className="material-symbols-outlined !text-[14px]">download</span>
              </button>
            </div>
            
            <div className="space-y-4 relative z-10">
              
             {insightsData.top_reasons.map((reason, idx) => {
  const colors = [
    "from-cyan-400 via-indigo-400 to-purple-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]",
    "from-violet-400 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    "from-sky-400 via-indigo-400 to-purple-500 shadow-[0_0_8px_rgba(56,189,248,0.4)]",
    "from-emerald-400 via-teal-400 to-indigo-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]",
    "from-amber-400 via-orange-400 to-rose-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    "from-rose-400 via-pink-500 to-purple-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
  ];
  return (
    <div key={reason.reason_code} className="flex items-center justify-between gap-5 bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/[0.06] hover:border-purple-500/30 hover:-translate-y-[1.5px] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.15)]">
      <div className="flex-1 space-y-2">
        <div>
          <h4 className="text-sm font-bold text-slate-100 tracking-tight">{reason.label}</h4>
          <p className="text-[11px] text-purple-100/75 font-medium leading-normal mt-0.5">{reason.count} accounts affected</p>
        </div>
        <div className="h-1.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${reason.pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full`}
          ></motion.div>
        </div>
      </div>
      <span className="text-2xl font-black text-white flex-shrink-0 min-w-[60px] text-right font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">{reason.pct}%</span>
    </div>
  );
})}
            </div>
          </div>
        </div>

        {/* Right Column: At a glance & AI Pulse */}
        <div className="flex flex-col gap-5 lg:col-span-3">
          
          {/* At a glance card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 border-t border-white/20 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,.45)] p-5 md:p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <h3 className="text-sm font-semibold text-white tracking-tight mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
              At a glance
            </h3>
            <div className="divide-y divide-white/10">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Accounts</span>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">{insightsData.total_accounts}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Affected tier</span>
                <span className="px-2.5 py-0.5 bg-amber-400/10 border border-amber-400/20 text-amber-200 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md">
                  {insightsData.affected_tier}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">Confidence</span>
                <span className="px-2.5 py-0.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md">
                  {Math.round((insightsData.avg_confidence ?? 0) * 100)}%
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400 text-xs font-medium">vs. period</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  <span className="material-symbols-outlined !text-[14px] text-emerald-400">arrow_downward</span> {activeData.vsPeriod}
                </span>
              </div>
            </div>
          </div>

          {/* AI Pulse Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#12132e] via-[#08081a] to-[#171032] backdrop-blur-2xl border border-indigo-500/25 border-t-indigo-400/35 border-b-indigo-950 rounded-3xl p-5 md:p-6 flex-1 flex flex-col shadow-[0_24px_50px_rgba(0,0,0,0.65),_inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-indigo-400/45">
            {/* Ambient radial glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[35px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-[35px] pointer-events-none" />
            
            {/* Top light bar */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/40 to-teal-500/15 pointer-events-none"></div>

            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <div className="relative w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md">
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm pointer-events-none" />
                <span className="material-symbols-outlined text-cyan-300 text-lg relative z-10" data-icon="auto_awesome">auto_awesome</span>
              </div>
              <h4 className="text-[11px] font-bold text-cyan-200 tracking-wider uppercase mb-1.5">AI Pulse</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {insightsData.ai_pulse || "Not enough data yet to detect a pattern."}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Action Bar Section */}
      <section className="w-full relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#12132e] via-[#08081a] to-[#171032] backdrop-blur-2xl border border-indigo-500/25 border-t-indigo-400/35 border-b-indigo-950 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.65),_inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-indigo-400/45">
          {/* Ambient radial glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
          
          {/* Top light bar */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/40 to-teal-500/15 pointer-events-none"></div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4 shadow-[0_0_12px_rgba(99,102,241,0.15)] animate-pulse">
                <span className="material-symbols-outlined !text-[13px]">bolt</span>
                PATTERN → STRATEGY
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mb-2.5">Retention Strategy</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {insightsData.ai_strategy || "Once more accounts are scored, this section will surface a recommended action."}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-indigo-300/80 italic font-medium bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-xl">Suggested next step</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom Detail Rows Drilldown Modal */}
      <AnimatePresence>
        {selectedPattern && patternDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 border-t border-white/20 rounded-3xl w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400">explore</span>
                    {patternDetails.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Surfaced cohort analysis — {patternDetails.count} affected accounts</p>
                </div>
                <button
                  onClick={() => setSelectedPattern(null)}
                  className="material-symbols-outlined text-slate-400 hover:text-rose-400 p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  close
                </button>
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-300 font-semibold mb-2">Pattern Description</p>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl italic">
                  "{patternDetails.description}"
                </p>
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-300 font-semibold mb-2">Critical High-Value Accounts Stuck in Cohort</p>
                <div className="divide-y divide-white/10 max-h-56 overflow-y-auto pr-1">
                  {patternDetails.affected.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs hover:bg-white/[0.04] transition-all px-2.5 rounded-xl border border-transparent">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">{item.tier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-cyan-300">{item.value}</p>
                        <p className="text-rose-400 font-semibold font-mono text-[10px] mt-0.5">{item.risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setSelectedPattern(null);
                    triggerToast(`CSM Concierge sync initiated for all ${patternDetails.count} affected accounts in queue.`);
                  }}
                  className="px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/30 font-semibold text-xs rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                >
                  <span className="material-symbols-outlined text-xs">mail</span> Flag CSM Concierge Team
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
