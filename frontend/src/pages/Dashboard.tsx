import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CompanyCard {
  id: string;
  name: string;
  health: number;
  healthColor: string; // text-secondary, text-error, text-green-600
  plan: string;
  description: string;
  statusBadge: string;
  badgeBg: string; // colors
  primaryAction: string;
  secondaryAction: string;
}

interface LogItem {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: string;
}

interface DashboardProps {
  searchQuery: string;
}

export default function Dashboard({ searchQuery }: DashboardProps) {
  // Today's Digest Companies list (stateful so items can be interactive)
  const [companies, setCompanies] = useState<CompanyCard[]>([
    {
      id: "abc",
      name: "ABC Company",
      health: 92,
      healthColor: "text-secondary",
      plan: "Enterprise",
      description: "Enterprise plan usage dropped 40% last month. Contract renewal in 60 days. Risk of churn is high.",
      statusBadge: "Manual Review",
      badgeBg: "bg-secondary/10 text-secondary",
      primaryAction: "Downgrade Plan",
      secondaryAction: "Dismiss"
    },
    {
      id: "xyz",
      name: "XYZ Corp",
      health: 14,
      healthColor: "text-error",
      plan: "Business",
      description: "Payment failed 3 times. Account will be suspended in 48 hours. Direct human intervention recommended.",
      statusBadge: "Critical",
      badgeBg: "bg-error-container text-on-error-container",
      primaryAction: "Call Customer",
      secondaryAction: "Ignore Risk"
    },
    {
      id: "global",
      name: "Global Tech Solutions",
      health: 78,
      healthColor: "text-green-600",
      plan: "Pro Growth",
      description: "Expansion opportunity. User seat count exceeded limit by 15. Recommendation to upgrade to Unlimited.",
      statusBadge: "Opportunity",
      badgeBg: "bg-green-100 text-green-700",
      primaryAction: "Upgrade Now",
      secondaryAction: "Decline"
    }
  ]);

  // Activity Log list
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: "log1",
      title: "Sent Reminder",
      time: "2m ago",
      description: "Invoiced Pixel Perfect for $450.00 extra seat usage.",
      icon: "check_circle"
    },
    {
      id: "log2",
      title: "Plan Upgraded",
      time: "45m ago",
      description: "Auto-upgraded Cloud Scale to Tier 2 based on usage surge.",
      icon: "rocket_launch"
    },
    {
      id: "log3",
      title: "Notification Sent",
      time: "2h ago",
      description: "Dunning email sent to Venture Labs after credit card failure.",
      icon: "mail"
    }
  ]);

  // Interactive UI indicators
  const [highRiskCount, setHighRiskCount] = useState(12);
  const [digestCount, setDigestCount] = useState(3);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // FAB Menu state
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Filtered companies based on search
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle action triggers
  const handlePrimaryAction = (companyId: string, actionName: string, companyName: string) => {
    // Show temporary banner
    triggerNotification(`Successfully triggered action "${actionName}" for ${companyName}!`);
    
    // Add to activity logs
    const newLog: LogItem = {
      id: "log_" + Date.now(),
      title: actionName,
      time: "Just now",
      description: `Manually executed action on ${companyName}.`,
      icon: "done_all"
    };
    setLogs([newLog, ...logs]);

    // Remove or resolve card
    setCompanies(companies.filter(c => c.id !== companyId));
    setDigestCount(prev => Math.max(0, prev - 1));
    if (companyId === "xyz") {
      setHighRiskCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleSecondaryAction = (companyId: string, actionName: string, companyName: string) => {
    triggerNotification(`Dismissed recommendation for ${companyName}.`);
    
    // Remove from Digest
    setCompanies(companies.filter(c => c.id !== companyId));
    setDigestCount(prev => Math.max(0, prev - 1));
  };

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  // Add mock customer
  const handleAddCustomer = () => {
    const names = ["Apex Software", "Nova Tech", "Quantum Labs", "Echo Digital"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newComp: CompanyCard = {
      id: "comp_" + Date.now(),
      name: randomName,
      health: Math.floor(Math.random() * 40) + 10, // low health
      healthColor: "text-error",
      plan: "Growth",
      description: "Low active logins detected over past 7 days. Customer recently changed account administrator.",
      statusBadge: "Risk Analysis",
      badgeBg: "bg-orange-100 text-orange-800",
      primaryAction: "Assign Training",
      secondaryAction: "Decline"
    };

    setCompanies([newComp, ...companies]);
    setDigestCount(prev => prev + 1);
    setHighRiskCount(prev => prev + 1);
    setIsFabOpen(false);
    triggerNotification(`Added new customer ${randomName} to portfolio list.`);
  };

  const handleCreateNote = () => {
    alert("Simulation: Opened modal to write team notes.");
    setIsFabOpen(false);
  };

  const handleLogTask = () => {
    alert("Simulation: Opened modal to schedule client task.");
    setIsFabOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto w-full relative" id="dashboard-main-scrollable">
      {/* Toast notification */}
      <AnimatePresence>
        {notificationMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-xs font-semibold">{notificationMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0.5">Good morning, Mei</h1>
        <p className="text-gray-500 text-xs">
          Tailor AI has identified <span className="font-semibold text-error">{highRiskCount} high-risk subscriptions</span> that require your immediate attention.
        </p>
      </div>

      {/* Hero Grid Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Hero Banner (approx 70%) */}
        <div className="flex-1 w-full bg-[#3b52e6] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5 text-white shadow-sm">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle 
                className="text-white/20" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="42" 
                stroke="currentColor" 
                strokeWidth="7"
              ></circle>
              <circle 
                className="text-white progress-ring" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="42" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeWidth="7" 
                style={{ strokeDasharray: "263.89", strokeDashoffset: "58.05" }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold leading-none tracking-tight">78</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/95 mt-0.5">Avg Health</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-base font-bold tracking-tight mb-1 text-white">Portfolio Health</h2>
            <p className="text-white/90 text-xs leading-normal">
              Up 2.1 points this week. 84% of accounts are tracking auto-optimized, no human review needed.
            </p>
          </div>
        </div>

        {/* Sidebar Cards (approx 30%) */}
        <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white border border-[#e5e7eb] p-4 rounded-xl flex items-center gap-3 flex-1 shadow-sm hover:translate-y-[-1px] transition-transform duration-200">
            <div className="bg-error-container/30 p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-lg">warning</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-0.5">High-Risk Accounts</span>
              <span className="text-xl font-bold text-error tracking-tight">{highRiskCount}</span>
            </div>
          </div>
          <div className="bg-white border border-[#e5e7eb] p-4 rounded-xl flex items-center gap-3 flex-1 shadow-sm hover:translate-y-[-1px] transition-transform duration-200">
            <div className="bg-secondary-container p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Digest — Awaiting You</span>
              <span className="text-xl font-bold text-primary tracking-tight">{digestCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Today's Digest */}
        <section className="flex-1 w-full flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">Today's Digest Preview</h2>
            <button 
              onClick={() => alert("Review All trigger: Batch loader initialized.")}
              className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:translate-y-[-1px] active:scale-95 shadow-sm cursor-pointer"
            >
              Review All
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {filteredCompanies.length === 0 ? (
              <div className="bg-white border border-[#e5e7eb] p-6 rounded-xl text-center text-gray-500 text-xs">
                <span className="material-symbols-outlined text-2xl mb-1.5 block text-on-primary-container">info</span>
                No active matching items in Today's Digest. Search query or action cleared the list.
              </div>
            ) : (
              filteredCompanies.map((comp) => (
                <div 
                  key={comp.id}
                  className="bg-white border border-[#e5e7eb] p-4 rounded-xl grid grid-cols-12 gap-4 items-center hover:translate-y-[-1px] hover:shadow-sm hover:border-[#4253d8]/40 transition-all duration-300"
                >
                  <div className="col-span-2 text-center">
                    <div className={`text-2xl font-extrabold ${comp.healthColor}`}>{comp.health}</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Health</div>
                  </div>
                  <div className="col-span-6 border-l border-[#e5e7eb]/80 pl-4">
                    <h3 className="text-xs font-bold text-gray-900 mb-1">{comp.name}</h3>
                    <p className="text-[11px] text-gray-500 leading-normal">{comp.description}</p>
                    <div className="mt-2 flex gap-1.5">
                      <span className={`${comp.badgeBg} px-1.5 py-0.5 rounded text-[9px] font-bold uppercase`}>
                        {comp.statusBadge}
                      </span>
                      <span className="bg-background text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-[#e5e7eb]/80">
                        {comp.plan}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-4 flex flex-col gap-1.5">
                    <button 
                      onClick={() => handlePrimaryAction(comp.id, comp.primaryAction, comp.name)}
                      className="w-full bg-secondary text-white font-semibold text-xs py-1.5 rounded-lg hover:opacity-90 transition-all cursor-pointer"
                    >
                      {comp.primaryAction}
                    </button>
                    <button 
                      onClick={() => handleSecondaryAction(comp.id, comp.secondaryAction, comp.name)}
                      className="w-full text-gray-500 font-semibold text-xs py-1.5 rounded-lg hover:bg-background transition-colors cursor-pointer"
                    >
                      {comp.secondaryAction}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Auto-sent Log */}
        <aside className="w-full lg:w-[280px] flex-shrink-0 bg-white border border-[#e5e7eb] rounded-xl flex flex-col shadow-sm h-fit">
          <div className="px-4 py-3 border-b border-[#e5e7eb]/80 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Auto-sent Log</h2>
            <span className="material-symbols-outlined text-gray-400 text-lg">history</span>
          </div>
          
          <div className="p-4 flex flex-col gap-3.5 decision-spine-border">
            {logs.map((log) => (
              <div key={log.id} className="relative z-10 flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {log.icon}
                  </span>
                </div>
                <div className="flex-1 pb-2 border-b border-outline-variant/40 last:border-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-gray-900">{log.title}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal" dangerouslySetInnerHTML={{ __html: log.description }} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-b-xl border-t border-[#e5e7eb]/80">
            <button 
              onClick={() => alert("Simulation: Redirecting to full audits logs.")}
              className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all cursor-pointer"
            >
              View Full Activity Log
            </button>
          </div>
        </aside>
      </div>

      {/* Quick Action Menu Overlay */}
      <div 
        className={`fixed bottom-[80px] right-6 w-48 bg-white border border-[#e5e7eb] rounded-xl shadow-2xl z-[100] fab-menu-transition ${
          isFabOpen ? "fab-menu-visible" : "fab-menu-hidden"
        }`} 
        id="fabMenu"
      >
        <div className="p-3 flex flex-col gap-1">
          <button 
            onClick={handleAddCustomer}
            className="flex items-center gap-3 w-full px-2.5 py-1.5 text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">person_add</span>
            <span className="text-xs font-semibold text-gray-700">Add Customer</span>
          </button>
          <button 
            onClick={handleCreateNote}
            className="flex items-center gap-3 w-full px-2.5 py-1.5 text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">note_add</span>
            <span className="text-xs font-semibold text-gray-700">Create Note</span>
          </button>
          <div className="h-px bg-outline-variant/40 my-1"></div>
          <button 
            onClick={handleLogTask}
            className="flex items-center gap-3 w-full px-2.5 py-1.5 text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">task_alt</span>
            <span className="text-xs font-semibold text-gray-700">Log Task</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsFabOpen(!isFabOpen)}
        className="fixed bottom-6 right-6 w-11 h-11 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group z-[100] cursor-pointer" 
        id="fabButton"
      >
        <span 
          className="material-symbols-outlined text-xl transition-transform duration-300" 
          id="fabIcon" 
          style={{ transform: isFabOpen ? "rotate(135deg)" : "rotate(0deg)" }}
        >
          add
        </span>
        <span 
          className={`absolute right-14 bg-primary text-white px-2.5 py-1 rounded-md pointer-events-none transition-opacity whitespace-nowrap text-[11px] font-semibold shadow-md ${
            isFabOpen ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          }`} 
          id="fabTooltip"
        >
          Add Manual Task
        </span>
      </button>
    </div>
  );
}
