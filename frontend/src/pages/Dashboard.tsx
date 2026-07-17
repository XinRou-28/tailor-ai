import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HealthRing from "../components/HealthRing";

interface DashboardProps {
  searchQuery: string;
  onTabChange?: (tab: string) => void;
}

export default function Dashboard({ searchQuery, onTabChange }: DashboardProps) {
  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simple stats for the dashboard overview
  // High-risk count: accounts with health < 40 OR status "Critical" (matches contract.md risk_level === "High")
  const [highRiskCount, setHighRiskCount] = useState(1); // XYZ Corp has health 14/100 and Critical status

  // Toast notification handler
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Navigation handler to the Customers page
  const navigateToCustomers = () => {
    if (onTabChange) {
      onTabChange("customers"); // Navigate to Customers page
    } else {
      triggerToast("Viewing all customers");
    }
  };

  // Handle quick insight view click
  const handleQuickInsightClick = () => {
    if (onTabChange) {
      onTabChange("insights"); // Navigate to Insights page (same as sidebar)
    } else {
      triggerToast("Opening full insight view…");
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto w-full p-4">

      {/* Welcome section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0.5">
          Good morning, Mei
        </h1>
        <p className="text-gray-500 text-xs">
          Tailor AI has identified <span className="font-semibold text-error">
            {highRiskCount}
          </span> high‑risk subscriptions that require your immediate attention.
        </p>
      </div>

      {/* PORTFOLIO SUMMARY – stats only, no customer actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* High‑Risk churning accounts – click to navigate to Customers with filter */}
        <div
          className="glass-card border border-white/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer relative overflow-hidden"
          onClick={() => onTabChange && onTabChange("customers")}
        >
          {/* Left accent border for high-risk */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error/20"></div>
          <div className="bg-error-container/30 p-2 rounded-lg flex items-center justify-center z-10">
            <span className="material-symbols-outlined text-error text-lg">warning</span>
          </div>
          <div className="z-10">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
              High-Risk Churning Accounts
            </span>
            <span className="text-xl font-bold text-error tracking-tight">{highRiskCount}</span>
          </div>
        </div>

        {/* Customers – click to view all customers */}
        <div
          className="glass-card border border-white/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer"
          onClick={() => onTabChange && onTabChange("customers")}
        >
          <div className="bg-secondary-container p-2 rounded-lg flex items-center justify-center z-10">
            <span className="material-symbols-outlined text-secondary text-lg">group</span>
          </div>
          <div className="z-10">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
              All Customers
            </span>
            <span className="text-xl font-bold text-primary tracking-tight">10</span>
          </div>
        </div>

        {/* Portfolio health – static, click for details */}
        <div className="glass-card border border-white/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
          <div className="bg-primary-container p-2 rounded-lg flex items-center justify-center z-10">
            <span className="material-symbols-outlined text-primary text-lg">analytics</span>
          </div>
          <div className="z-10">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
              Portfolio Health
            </span>
            <div className="flex items-center gap-2">
              <HealthRing score={78} size={24} strokeWidth={4} showScore={false} />
              <span className="text-xl font-bold text-primary tracking-tight">78/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* DIGEST PREVIEW – read‑only customer information */}
      <section className="glass-card border border-white/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            Customer Portfolio
          </h2>
          <button
            onClick={() => onTabChange && onTabChange("customers")}
            className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            View All Customers
          </button>
        </div>

        {/* Company 1 - Medium risk (amber tint) */}
        <div
          className="border border-[#e5e7eb]/80 p-4 rounded-xl hover:shadow-sm transition-all cursor-pointer mb-3 bg-amber-50/50"
          onClick={() => triggerToast("Opening details for ABC Company")}
        >
          <div className="flex items-center gap-4">
            <HealthRing score={35} size={48} strokeWidth={6} />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-900 mb-1">ABC Company</h3>
              <p className="text-[11px] text-gray-500">
                Enterprise plan • Health: 35/100
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="bg-error-container/30 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                  Manual Review
                </span>
                <span className="bg-background text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-[#e5e7eb]/80">
                  Enterprise
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Company 2 - High risk (red tint) */}
        <div
          className="border border-[#e5e7eb]/80 p-4 rounded-xl hover:shadow-sm transition-all cursor-pointer mb-3 bg-red-50/50"
          onClick={() => triggerToast("Opening details for XYZ Corp")}
        >
          <div className="flex items-center gap-4">
            <HealthRing score={14} size={48} strokeWidth={6} />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-900 mb-1">XYZ Corp</h3>
              <p className="text-[11px] text-gray-500">
                Business plan • Health: 14/100
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="bg-error-container text-on-error-container px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                  Critical
                </span>
                <span className="bg-background text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-[#e5e7eb]/80">
                  Business
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Company 3 - Low risk (green tint) */}
        <div
          className="border border-[#e5e7eb]/80 p-4 rounded-xl hover:shadow-sm transition-all cursor-pointer bg-green-50/50"
          onClick={() => triggerToast("Opening details for Global Tech Solutions")}
        >
          <div className="flex items-center gap-4">
            <HealthRing score={78} size={48} strokeWidth={6} />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-900 mb-1">Global Tech Solutions</h3>
              <p className="text-[11px] text-gray-500">
                Pro Growth plan • Health: 78/100
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                  Opportunity
                </span>
                <span className="bg-background text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-[#e5e7eb]/80">
                  Pro Growth
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 text-center mt-4">
          View all customers in the full portfolio.
        </p>
      </section>

      {/* QUICK INSIGHT TILE – moved to bottom as requested */}
      <section className="glass-card border border-white/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            Top reason for value loss
          </h2>
          <button
            onClick={handleQuickInsightClick}
            className="text-sm text-primary hover:underline font-semibold"
          >
            View full insight
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-[#eef2ff] rounded-full overflow-hidden">
            <div className="h-3 bg-primary w-[42%] rounded-full"></div>
          </div>
          <span className="text-sm font-bold text-gray-900">42%</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">
          Customer churn due to insufficient feature adoption
        </p>
      </section>

      {/* Quick toast notifications */}
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

    </div>
  );
}