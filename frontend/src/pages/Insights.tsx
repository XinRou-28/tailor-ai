import { useState, FormEvent } from "react";
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

export default function Insights() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Strategy actions state
  const [strategyApplied, setStrategyApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modals state
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  // Editable Standing Fix details
  const [standingFix, setStandingFix] = useState({
    targetTier: "Enterprise",
    enableDay: 1,
    inviteDay: 7,
    status: "Active"
  });

  const activeData = dataByRange[timeRange];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApplyStrategy = () => {
    if (strategyApplied) {
      setStrategyApplied(false);
      triggerToast("Onboarding fix strategy deactivated company-wide.");
      return;
    }
    
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setStrategyApplied(true);
      triggerToast(`Strategy deployed: Auto-enable 'Advanced Dashboards' on Day ${standingFix.enableDay} and CSM concierge invite on Day ${standingFix.inviteDay} is now active.`);
    }, 800);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast("Insights report exported successfully in CSV format.");
    }, 1200);
  };

  const handleSaveCustomize = (e: FormEvent) => {
    e.preventDefault();
    setShowCustomizeModal(false);
    triggerToast("Enterprise Onboarding Fix standing parameters updated.");
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
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full" id="insights-view-container">
      {/* Dynamic Toast Alert banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="insights-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0.5">Insights</h1>
          <p className="text-gray-500 text-sm">
            Company-wide patterns across your portfolio — this week's read across {activeData.accountsCount} accounts.
          </p>
        </div>
        <div className="flex bg-surface-container p-0.5 rounded-lg">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              timeRange === "7d"
                ? "bg-surface-container-lowest text-primary shadow-sm rounded-md"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              timeRange === "30d"
                ? "bg-surface-container-lowest text-primary shadow-sm rounded-md"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              timeRange === "90d"
                ? "bg-surface-container-lowest text-primary shadow-sm rounded-md"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Last 90 days
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Top reasons for value loss */}
        <div className="lg:col-span-9">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 md:p-6 shadow-sm h-full hover:border-primary/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-xl" data-icon="trending_down">trending_down</span>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Top reasons for value loss</h3>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="text-secondary text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : "Export Analysis"}{" "}
                <span className="material-symbols-outlined !text-[14px]">download</span>
              </button>
            </div>
            
            <div className="space-y-4">
              
              {/* Item 1 */}
              <div className="flex items-center justify-between gap-5">
                <div className="flex-1 space-y-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Advanced Analytics unused</h4>
                    <p className="text-[11px] text-gray-400 leading-normal">{activeData.analyticsUnusedSub}</p>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeData.analyticsUnused}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-[#f97316] rounded-full"
                    ></motion.div>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-error flex-shrink-0 min-w-[60px] text-right">{activeData.analyticsUnused}%</span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between gap-5">
                <div className="flex-1 space-y-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Poor onboarding completion</h4>
                    <p className="text-[11px] text-gray-400 leading-normal">Most common single cause the Investigation Agent surfaces on medium-confidence cases.</p>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeData.poorOnboarding}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    ></motion.div>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-primary flex-shrink-0 min-w-[60px] text-right">{activeData.poorOnboarding}%</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between gap-5">
                <div className="flex-1 space-y-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Missing integrations (Stripe / Salesforce)</h4>
                    <p className="text-[11px] text-gray-400 leading-normal">Accounts that never connected a core data source in their first 14 days.</p>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeData.missingIntegrations}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-on-tertiary-container rounded-full"
                    ></motion.div>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-on-tertiary-container flex-shrink-0 min-w-[60px] text-right">{activeData.missingIntegrations}%</span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between gap-5">
                <div className="flex-1 space-y-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Payment friction</h4>
                    <p className="text-[11px] text-gray-400 leading-normal">Repeated failed charges — routed to support, not treated as a churn signal.</p>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeData.paymentFriction}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-green-500 rounded-full"
                    ></motion.div>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-green-600 flex-shrink-0 min-w-[60px] text-right">{activeData.paymentFriction}%</span>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: At a glance & AI Pulse */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          
          {/* At a glance card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 md:p-5 shadow-sm hover:border-primary/20 transition-all duration-200">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-3">At a glance</h3>
            <div className="divide-y divide-outline-variant/50">
              <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500 text-xs font-medium">Accounts</span>
                <span className="text-sm font-bold text-gray-900">{activeData.accountsCount}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500 text-xs font-medium">Affected tier</span>
                <span className="px-1.5 py-0.5 bg-orange-50 text-[#f97316] rounded text-[9px] font-bold uppercase tracking-wider">
                  {activeData.affectedTier}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500 text-xs font-medium">Confidence</span>
                <span className="px-1.5 py-0.5 bg-surface-container-high text-primary rounded text-[9px] font-bold uppercase tracking-wider">
                  {activeData.confidence}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500 text-xs font-medium">vs. period</span>
                <span className="text-green-600 font-bold flex items-center gap-0.5 text-xs">
                  <span className="material-symbols-outlined !text-[15px]">arrow_downward</span> {activeData.vsPeriod}
                </span>
              </div>
            </div>
          </div>

          {/* AI Pulse Card */}
          <div className="bg-primary-container text-white rounded-xl p-4 md:p-5 shadow-lg flex-1 min-h-[190px] relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-secondary-fixed-dim mb-2 text-lg" data-icon="auto_awesome">auto_awesome</span>
              <h4 className="text-xs font-bold text-white tracking-tight uppercase mb-2">AI Pulse</h4>
              <p className="text-[11px] text-indigo-100/80 leading-normal mb-3">
                "The correlation between <strong>Advanced Analytics</strong> usage and <strong>LTV expansion</strong> is strengthening. Current patterns suggest a {activeData.pulseValue} recovery opportunity if the {standingFix.targetTier} onboarding flow is modified."
              </p>
            </div>
            <div className="relative z-10 mt-auto">
              <button
                onClick={() => setShowForecastModal(true)}
                className="w-full bg-secondary text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 hover:bg-opacity-90 cursor-pointer"
              >
                View Forecast Model
              </button>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#645efb_0%,_transparent_50%)]"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Action Bar Section */}
      <section className="w-full">
        <div className="bg-primary text-white rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-fixed-dim border border-secondary/30 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3">
                <span className="material-symbols-outlined !text-[13px]">bolt</span>
                PATTERN → STRATEGY
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1.5">Mandatory Enterprise Onboarding Fix</h3>
              <p className="text-xs text-indigo-100/80 leading-normal">
                Based on account behavior in the last {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days, we recommend a standing fix for the {standingFix.targetTier} tier: Auto-enable 'Advanced Dashboards' on day {standingFix.enableDay} and trigger a CSM concierge invite if unused by day {standingFix.inviteDay}.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={handleApplyStrategy}
                disabled={isApplying}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1 min-w-[130px] ${
                  strategyApplied
                    ? "bg-green-600 text-white"
                    : "bg-white text-primary hover:bg-surface-container"
                }`}
              >
                {isApplying ? (
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                ) : strategyApplied ? (
                  <>
                    <span className="material-symbols-outlined text-xs">check_circle</span> Active
                  </>
                ) : (
                  "Apply Strategy"
                )}
              </button>
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="border border-outline-variant text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer text-center"
              >
                Customize Actions
              </button>
            </div>
          </div>
          
          {/* Detail Row List - Matching Dashboard Card Sub-styles */}
          <div className="bg-white/5 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              <div
                onClick={() => setSelectedPattern("Advanced Analytics unused")}
                className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-secondary-fixed-dim text-lg font-extrabold">{activeData.analyticsCount}</span>
                  <span className="text-primary-fixed/80 text-[10px] font-bold uppercase tracking-wider">Advanced Analytics unused</span>
                </div>
                <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1 transition-transform !text-[16px]">arrow_forward</span>
              </div>

              <div
                onClick={() => setSelectedPattern("Partial Onboarding completion")}
                className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-secondary-fixed-dim text-lg font-extrabold">{activeData.onboardingCount}</span>
                  <span className="text-primary-fixed/80 text-[10px] font-bold uppercase tracking-wider">Partial Onboarding completion</span>
                </div>
                <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1 transition-transform !text-[16px]">arrow_forward</span>
              </div>

              <div
                onClick={() => setSelectedPattern("Missing core integrations")}
                className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-secondary-fixed-dim text-lg font-extrabold">{activeData.integrationsCount}</span>
                  <span className="text-primary-fixed/80 text-[10px] font-bold uppercase tracking-wider">Missing core integrations</span>
                </div>
                <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1 transition-transform !text-[16px]">arrow_forward</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 1. View Forecast Model Modal */}
      <AnimatePresence>
        {showForecastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-outline-variant rounded-2xl w-full max-w-2xl p-5 md:p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight">Predictive Churn Forecast Model</h3>
                  <p className="text-[11px] text-gray-500">LTV Expansion opportunities vs. active onboarding intervention triggers.</p>
                </div>
                <button
                  onClick={() => setShowForecastModal(false)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  close
                </button>
              </div>

              {/* Dynamic Interactive SVG Area Chart */}
              <div className="mb-4 bg-slate-50 border border-outline-variant/40 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2 text-[10px] text-on-surface-variant">
                  <span className="font-bold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span> Active Concierge (Projected)
                  </span>
                  <span className="font-bold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-gray-400 inline-block border-t-2 border-dashed border-gray-600"></span> Unassisted (Baseline)
                  </span>
                </div>
                
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full" viewBox="0 0 600 240">
                    {/* Grids */}
                    <line x1="50" y1="20" x2="550" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="70" x2="550" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="120" x2="550" y2="120" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="170" x2="550" y2="170" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="220" x2="550" y2="220" stroke="#d1d5db" strokeWidth="1.5" />

                    {/* Chart Gradient Area */}
                    <defs>
                      <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4b41e1" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#4b41e1" stopOpacity="0.00"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 50,180 L 150,150 L 250,90 L 350,50 L 450,35 L 550,30 L 550,220 L 50,220 Z"
                      fill="url(#gradient-area)"
                    />

                    {/* Baseline dashed path */}
                    <path
                      d="M 50,180 L 150,190 L 250,205 L 350,210 L 450,215 L 550,218"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Projected active path */}
                    <path
                      d="M 50,180 L 150,150 L 250,90 L 350,50 L 450,35 L 550,30"
                      fill="none"
                      stroke="#4b41e1"
                      strokeWidth="3.5"
                    />

                    {/* Markers */}
                    <circle cx="50" cy="180" r="5" fill="#4b41e1" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="150" cy="150" r="5" fill="#4b41e1" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="250" cy="90" r="5" fill="#4b41e1" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="350" cy="50" r="5" fill="#4b41e1" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="450" cy="35" r="5" fill="#4b41e1" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="550" cy="30" r="5" fill="#4b41e1" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Labels */}
                    <text x="50" y="235" fontSize="10" textAnchor="middle" fill="#6b7280" fontWeight="bold">Jul (Start)</text>
                    <text x="150" y="235" fontSize="10" textAnchor="middle" fill="#6b7280">Aug</text>
                    <text x="250" y="235" fontSize="10" textAnchor="middle" fill="#6b7280">Sep</text>
                    <text x="350" y="235" fontSize="10" textAnchor="middle" fill="#6b7280">Oct</text>
                    <text x="450" y="235" fontSize="10" textAnchor="middle" fill="#6b7280">Nov</text>
                    <text x="550" y="235" fontSize="10" textAnchor="middle" fill="#6b7280" fontWeight="bold">Dec (End)</text>

                    {/* Value indicators */}
                    <text x="560" y="32" fontSize="11" fill="#4b41e1" fontWeight="bold">92%</text>
                    <text x="560" y="222" fontSize="11" fill="#9ca3af">18%</text>
                  </svg>
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-lg border-l-2 border-secondary text-xs mb-4">
                <span className="font-bold text-gray-900 block mb-0.5">Impact Highlight</span>
                <p className="text-[11px] text-gray-600 leading-normal">
                  Modifying the Enterprise onboarding strategy triggers a predicted <strong className="text-secondary font-bold">42% lift in renewal conversions</strong>. Real-time cohort modeling values this intervention at approximately <strong className="text-primary font-bold">{activeData.pulseValue} in recovered ARR</strong> over the next two billing quarters.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowForecastModal(false)}
                  className="px-3.5 py-1.5 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-opacity-90 transition-all cursor-pointer"
                >
                  Acknowledge Forecast
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Customize Actions Modal */}
      <AnimatePresence>
        {showCustomizeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-outline-variant rounded-2xl w-full max-w-md p-5 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Customize Intervention Rules</h3>
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  close
                </button>
              </div>
              <form onSubmit={handleSaveCustomize} className="flex flex-col gap-3.5 text-sm">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Target Account Tier</label>
                  <select
                    value={standingFix.targetTier}
                    onChange={(e) => setStandingFix({ ...standingFix, targetTier: e.target.value })}
                    className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-xs"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Enterprise Plus">Enterprise Plus</option>
                    <option value="Pro Tier">Pro Tier</option>
                    <option value="All Accounts">All Accounts</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Enable Dashboards</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-bold">Day</span>
                      <input
                        type="number"
                        required
                        min={1}
                        max={14}
                        value={standingFix.enableDay}
                        onChange={(e) => setStandingFix({ ...standingFix, enableDay: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">CSM Concierge Invite</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-bold">Day</span>
                      <input
                        type="number"
                        required
                        min={2}
                        max={30}
                        value={standingFix.inviteDay}
                        onChange={(e) => setStandingFix({ ...standingFix, inviteDay: parseInt(e.target.value) || 7 })}
                        className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Strategy Active Status</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setStandingFix({ ...standingFix, status: "Active" })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        standingFix.status === "Active"
                          ? "bg-secondary text-white border-secondary"
                          : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-slate-50"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setStandingFix({ ...standingFix, status: "Paused" })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        standingFix.status === "Paused"
                          ? "bg-secondary text-white border-secondary"
                          : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-slate-50"
                      }`}
                    >
                      Paused
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setShowCustomizeModal(false)}
                    className="px-3.5 py-1.5 border border-outline text-primary font-semibold text-xs rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Bottom Detail Rows Drilldown Modal */}
      <AnimatePresence>
        {selectedPattern && patternDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-outline-variant rounded-2xl w-full max-w-lg p-5 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary">explore</span>
                    {patternDetails.title}
                  </h3>
                  <p className="text-[11px] text-gray-500">Surfaced cohort analysis — {patternDetails.count} affected accounts</p>
                </div>
                <button
                  onClick={() => setSelectedPattern(null)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  close
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-900 font-bold mb-1.5">Pattern Description</p>
                <p className="text-[11px] text-gray-600 leading-normal bg-slate-50 border border-outline-variant/30 p-3 rounded-lg italic">
                  "{patternDetails.description}"
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-900 font-bold mb-1.5">Critical High-Value Accounts Stuck in Cohort</p>
                <div className="divide-y divide-outline-variant/30 max-h-56 overflow-y-auto">
                  {patternDetails.affected.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-[11px] hover:bg-slate-50 transition-colors px-1.5 rounded">
                      <div>
                        <p className="font-bold text-primary">{item.name}</p>
                        <p className="text-gray-400 font-medium">{item.tier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-secondary">{item.value}</p>
                        <p className="text-error font-semibold font-mono text-[10px]">{item.risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-outline-variant">
                <button
                  onClick={() => {
                    setSelectedPattern(null);
                    triggerToast(`CSM Concierge sync initiated for all ${patternDetails.count} affected accounts in queue.`);
                  }}
                  className="px-3.5 py-1.5 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-opacity-90 transition-all cursor-pointer flex items-center gap-1"
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
