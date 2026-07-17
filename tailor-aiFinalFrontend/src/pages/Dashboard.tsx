import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HealthRing from "../components/HealthRing";

interface DashboardProps {
  searchQuery: string;
  onTabChange?: (tab: string) => void;
}

export default function Dashboard({ searchQuery, onTabChange }: DashboardProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highRiskCount, setHighRiskCount] = useState(1);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQuickInsightClick = () => {
    if (onTabChange) {
      onTabChange("insights");
    } else {
      triggerToast("Opening full insight view…");
    }
  };

  return (
    // 全局深邃渐变底色
    <div className="relative min-h-screen w-full bg-[#0B1026] p-6 text-white overflow-hidden">
      {/* 科技感背景光晕 */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      
      <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full relative z-10">

        {/* Welcome section */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Good morning, Mei</h1>
          <p className="text-[#CBD5E1] text-[15px] leading-[1.5]">
            Tailor AI has identified <span className="font-bold text-red-400">{highRiskCount}</span> high‑risk subscriptions that require your immediate attention.
          </p>
        </div>

        {/* PORTFOLIO SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High‑Risk churning accounts */}
          <div
            className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all shadow-xl"
            onClick={() => onTabChange && onTabChange("customers")}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <span className="material-symbols-outlined text-red-400">warning</span>
              </div>
              <div>
                <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.05em] text-[#E2E8F0] block mb-1">High-Risk Churning Accounts</span>
                <span className="text-2xl font-bold text-red-400">{highRiskCount}</span>
              </div>
            </div>
          </div>

          {/* All Customers */}
          <div
            className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all shadow-xl"
            onClick={() => onTabChange && onTabChange("customers")}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                <span className="material-symbols-outlined text-indigo-400">group</span>
              </div>
              <div>
                <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.05em] text-[#E2E8F0] block mb-1">All Customers</span>
                <span className="text-2xl font-bold text-white">10</span>
              </div>
            </div>
          </div>

          {/* Portfolio health */}
          <div className="relative bg-slate-900/50 backdrop-blur-xl border border-indigo-500/30 p-5 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all shadow-xl shadow-indigo-500/10">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
                <span className="material-symbols-outlined text-indigo-300">analytics</span>
              </div>
              <div>
                <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.05em] text-[#E2E8F0] block mb-1">Portfolio Health</span>
                <div className="flex items-center gap-3">
                  <HealthRing score={78} size={24} strokeWidth={5} showScore={false} />
                  <span className="text-2xl font-bold text-white">78/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DIGEST PREVIEW */}
        <section className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-tight">Customer Portfolio</h2>
            <button
              onClick={() => onTabChange && onTabChange("customers")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg"
            >
              View All Customers
            </button>
          </div>

          {[
            { name: "ABC Company", health: 35, tag1: "Manual Review", tag2: "Enterprise", color: "amber" },
            { name: "XYZ Corp", health: 14, tag1: "Critical", tag2: "Business", color: "red" },
            { name: "Global Tech Solutions", health: 78, tag1: "Opportunity", tag2: "Pro Growth", color: "emerald" }
          ].map((item, i) => (
            <div key={i} className="relative overflow-hidden flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#1c123c] via-[#0d0921] to-[#140e2b] border border-purple-500/25 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:border-purple-400/45 hover:from-[#2a1752] hover:to-[#1a113d] hover:shadow-[0_12px_36px_rgba(168,85,247,0.18)] transition-all duration-300 mb-3 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-pink-400/80 before:to-purple-600 before:rounded-r-full">
              {/* Soft ambient glows inside the dark theme cards */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-6 -top-6 w-20 h-20 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <HealthRing score={item.health} size={48} strokeWidth={6} />
              </div>
              
              <div className="flex-1 relative z-10 pl-1">
                <h3 className="text-sm font-bold text-white mb-1 tracking-tight">{item.name}</h3>
                <p className="text-[13px] text-purple-100/90 font-medium">Plan • Health: {item.health}/100</p>
                <div className="mt-2.5 flex gap-1.5 flex-wrap">
                  <span className={`bg-${item.color}-500/15 text-${item.color}-200 border border-${item.color}-500/25 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider`}>
                    {item.tag1}
                  </span>
                  <span className="bg-white/5 text-purple-200/95 border border-white/10 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
                    {item.tag2}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* QUICK INSIGHT TILE */}
        <section className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Top reason for value loss</h2>
            <button onClick={handleQuickInsightClick} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              View full insight
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-500 w-[42%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
            <span className="text-sm font-bold text-white">42%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Customer churn due to insufficient feature adoption</p>
        </section>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-white/10"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}