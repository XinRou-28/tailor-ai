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
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

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
          <div className="bg-primary-container text-white rounded-xl p-4 md:p-5 shadow-lg flex-1 relative overflow-hidden flex flex-col">
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <span className="material-symbols-outlined text-secondary-fixed-dim mb-2 text-lg" data-icon="auto_awesome">auto_awesome</span>
              <h4 className="text-xs font-bold text-white tracking-tight uppercase mb-2">AI Pulse</h4>
              <p className="text-[11px] text-indigo-100/80 leading-normal">
                Pattern detected: Advanced Analytics adoption is the strongest signal across at-risk Enterprise accounts. Recommended focus area for retention strategy.
              </p>
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
              <h3 className="text-base font-bold text-white tracking-tight mb-1.5">Enterprise Onboarding Insights</h3>
              <p className="text-xs text-indigo-100/80 leading-normal">
                Based on account behavior in the last {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days, focusing on Advanced Analytics adoption and onboarding completion shows the highest correlation with retention and expansion.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-indigo-100/80 italic">Suggested next step</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. View Forecast Model Modal - Removed as per requirements */}

      {/* 2. Customize Actions Modal - Removed as per requirements */}

      {/* 3. Bottom Detail Rows Drilldown Modal */}
      <AnimatePresence>
        {selectedPattern && patternDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card border border-white/30 rounded-2xl w-full max-w-lg p-5 shadow-2xl overflow-hidden"
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
