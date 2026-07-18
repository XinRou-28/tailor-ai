import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
 getCustomerDetail,
 transformCustomerDetail,
 CustomerViewModel
} from "../api/customer";


export default function CustomerDetails() {
  // Page Action state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive variables
  const [isApproved, setIsApproved] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // Editable customer data fields
  const [customerData,setCustomerData] = useState<CustomerViewModel | null>(null);

    useEffect(() => {

    async function loadCustomer(){

        const data = await getCustomerDetail("acc_0011");

        const viewModel = transformCustomerDetail(data);

        setCustomerData(viewModel);

    }

    loadCustomer();

},[]);

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
    triggerToast(
`Success: Custom outreach sent to ${customerData.customerContact} (${customerData.contactEmail})!
`);
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
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto w-full" id="details-view-container">
      {/* Dynamic Toast Alert banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-white/10"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5 text-xs font-semibold">
        <a className="hover:text-indigo-400 transition-colors cursor-pointer">Customers</a>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-white font-semibold">{customerData.name}</span>
      </div>

      {/* 1. Header: Customer Profile Hero Section */}
      <section className="relative overflow-hidden bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-xl p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-slate-900/40 mb-1">
        {/* Soft background radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Elegant compact avatar representation */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 border border-indigo-500/15 flex items-center justify-center text-indigo-300 font-bold text-xl shadow-[0_2px_12px_rgba(99,102,241,0.08)]">
              {customerData.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{customerData.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-pink-600 text-white border border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)]">
                  Action Required
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#CBD5E1] text-xs font-medium mt-1.5">
                <span className="flex items-center gap-1 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-indigo-400 !text-[15px]">workspace_premium</span> {customerData.plan}
                </span>
                <span className="flex items-center gap-1 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-indigo-400 !text-[15px]">payments</span> {customerData.price}
                </span>
                <span className="flex items-center gap-1 text-rose-200 font-semibold bg-rose-500/10 border border-rose-500/15 px-2 py-0.5 rounded text-[11px] shadow-[0_0_8px_rgba(244,63,94,0.05)]">
                  <span className="material-symbols-outlined !text-[13px] text-rose-300">event</span> Renewal in {customerData.renewalInDays} days
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setShowLogs(!showLogs);
                if (!showLogs) triggerToast("Behavioral activity telemetry stream expanded.");
              }}
              className="px-3.5 py-1.5 bg-white/5 border border-white/5 text-slate-300 font-semibold rounded-lg hover:bg-white/10 hover:text-white hover:border-white/10 transition-all duration-200 active:scale-95 text-xs cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined !text-[13px]">{showLogs ? "visibility_off" : "visibility"}</span>
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
            className="mb-2 overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 border-t border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-5 flex flex-col gap-3 relative"
          >
            {/* Top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-semibold text-slate-100 flex items-center gap-1.5 text-sm">
                <span className="material-symbols-outlined text-indigo-400 !text-[18px]">database</span> Behavioral Signal Telemetry Logs
              </h3>
              <button onClick={() => setShowLogs(false)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium">
                Close Logs
              </button>
            </div>
            <div className="divide-y divide-white/5 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-300 pr-1">
              {logEntries.map((log, idx) => (
                <div key={idx} className="py-2.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-white/5 transition-colors px-2.5 rounded-lg border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-medium whitespace-nowrap">{log.timestamp}</span>
                    <span className="font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{log.type}</span>
                  </div>
                  <span className="flex-1 truncate text-slate-200">{log.msg}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Vertical Timeline Layout */}
      <div className="space-y-3">
        {/* Timeline Item 1: Health Score & Risk */}
        <div className="relative pl-7 border-l border-white/10 pb-1">
          {/* Timeline Bullet */}
          <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-indigo-600 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.4)] z-10">
            <span className="material-symbols-outlined text-white !text-[13px]">monitor_heart</span>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-[#131130] via-[#08081a] to-[#1c113a] backdrop-blur-xl border border-indigo-500/35 border-t-indigo-400/50 border-b-indigo-950 rounded-2xl p-4 sm:p-5 shadow-[0_16px_48px_rgba(99,102,241,0.25),_inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-indigo-400/60 hover:shadow-[0_20px_56px_rgba(99,102,241,0.35)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px] before:bg-gradient-to-b before:from-rose-500 before:via-violet-600 before:to-indigo-600">
            {/* Ambient radial glow background element to increase richness and layering */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-rose-500/10 rounded-full blur-[30px] pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
                Customer Health Score
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-[0_0_16px_rgba(244,63,94,0.85)] border border-rose-400">
                HIGH RISK
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 relative z-10">
              {/* Circular health score gauge with metric styling */}
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex-shrink-0 flex items-center justify-center group">
                <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.25)]" viewBox="0 0 128 128">
                  <circle
                    className="text-white/10"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-rose-500 transition-all duration-500"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeDasharray="351.8"
                    strokeDashoffset="228.7"
                    strokeLinecap="round"
                    strokeWidth="9"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-100 text-transparent bg-clip-text leading-none">{customerData.healthScore}</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-wider">/ 100</span>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="mb-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] sm:text-xs font-bold text-indigo-200 uppercase tracking-[0.06em]">AI Prediction Confidence</p>
                    <span className="text-xs font-mono font-black text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]">{customerData.aiConfidence}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-500" 
                        style={{ width: `${customerData.aiConfidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] text-indigo-100/90 leading-relaxed font-normal">
                  Predicted probability of churn within the next 30 days based on active engagement decay, SSO configuration absence, and customer support friction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Item 2: AI Causal Analysis */}
        <div className="relative pl-8 border-l border-white/10 pb-2">
          {/* Timeline Bullet */}
          <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-indigo-600 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.4)] z-10">
            <span className="material-symbols-outlined text-white !text-[13px]">psychology</span>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 !text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              AI Causal Analysis
            </h3>
            
            <div className="relative space-y-4 pl-6 border-l border-white/10 ml-2.5 py-1">
              {/* Causal Sub-item 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-[18px] w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#0B1026] shadow-[0_0_8px_rgba(244,63,94,0.8)] z-10"></div>
                <div className="relative overflow-hidden bg-gradient-to-br from-[#141233] via-[#09081a] to-[#1c1133] backdrop-blur-xl border border-indigo-500/25 border-t-indigo-400/35 border-b-indigo-950 p-5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_12px_36px_rgba(99,102,241,0.18)]">
                  {/* Internal ambient radial glow */}
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <span className="text-sm font-extrabold bg-gradient-to-r from-pink-300 to-indigo-200 text-transparent bg-clip-text tracking-wide">01</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-rose-600 to-red-600 text-white border border-red-400 shadow-[0_0_14px_rgba(220,38,38,0.7)]">
                      CRITICAL
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight mb-1 relative z-10">Advanced Analytics unused</h4>
                  <p className="text-[13px] text-indigo-100/90 leading-relaxed italic relative z-10">
                    User has not interacted with the dashboard in 14 days, despite the enterprise tier upgrade.
                  </p>
                </div>
              </div>
              
              {/* Causal Sub-item 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-[18px] w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-[#0B1026] shadow-[0_0_8px_rgba(245,158,11,0.8)] z-10"></div>
                <div className="relative overflow-hidden bg-gradient-to-br from-[#141233] via-[#09081a] to-[#1c1133] backdrop-blur-xl border border-indigo-500/20 border-t-indigo-400/30 border-b-indigo-950 p-5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_12px_36px_rgba(99,102,241,0.18)]">
                  {/* Internal ambient radial glow */}
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <span className="text-sm font-extrabold bg-gradient-to-r from-amber-300 to-indigo-200 text-transparent bg-clip-text tracking-wide">02</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                      WARNING
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight mb-1 relative z-10">Login frequency down</h4>
                  <p className="text-[13px] text-indigo-100/90 leading-relaxed italic relative z-10">
                    Monthly login volume decreased by 74% compared to the previous cycle.
                  </p>
                </div>
              </div>
              
              {/* Sub-item 3: Investigation Agent Refinement */}
              <div className="relative">
                <div className="absolute -left-[31px] top-[18px] w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-[#0B1026] shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10"></div>
                <div className="relative overflow-hidden bg-gradient-to-br from-[#12102e] via-[#08081a] to-[#1c113e] backdrop-blur-xl border border-indigo-500/30 border-t-indigo-400/50 border-b-indigo-950 p-5 rounded-2xl flex gap-4 transition-all duration-300 hover:border-indigo-400/50 hover:shadow-[0_12px_36px_rgba(99,102,241,0.25)] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[3px] before:bg-gradient-to-b before:from-indigo-400 before:to-purple-600 before:rounded-r-full">
                  {/* Ambient inner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.3)] flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      smart_toy
                    </span>
                  </div>
                  <div className="relative z-10 flex-1">
                    <p className="text-[12px] sm:text-[13px] font-black text-indigo-200 uppercase mb-2 tracking-widest flex items-center gap-2">
                      Investigation Agent Refinement
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    </p>
                    <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/10 text-[13px] text-indigo-100/90 leading-relaxed font-normal">
                      Original status: <span className="text-slate-400 line-through">"Abandoned"</span> <br className="mb-1" />
                      <span className="text-indigo-300 font-semibold">Refinement:</span> "Never Onboarded". Deeper analysis reveals the key decision-maker never completed the initial SSO setup.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Item 3: AI Recommendation */}
        <div className="relative pl-8 border-l border-white/10 pb-2">
          {/* Timeline Bullet */}
          <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-indigo-600 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.4)] z-10">
            <span className="material-symbols-outlined text-white !text-[13px]">bolt</span>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff1f3] via-[#eef2ff] to-[#f4ebff] border border-purple-200/60 p-4 sm:p-5 shadow-[0_12px_40px_rgba(139,92,246,0.1),_inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-300 hover:border-purple-300/80 hover:shadow-[0_16px_48px_rgba(139,92,246,0.15)]">
            {/* Soft background glows to blend the light gradient even more beautifully */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center border border-amber-500/25 shadow-[0_2px_8px_rgba(245,158,11,0.08)]">
                  <span className="material-symbols-outlined text-amber-600 !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">AI Recommendation</h3>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200/50 shadow-sm">
                Next Best Action
              </span>
            </div>
            
            <div className="relative bg-white/80 backdrop-blur-md border border-white/60 rounded-xl p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(139,92,246,0.04),_0_1px_2px_rgba(0,0,0,0.02)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3.5px] before:bg-gradient-to-b before:from-amber-400 before:to-amber-600 before:rounded-r-full relative z-10">
              <p className="pl-3 text-sm sm:text-base font-extrabold leading-snug text-slate-900 tracking-tight mb-2">
                Offer onboarding support — <span className="text-amber-600 font-black">no plan change</span>.
              </p>
              
              <div className="pl-3 border-t border-purple-100/55 pt-2 mt-2">
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                  The customer is high risk due to technical friction, not budget constraints. A downgrade offer would likely trigger an exit. Focus on integration success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Item 4: Automation Decision - Conditional based on automationTier */}
        {customerData.automationTier === "manual_investigation" ? (
          <div className="relative pl-8 border-l border-white/10 pb-2">
            {/* Timeline Bullet */}
            <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-indigo-600 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.4)] z-10">
              <span className="material-symbols-outlined text-white !text-[13px]">smart_toy</span>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-[#141233] via-[#09081a] to-[#1c1133] backdrop-blur-xl border border-indigo-500/25 border-t-indigo-400/35 border-b-indigo-950 p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_12px_36px_rgba(99,102,241,0.18)]">
              {/* Ambient inner glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3.5 relative z-10">
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Automation Decision</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-rose-600 to-red-600 text-white border border-red-400 shadow-[0_0_14px_rgba(220,38,38,0.7)]">
                  MANUAL REVIEW REQUIRED
                </span>
              </div>
              <p className="text-[13px] text-indigo-100/90 leading-relaxed mb-3.5 relative z-10">
                Confidence too low for an automated recommendation — manual investigation needed
              </p>
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/10 text-xs text-indigo-100/85 leading-relaxed italic relative z-10">
                {customerData.decision?.rationale || "This account requires human review due to complex risk factors."}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative pl-8 border-l border-white/10 pb-2">
            {/* Timeline Bullet */}
            <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-indigo-600 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.4)] z-10">
              <span className="material-symbols-outlined text-white !text-[13px]">smart_toy</span>
            </div>
            
            <div className={`relative overflow-hidden bg-gradient-to-br from-[#141233] via-[#09081a] to-[#1c1133] backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(99,102,241,0.18)] ${
              customerData.healthScore >= 70 
                ? 'border border-emerald-500/25 border-t-emerald-400/35 border-b-indigo-950 hover:border-emerald-400/40' 
                : customerData.healthScore >= 40 
                  ? 'border border-amber-500/20 border-t-amber-400/30 border-b-indigo-950 hover:border-amber-400/35' 
                  : 'border border-rose-500/20 border-t-rose-400/30 border-b-indigo-950 hover:border-rose-400/35'
            }`}>
              {/* Ambient inner glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3.5 relative z-10">
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Automation Decision</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  customerData.automationTier === "auto_send" 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                }`}>
                  {customerData.automationTier === "auto_send" ? 'AUTO-SENT' : 'NEEDS YOUR APPROVAL'}
                </span>
              </div>
              
              <p className="text-[13px] text-indigo-100/90 leading-relaxed mb-4 relative z-10">
                This intervention is time-sensitive due to the <span className="font-bold text-white">{customerData.renewalInDays}-day</span> renewal window.
              </p>
              
              {customerData.automationTier === "auto_send" ? (
                <div className="mb-4 relative z-10">
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined !text-[15px] text-emerald-400">check_circle</span>
                    Auto-Sent on {customerData.decision?.decided_at ? new Date(customerData.decision.decided_at).toLocaleString() : "[timestamp not available]"}
                  </p>
                </div>
              ) : null}
              
              <div className="flex flex-wrap gap-3 relative z-10">
                <button
                  onClick={handleApprove}
                  disabled={isApproved || customerData.automationTier === "auto_send"}
                  className={`px-4 py-2 text-white font-extrabold rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    customerData.healthScore >= 70 ? 'bg-emerald-600 hover:bg-emerald-500' : customerData.healthScore >= 40 ? 'bg-amber-600 hover:bg-amber-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  <span className="material-symbols-outlined !text-[14px]">send</span>
                  {isApproved ? "Approved & Sent" : "Approve & Send"}
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isDeclined || customerData.automationTier === "auto_send"}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white font-semibold rounded-xl transition-all active:scale-[0.98] text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                  className="text-xs text-indigo-400 font-medium underline hover:text-indigo-300 cursor-pointer mt-3.5 inline-block relative z-10"
                >
                  Reset Action State
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timeline Item 5: Client Outreach Preview - Conditional based on automationTier */}
        {customerData.automationTier !== "manual_investigation" && (
          <div className="relative pl-8 border-l border-white/10 pb-4">
            {/* Timeline Bullet */}
            <div className="absolute -left-[13px] top-0.5 w-6 h-6 bg-indigo-600 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.4)] z-10">
              <span className="material-symbols-outlined text-white !text-[13px]">mail</span>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-[#12102e] via-[#08081a] to-[#1c113e] backdrop-blur-xl border border-indigo-500/25 border-t-indigo-400/35 border-b-indigo-950 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_12px_36px_rgba(99,102,241,0.18)] flex flex-col">
              {/* Ambient inner glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="bg-white/[0.02] px-5 py-3.5 border-b border-white/10 flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Preview: Client Outreach</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  customerData.automationTier === "auto_send" 
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.1)]'
                }`}>
                  {customerData.automationTier === "auto_send" ? 'SENT' : 'DRAFT'}
                </span>
              </div>
              
              <div className="p-5 bg-transparent flex-1 relative z-10">
                <div className="mb-4">
                  <div className="text-[9px] text-indigo-300/80 mb-1 font-black uppercase tracking-widest">TO: Sarah Jenkins (CTO)</div>
                  <div className="font-extrabold text-white text-sm tracking-tight">Subject: Unlocking your Enterprise Value</div>
                </div>
                
                <div className="font-body-md text-indigo-100 space-y-sm">
                  {customerData.automationTier === "auto_send" ? (
                    <div className="w-full h-44 overflow-y-auto text-xs leading-relaxed text-indigo-100/90 font-sans border border-indigo-500/15 rounded-xl p-3.5 bg-indigo-950/45">
                      {customerData.outreachEmail}
                    </div>
                  ) : (
                    <textarea
                      className="w-full h-44 bg-indigo-950/35 border border-indigo-500/15 rounded-xl focus:border-indigo-400/40 p-3.5 text-xs leading-relaxed text-indigo-100 resize-none outline-none font-sans transition-all duration-200 focus:shadow-[0_0_16px_rgba(99,102,241,0.2)]"
                      value={customerData.outreachEmail}
                      onChange={(e) => setCustomerData({ ...customerData, outreachEmail: e.target.value })}
                      placeholder="Review automatic communication draft..."
                      disabled={customerData.automationTier === "auto_send"}
                    />
                  )}
                </div>
                
                {customerData.automationTier === "auto_send" ? (
                  <p className="text-[11px] text-indigo-200/60 mt-3 italic select-none flex items-center gap-1.5 font-medium">
                    <span>📤</span> This email was automatically sent on {customerData.decision?.decided_at ? new Date(customerData.decision.decided_at).toLocaleString() : "[timestamp not available]"}
                  </p>
                ) : (
                  <p className="text-[11px] text-indigo-200/60 mt-3 italic select-none flex items-center gap-1.5 font-medium">
                    <span>✏️</span> Email content can be directly edited or reviewed prior to sending.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contextual Footer */}
      <footer className="mt-10 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
        <div className="flex items-center gap-3">
          <span>Audit ID: <span className="font-mono text-slate-300">772-BETA-49</span></span>
          <span className="text-white/10">•</span>
          <span>Processed: <span className="font-medium text-slate-300">4 minutes ago</span></span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <span className="material-symbols-outlined text-indigo-400 !text-[15px]">verified_user</span>
          Decision backed by 12TB of multi-tenant behavior data.
        </div>
      </footer>

      {/* Sticky Bottom Human Decision Bar - Conditional based on automationTier */}
      {customerData.automationTier !== "manual_investigation" && (
        <div className="sticky bottom-4 left-0 w-full bg-[#0B1026]/90 border border-white/10 border-t border-white/20 backdrop-blur-xl py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-50 mt-10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
          {/* Subtle Top Highlight Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <span className={`material-symbols-outlined !text-[22px] flex-shrink-0 ${
              isApproved ? "text-emerald-400" : isDeclined ? "text-rose-400" : "text-indigo-400"
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {isApproved ? "check_circle" : isDeclined ? "cancel" : "feedback"}
            </span>
            <div className="flex flex-col">
              <h3 className="text-xs font-semibold text-white">
                {customerData.automationTier === "auto_send" ? "Automated Action Taken" : "Human Decision Needed"}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-300">
                  Status: {" "}
                  {isApproved ? (
                    <span className="text-emerald-400">Approved & Outreach Sent</span>
                  ) : isDeclined ? (
                    <span className="text-rose-400">Logic Declined</span>
                  ) : customerData.automationTier === "auto_send" ? (
                    <span className="text-emerald-400">Auto-Sent on {customerData.decision?.decided_at ? new Date(customerData.decision.decided_at).toLocaleString() : "[timestamp not available]"}</span>
                  ) : (
                    <span className="text-slate-200">Awaiting your approval</span>
                  )}
                </span>
                <span className="text-white/10">•</span>
                <span className="italic text-slate-400">
                  "This intervention is time-sensitive due to the {customerData.renewalInDays}-day renewal window."
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {isApproved || customerData.automationTier === "auto_send" ? (
              <div className="bg-emerald-950/30 text-emerald-300 py-1.5 px-3 rounded-lg flex items-center gap-2 border border-emerald-500/20 text-xs">
                <span className="material-symbols-outlined !text-[13px]">check_circle</span>
                <span className="font-semibold">Outreach Email dispatched successfully.</span>
              </div>
            ) : (
              <button
                onClick={handleApprove}
                disabled={customerData.automationTier === "auto_send"}
                className="py-1.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined !text-[13px]">send</span>
                Approve & Send Outreach
              </button>
            )}

            <button
              disabled={isDeclined || customerData.automationTier === "auto_send"}
              onClick={handleDecline}
              className="py-1.5 px-4 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 font-semibold rounded-lg transition-all active:scale-[0.98] text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-xs text-indigo-400 underline hover:text-indigo-300 font-medium cursor-pointer"
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
