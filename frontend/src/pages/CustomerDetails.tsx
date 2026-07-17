import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CustomerDetails() {
  // Page Action state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive variables
  const [isApproved, setIsApproved] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // Editable customer data fields
  const [customerData, setCustomerData] = useState({
    name: "ABC Company",
    plan: "Enterprise Plan",
    price: "$299/mo",
    renewalInDays: 12,
    healthScore: 35,
    aiConfidence: 68,
    automationTier: "csm_review", // Can be: "auto_send", "csm_review", or "manual_investigation"
    decision: {
      rationale: "High revenue account with renewal approaching, but low feature adoption detected",
      decided_at: "2026-07-16T09:30:00Z" // This field may not exist in current mock data
    },
    outreachEmail: `Hi Sarah,

I noticed you haven't been able to fully dive into the Advanced Analytics module since your upgrade.

I've cleared some time for our lead engineer to walk your team through the SSO setup and dashboard customization personally. We want to ensure you're seeing the full ROI of the Enterprise tier.

Are you free Tuesday at 10 AM?

Best,
Mei Chen`,
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApprove = () => {
    if (isApproved) return;
    setIsApproved(true);
    setIsDeclined(false);
    triggerToast(`Success: Custom outreach sent to Sarah Jenkins (Sarah.Jenkins@abccompany.com)!`);
  };

  const handleDecline = () => {
    setIsDeclined(true);
    setIsApproved(false);
    triggerToast(`Recommendation declined. Internal audit status updated to Ignored.`);
  };

  // Log simulation records
  const logEntries = [
    { timestamp: "2026-07-16 09:21:05", type: "Telemetry", msg: "Feature 'Advanced Analytics' session ended (duration 15s)." },
    { timestamp: "2026-07-16 04:12:44", type: "Security", msg: "SSO login attempt aborted from unauthorized range." },
    { timestamp: "2026-07-15 14:10:12", type: "System", msg: "Scheduled automated outreach trigger initialized." },
    { timestamp: "2026-07-14 18:30:59", type: "Support", msg: "Ticket #10292 opened by Jenkins, Sarah: 'SSO setup instructions missing'." },
    { timestamp: "2026-07-12 11:00:21", type: "Telemetry", msg: "Weekly activity synthesis score computed at 35." },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full" id="details-view-container">
      {/* Dynamic Toast Alert banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-lg py-sm rounded-xl shadow-2xl z-50 flex items-center gap-md border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="font-body-md font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-on-surface-variant mb-4 text-xs font-semibold">
        <a className="hover:text-primary transition-colors cursor-pointer">Customers</a>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-primary font-bold">{customerData.name}</span>
      </div>

      {/* 1. Header: Customer Profile */}
      <section className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{customerData.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-xs font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined !text-[15px]">workspace_premium</span> {customerData.plan}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined !text-[15px]">payments</span> {customerData.price}
              </span>
              <span className="flex items-center gap-1 text-error font-bold">
                <span className="material-symbols-outlined !text-[15px]">event</span> Renewal in {customerData.renewalInDays} days
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowLogs(!showLogs);
                if (!showLogs) triggerToast("Behavioral activity telemetry stream expanded.");
              }}
              className="px-3.5 py-1.5 border border-outline text-primary font-semibold rounded-lg hover:bg-surface-container-low transition-all active:scale-95 text-xs cursor-pointer"
            >
              {showLogs ? "Hide Logs" : "View Logs"}
            </button>
          </div>
        </div>
      </section>

      {/* Conditionally Expanded Live Telemetry Logs section */}
      <AnimatePresence>
        {showLogs && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden glass-card border border-white/30 rounded-xl shadow-sm p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
              <h3 className="font-bold text-primary flex items-center gap-1 text-sm">
                <span className="material-symbols-outlined text-secondary !text-[18px]">database</span> Behavioral Signal Telemetry Logs
              </h3>
              <button onClick={() => setShowLogs(false)} className="text-xs text-[#4b41e1] hover:underline cursor-pointer">
                Close
              </button>
            </div>
            <div className="divide-y divide-outline-variant/30 max-h-60 overflow-y-auto font-mono text-xs text-on-surface-variant">
              {logEntries.map((log, idx) => (
                <div key={idx} className="py-1.5 flex justify-between gap-4 hover:bg-slate-50 transition-colors px-2 rounded">
                  <span className="text-gray-400 select-none">{log.timestamp}</span>
                  <span className="font-semibold text-[#4b41e1]">{log.type}</span>
                  <span className="flex-1 truncate text-primary">{log.msg}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Vertical Timeline Layout */}
      <div className="space-y-8">
        {/* Timeline Item 1: Health Score & Risk */}
        <div className="relative pl-8 border-l-2 border-gray-200">
          <div className="absolute -left-[26px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white !text-[14px]">monitor_heart</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Customer Health Score</h3>
              <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                HIGH RISK
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    className="text-surface-container-high"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-error"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="58"
                    stroke="currentColor"
                    strokeDasharray="364.4"
                    strokeDashoffset="236.8"
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-gray-900 leading-none">{customerData.healthScore}</span>
                  <span className="text-[10px] font-bold text-gray-400">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">AI CONFIDENCE</p>
                  <div className="flex items-center gap-2">
                    <div className="w-40 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[68%]" style={{ width: `${customerData.aiConfidence}%` }}></div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-900">{customerData.aiConfidence}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-normal">
                  Predicted probability of churn within the next 30 days based on activity decay and support friction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Item 2: AI Causal Analysis */}
        <div className="relative pl-8 border-l-2 border-gray-200">
          <div className="absolute -left-[26px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white !text-[14px]">psychology</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary !text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              AI Causal Analysis
            </h3>
            <div className="relative space-y-3 pl-4 border-l-2 border-gray-100 ml-2.5 py-0.5">
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-error rounded-full border border-white"></div>
                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-indigo-600">01</span>
                    <span className="bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      CRITICAL
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">Advanced Analytics unused</h4>
                  <p className="text-xs text-gray-500 italic">
                    User has not interacted with the dashboard in 14 days, despite the enterprise tier upgrade.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-error rounded-full border border-white"></div>
                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-indigo-600">02</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">Login frequency down</h4>
                  <p className="text-xs text-gray-500 italic">
                    Monthly login volume decreased by 74% compared to the previous cycle.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border border-white"></div>
                <div className="bg-secondary-container/5 border border-secondary/20 p-4 rounded-xl shadow-sm flex gap-3 hover:shadow-md transition-shadow">
                  <span className="material-symbols-outlined text-secondary !text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    smart_toy
                  </span>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1 tracking-wider">Investigation Agent Refinement</p>
                    <p className="text-xs text-gray-700 leading-normal font-medium">
                      Original status: "Abandoned". <br />
                      <span className="text-indigo-600 font-bold">Refinement: "Never Onboarded".</span> Deeper analysis reveals the key decision-maker
                      never completed the initial SSO setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Item 3: AI Recommendation */}
        <div className="relative pl-8 border-l-2 border-gray-200">
          <div className="absolute -left-[26px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white !text-[14px]">bolt</span>
          </div>
          <div className="bg-primary p-5 rounded-xl text-on-primary shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-yellow-300 !text-[18px]">bolt</span>
              <h3 className="text-sm font-bold text-white tracking-tight">AI Recommendation</h3>
            </div>
            <p className="text-lg font-bold mb-2.5 leading-tight text-white">
              Offer onboarding support — <span className="text-yellow-200">no plan change</span>.
            </p>
            <p className="text-xs text-indigo-100/80 mb-4 leading-normal">
              The customer is high risk due to technical friction, not budget constraints. A downgrade offer would likely trigger an exit. Focus on integration success.
            </p>
          </div>
        </div>

        {/* Timeline Item 4: Automation Decision - Conditional based on automationTier */}
        {customerData.automationTier === "manual_investigation" ? (
          <div className="relative pl-8 border-l-2 border-gray-200">
            <div className="absolute -left-[26px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white !text-[14px]">smart_toy</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Automation Decision</h3>
                <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  MANUAL REVIEW REQUIRED
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Confidence too low for an automated recommendation — manual investigation needed
              </p>
              <p className="text-xs text-gray-600 italic">
                {customerData.decision?.rationale || "This account requires human review due to complex risk factors."}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative pl-8 border-l-2 border-gray-200">
            <div className="absolute -left-[26px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white !text-[14px]">smart_toy</span>
            </div>
            <div className={`glass-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${customerData.healthScore >= 70 ? 'border-green-200' : customerData.healthScore >= 40 ? 'border-amber-200' : 'border-red-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Automation Decision</h3>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${customerData.automationTier === "auto_send" ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {customerData.automationTier === "auto_send" ? 'AUTO-SENT' : 'NEEDS YOUR APPROVAL'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                This intervention is time-sensitive due to the {customerData.renewalInDays}-day renewal window.
              </p>
              {customerData.automationTier === "auto_send" ? (
                <div className="mb-3">
                  <p className="text-xs text-green-600 font-medium">
                    <span className="material-symbols-outlined !text-[14px] text-green-500">check_circle</span>
                    Auto-Sent on {customerData.decision?.decided_at ? new Date(customerData.decision.decided_at).toLocaleString() : "[timestamp not available]"}
                  </p>
                </div>
              ) : null}
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={isApproved || customerData.automationTier === "auto_send"}
                  className={`px-3 py-1.5 text-white font-semibold rounded-lg hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-1 shadow-md text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${customerData.healthScore >= 70 ? 'bg-green-600 hover:bg-green-500' : customerData.healthScore >= 40 ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'}`}
                >
                  <span className="material-symbols-outlined !text-[13px]">send</span>
                  {isApproved ? "Approved & Sent" : "Approve & Send"}
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isDeclined || customerData.automationTier === "auto_send"}
                  className="px-3 py-1.5 bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg transition-all active:scale-[0.98] text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeclined ? "Logic Ignored" : "Decline & Ignore"}
                </button>
              </div>
              {(isApproved || isDeclined) && (
                <button
                  onClick={() => {
                    setIsApproved(false);
                    setIsDeclined(false);
                    triggerToast("Decision reset. Re-analyzing client outreach pipeline...");
                  }}
                  className="text-xs text-indigo-400 underline hover:text-indigo-300 cursor-pointer mt-2"
                >
                  Reset Action State
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timeline Item 5: Client Outreach Preview - Conditional based on automationTier */}
        {customerData.automationTier !== "manual_investigation" && (
          <div className="relative pl-8 border-l-2 border-gray-200">
            <div className="absolute -left-[26px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white !text-[14px]">mail</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="bg-surface-container-high px-4 py-2.5 border-b border-outline-variant flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Preview: Client Outreach</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${customerData.automationTier === "auto_send" ? 'bg-green-100 text-green-800' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                  {customerData.automationTier === "auto_send" ? 'SENT' : 'DRAFT'}
                </span>
              </div>
              <div className="p-4 bg-surface-container-lowest flex-1">
                <div className="mb-3">
                  <div className="text-[9px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">TO: Sarah Jenkins (CTO)</div>
                  <div className="font-bold text-gray-900 text-sm">Subject: Unlocking your Enterprise Value</div>
                </div>
                <div className="font-body-md text-on-surface-variant space-y-sm">
                  {customerData.automationTier === "auto_send" ? (
                    <div className="w-full h-44 overflow-y-auto text-xs leading-relaxed text-on-surface-variant font-sans border border-gray-200 rounded p-2 bg-white">
                      {customerData.outreachEmail}
                    </div>
                  ) : (
                    <textarea
                      className="w-full h-44 bg-transparent border-none focus:ring-0 p-0 text-xs leading-relaxed text-on-surface-variant resize-none outline-none font-sans"
                      value={customerData.outreachEmail}
                      onChange={(e) => setCustomerData({ ...customerData, outreachEmail: e.target.value })}
                      placeholder="Review automatic communication draft..."
                      disabled={customerData.automationTier === "auto_send"}
                    />
                  )}
                </div>
                {customerData.automationTier === "auto_send" ? (
                  <p className="text-[11px] text-gray-400 mt-1.5 italic select-none">
                    📤 This email was automatically sent on {customerData.decision?.decided_at ? new Date(customerData.decision.decided_at).toLocaleString() : "[timestamp not available]"}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-1.5 italic select-none">
                    ✏️ Email content can be directly edited or reviewed prior to sending.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contextual Footer */}
      <footer className="mt-8 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs">
        <div className="flex items-center gap-3">
          <span>Audit ID: 772-BETA-49</span>
          <span>•</span>
          <span>Processed: 4 minutes ago</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined !text-[14px]">verified_user</span>
          Decision backed by 12TB of multi-tenant behavior data.
        </div>
      </footer>

      {/* Sticky Bottom Human Decision Bar - Conditional based on automationTier */}
      {customerData.automationTier !== "manual_investigation" && (
        <div className="sticky bottom-0 left-0 w-full bg-[#0f172a] py-3.5 px-6 flex justify-between items-center z-50 mt-8 rounded-b-xl shadow-2xl">
          <div className="flex items-center gap-3 text-left">
            <span className={`material-symbols-outlined !text-[20px] ${
              isApproved ? "text-green-400" : isDeclined ? "text-red-400" : "text-indigo-400"
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {isApproved ? "check_circle" : isDeclined ? "cancel" : "feedback"}
            </span>
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-white">
                {customerData.automationTier === "auto_send" ? "Automated Action Taken" : "Human Decision Needed"}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-slate-100 font-semibold">
                  Status: {" "}
                  {isApproved ? (
                    <span className="text-green-400">Approved & Outreach Sent</span>
                  ) : isDeclined ? (
                    <span className="text-red-400">Logic Declined</span>
                  ) : customerData.automationTier === "auto_send" ? (
                    <span className="text-green-400">Auto-Sent on {customerData.decision?.decided_at ? new Date(customerData.decision.decided_at).toLocaleString() : "[timestamp not available]"}</span>
                  ) : (
                    <span className="text-slate-300">Awaiting your approval</span>
                  )}
                </span>
                <span>•</span>
                <span className="italic text-slate-400">
                  "This intervention is time-sensitive due to the {customerData.renewalInDays}-day renewal window."
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isApproved || customerData.automationTier === "auto_send" ? (
              <div className="bg-green-950/50 text-green-300 py-1.5 px-3 rounded-lg flex items-center gap-2 border border-green-800 text-xs">
                <span className="material-symbols-outlined !text-[13px]">check_circle</span>
                <span className="font-bold">Outreach Email dispatched successfully.</span>
              </div>
            ) : (
              <button
                onClick={handleApprove}
                disabled={customerData.automationTier === "auto_send"}
                className="py-1.5 px-3.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined !text-[13px]">send</span>
                Approve & Send Outreach
              </button>
            )}

            <button
              disabled={isDeclined || customerData.automationTier === "auto_send"}
              onClick={handleDecline}
              className="py-1.5 px-3.5 bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 font-semibold rounded-lg transition-all active:scale-[0.98] text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeclined ? "Logic Ignored" : "Decline & Ignore Recommendation"}
            </button>

            {(isApproved || isDeclined) && (
              <button
                onClick={() => {
                  setIsApproved(false);
                  setIsDeclined(false);
                  triggerToast("Decision reset. Re-analyzing client outreach pipeline...");
                }}
                className="text-xs text-indigo-400 underline hover:text-indigo-300 cursor-pointer"
              >
                Reset Action State
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
