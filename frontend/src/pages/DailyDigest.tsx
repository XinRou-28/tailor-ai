import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Decision {
  id: string;
  companyName: string;
  tier: string;
  risk: string;
  riskClass: string;
  healthScore: number;
  healthClass: string;
  observation: string;
  logic?: string;
  whyReview: string;
  whyReviewIcon: string;
  whyReviewClass: string;
  recommendation: string;
  status: "pending" | "approved" | "declined";
  mrrValue: number;
}

export default function DailyDigest() {
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Remaining task state
  const [showRemaining, setShowRemaining] = useState(false);

  // Decisons list state
  const [decisions, setDecisions] = useState<Decision[]>([
    {
      id: "acme-global",
      companyName: "Acme Global",
      tier: "Enterprise",
      risk: "High Risk",
      riskClass: "bg-error-container text-on-error-container",
      healthScore: 35,
      healthClass: "text-error",
      observation: "Advanced Analytics unused for 30 days despite high platform session count.",
      logic: "Users are actively logged in but avoiding specific premium features. Potential onboarding gap identified.",
      whyReview: "Renewal in 12 days.",
      whyReviewIcon: "info",
      whyReviewClass: "text-error",
      recommendation: "Offer Onboarding Support",
      status: "pending",
      mrrValue: 45000,
    },
    {
      id: "globex-corp",
      companyName: "Globex Corp",
      tier: "Enterprise",
      risk: "Medium Risk",
      riskClass: "bg-surface-variant text-on-surface-variant",
      healthScore: 52,
      healthClass: "text-tertiary-container",
      observation: "License usage at 98% capacity for three consecutive billing cycles.",
      whyReview: "Proactive upsell window before audit.",
      whyReviewIcon: "schedule",
      whyReviewClass: "text-on-surface-variant",
      recommendation: "Initiate Tier Expansion",
      status: "pending",
      mrrValue: 38000,
    },
    {
      id: "initech-systems",
      companyName: "Initech Systems",
      tier: "Pro Tier",
      risk: "High Risk",
      riskClass: "bg-error-container text-on-error-container",
      healthScore: 22,
      healthClass: "text-error",
      observation: "Complete cessation of API calls detected in production environment.",
      whyReview: "Likely technical integration failure.",
      whyReviewIcon: "warning",
      whyReviewClass: "text-error",
      recommendation: "Alert Engineering Team",
      status: "pending",
      mrrValue: 15000,
    },
  ]);

  // Fourth task loaded on demand
  const remainingDecision: Decision = {
    id: "umbrella-corp",
    companyName: "Umbrella Corp",
    tier: "Enterprise Plus",
    risk: "Low Risk",
    riskClass: "bg-green-50 text-green-700",
    healthScore: 88,
    healthClass: "text-green-600",
    observation: "Recent optimization check completed with zero inactive licenses over 90 days.",
    whyReview: "Audit cycle completed successfully.",
    whyReviewIcon: "check_circle",
    whyReviewClass: "text-green-600 font-medium",
    recommendation: "Promote Annual Discount Lock",
    status: "pending",
    mrrValue: 26000,
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAction = (id: string, action: "approve" | "decline") => {
    setDecisions((prev) =>
      prev.map((dec) => {
        if (dec.id === id) {
          return { ...dec, status: action === "approve" ? "approved" : "declined" };
        }
        return dec;
      })
    );
    const target = decisions.find((d) => d.id === id) || (showRemaining && remainingDecision.id === id ? remainingDecision : null);
    if (target) {
      if (action === "approve") {
        triggerToast(`Approved: "${target.recommendation}" strategy scheduled for ${target.companyName}.`);
      } else {
        triggerToast(`Declined logic for ${target.companyName}. Case closed.`);
      }
    }
  };

  const handleLoadRemaining = () => {
    if (showRemaining) {
      triggerToast("All available review decisions have been loaded.");
      return;
    }
    setShowRemaining(true);
    setDecisions((prev) => [...prev, remainingDecision]);
    triggerToast("Loaded 1 remaining decision from the queue.");
  };

  const handleAddDecision = () => {
    const company = prompt("Enter Company Name:");
    if (!company) return;
    const scoreStr = prompt("Enter Health Score (0-100):") || "40";
    const score = Math.min(100, Math.max(0, parseInt(scoreStr, 10) || 40));
    const rec = prompt("Enter Recommendation:") || "Schedule Strategy Sync";
    const obs = prompt("Enter Key Observation:") || "Platform usage drop detected.";

    let riskLevel = "Low Risk";
    let rClass = "bg-green-50 text-green-700";
    let hClass = "text-green-600";
    if (score < 40) {
      riskLevel = "High Risk";
      rClass = "bg-error-container text-on-error-container";
      hClass = "text-error";
    } else if (score < 70) {
      riskLevel = "Medium Risk";
      rClass = "bg-surface-variant text-on-surface-variant";
      hClass = "text-tertiary-container";
    }

    const newDec: Decision = {
      id: "dec_" + Date.now(),
      companyName: company,
      tier: "Enterprise",
      risk: riskLevel,
      riskClass: `${rClass} px-sm py-xs rounded text-[10px] font-bold uppercase tracking-wider`,
      healthScore: score,
      healthClass: hClass,
      observation: obs,
      logic: "AI detected subtle structural triggers aligned with contract renewal dates.",
      whyReview: "Proactive automated trigger.",
      whyReviewIcon: "bolt",
      whyReviewClass: "text-secondary font-bold",
      recommendation: rec,
      status: "pending",
      mrrValue: 20000,
    };

    setDecisions([newDec, ...decisions]);
    triggerToast(`Added custom review item for ${company}.`);
  };

  // Derived stats
  const pendingCount = decisions.filter((d) => d.status === "pending").length + (showRemaining ? 0 : 1);
  const averageHealth = Math.round(
    decisions.reduce((acc, curr) => acc + curr.healthScore, 0) / decisions.length
  ) || 68;
  const riskAtRenewalValue = decisions
    .filter((d) => d.status === "pending" && (d.risk === "High Risk" || d.risk === "Medium Risk"))
    .reduce((acc, curr) => acc + curr.mrrValue, 0);

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto w-full" id="digest-view-container">
      {/* Toast alert banner */}
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
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 block">Action Required</span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Queue</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">{pendingCount} Decisions Pending</p>
          </div>
        </div>

        {/* Stats Grid (Dashboard Visual Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm transition-all hover:border-primary/20">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Average Health</span>
              <span className="material-symbols-outlined text-primary text-lg">analytics</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary tracking-tight">{averageHealth}</span>
              <span className="text-xs font-bold text-error flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 4%
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm transition-all hover:border-primary/20">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Risk at Renewal</span>
              <span className="material-symbols-outlined text-secondary text-lg">payments</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary tracking-tight">
                ${Math.round((riskAtRenewalValue || 124000) / 1000)}k
              </span>
              <span className="text-xs font-medium text-gray-500 ml-1">MRR</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm transition-all hover:border-primary/20">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Optimization Confidence</span>
              <span className="material-symbols-outlined text-on-tertiary-container text-lg">fact_check</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary tracking-tight">High</span>
              <span className="text-xs font-medium text-gray-500 ml-1">AI Logic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Stack */}
      <div className="flex flex-col gap-4">
        {decisions.map((dec) => (
          <div
            key={dec.id}
            className={`bg-white border border-gray-200/80 py-4 px-6 rounded-xl grid grid-cols-12 gap-4 items-center hover:border-indigo-500/20 transition-all relative overflow-hidden shadow-sm ${
              dec.status !== "pending" ? "opacity-75 bg-slate-50/50" : ""
            }`}
          >
            {/* Overlay status if resolved */}
            {dec.status === "approved" && (
              <div className="absolute top-2 right-2 bg-green-500/10 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-green-200/50">
                <span className="material-symbols-outlined text-sm">check_circle</span> Approved
              </div>
            )}
            {dec.status === "declined" && (
              <div className="absolute top-2 right-2 bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-red-200/50">
                <span className="material-symbols-outlined text-sm">cancel</span> Declined
              </div>
            )}

            {/* Score & Identity */}
            <div className="flex flex-col gap-4 w-48 flex-shrink-0 col-span-12 md:col-span-3">
              <h3 className="text-lg font-bold text-gray-900">{dec.companyName}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                  {dec.tier}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dec.risk.toLowerCase().includes("high")
                      ? "bg-red-50 text-red-700"
                      : dec.risk.toLowerCase().includes("medium")
                      ? "bg-amber-50 text-amber-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {dec.risk}
                </span>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                {/* The colored progress ring (using a simple border trick) */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    className="text-gray-200"
                  />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="175" 
                    strokeDashoffset={
                      dec.id === "acme-global" ? "110" :
                      dec.id === "globex-corp" ? "80" :
                      dec.id === "initech-systems" ? "130" :
                      Math.round(175 * (1 - dec.healthScore / 100)).toString()
                    } 
                    className={
                      dec.id === "globex-corp" ? "text-yellow-500" :
                      dec.id === "acme-global" || dec.id === "initech-systems" ? "text-red-500" :
                      dec.risk.toLowerCase().includes("high") ? "text-red-500" :
                      dec.risk.toLowerCase().includes("medium") ? "text-yellow-500" :
                      "text-green-500"
                    } 
                  />
                </svg>
                
                {/* The number in the center */}
                <span className="relative z-10 text-xl font-bold text-gray-900">{dec.healthScore}</span>
              </div>
            </div>

            {/* Logic & Reasoning */}
            <div className="col-span-12 md:col-span-6 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-5">
              <div className="mb-3">
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
                  Observation
                </p>
                <p className="text-xs text-gray-500 leading-normal">
                  {dec.observation}
                </p>
              </div>

              {dec.logic && (
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100/60 rounded-xl p-4 mb-3">
                  <p className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase mb-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">smart_toy</span>
                    Tailor AI Logic
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {dec.logic}
                  </p>
                </div>
              )}

              <div className={`text-sm font-medium flex items-center gap-2 mt-3 ${
                dec.whyReviewClass.includes("text-error") 
                  ? "text-rose-600" 
                  : dec.whyReviewClass.includes("text-on-surface-variant")
                  ? "text-gray-500"
                  : dec.whyReviewClass
              }`}>
                <span className="material-symbols-outlined text-base">
                  {dec.whyReviewIcon}
                </span>
                <span>
                  Why Review: {dec.whyReview}
                </span>
              </div>
            </div>

            {/* Action panel */}
            <div className="col-span-12 md:col-span-3 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-5 flex flex-col gap-3">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Recommendation</p>
                <p className="text-sm font-bold text-secondary tracking-tight leading-snug">
                  {dec.recommendation}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  disabled={dec.status !== "pending"}
                  onClick={() => handleAction(dec.id, "approve")}
                  className="w-full bg-primary text-on-primary font-semibold text-xs py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                >
                  Approve Action
                </button>
                <button
                  onClick={() => triggerToast(`Navigating to Full Detail view for ${dec.companyName}.`)}
                  className="w-full text-secondary font-semibold text-xs border border-secondary py-1.5 rounded-lg hover:bg-secondary hover:text-white transition-colors cursor-pointer text-center"
                >
                  View Full Detail
                </button>
                {dec.logic && (
                  <button
                    disabled={dec.status !== "pending"}
                    onClick={() => handleAction(dec.id, "decline")}
                    className="w-full text-gray-500 font-semibold text-xs py-1.5 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Decline Logic
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="mt-8 py-4 text-center border-t border-outline-variant">
        <p className="text-xs text-gray-500">
          Showing {decisions.length} of {showRemaining ? decisions.length : 4} decisions for {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <button
          onClick={handleLoadRemaining}
          className="mt-3 text-xs font-bold text-secondary flex items-center gap-1 mx-auto hover:bg-surface-container px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          {showRemaining ? "Queue Fully Loaded" : "Load Remaining Task"}{" "}
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>

      {/* Floating Action Button (FAB) for adding new review items */}
      <button
        onClick={handleAddDecision}
        title="Add Custom Review Decision"
        className="fixed bottom-6 right-6 w-11 h-11 bg-secondary text-on-secondary rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer z-50"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
