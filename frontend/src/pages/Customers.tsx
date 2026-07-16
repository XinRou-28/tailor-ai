import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Customer {
  id: string;
  name: string;
  domain: string;
  initial: string;
  plan: string;
  health: number;
  risk: "Low" | "Medium" | "High Risk";
  automation: "Full Auto" | "Review Req." | "Manual";
  lastActivityTime: string;
  lastActivityDesc: string;
}

interface CustomersProps {
  searchQuery: string;
  onNavigate?: (view: string) => void;
}

type SortField = "name" | "plan" | "health" | "risk" | "automation" | "activity";
type SortOrder = "none" | "asc" | "desc";

export default function Customers({ searchQuery, onNavigate }: CustomersProps) {
  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bottom Revenue Leakage section state
  const [showLeakageCard, setShowLeakageCard] = useState(true);

  // Selected filter tab: "All" | "High Risk" | "Medium Risk" | "Low Risk"
  const [riskFilter, setRiskFilter] = useState<"All" | "High Risk" | "Medium Risk" | "Low Risk">("All");

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // To showcase pagination smoothly on 10 records

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "vortex",
      name: "Vortex Media",
      domain: "vortex-media.io",
      initial: "V",
      plan: "Enterprise Plus",
      health: 92,
      risk: "Low",
      automation: "Full Auto",
      lastActivityTime: "2 mins ago",
      lastActivityDesc: "Price Optimization",
    },
    {
      id: "acme",
      name: "Acme Corp",
      domain: "acme.sh",
      initial: "A",
      plan: "Professional",
      health: 34,
      risk: "High Risk",
      automation: "Review Req.",
      lastActivityTime: "1 hour ago",
      lastActivityDesc: "Payment Failure",
    },
    {
      id: "lumina",
      name: "Lumina Lab",
      domain: "lumina.io",
      initial: "L",
      plan: "Custom Scale",
      health: 62,
      risk: "Medium",
      automation: "Full Auto",
      lastActivityTime: "4 hours ago",
      lastActivityDesc: "Seat Cleanup",
    },
    {
      id: "dataflow",
      name: "DataFlow",
      domain: "dataflow.com",
      initial: "D",
      plan: "Professional",
      health: 85,
      risk: "Low",
      automation: "Manual",
      lastActivityTime: "Yesterday",
      lastActivityDesc: "User Login",
    },
    {
      id: "pixel",
      name: "Pixel Perfect",
      domain: "pixelperfect.co",
      initial: "P",
      plan: "Business",
      health: 75,
      risk: "Medium",
      automation: "Full Auto",
      lastActivityTime: "3 hours ago",
      lastActivityDesc: "Invoiced",
    },
    {
      id: "cloudscale",
      name: "Cloud Scale",
      domain: "cloudscale.net",
      initial: "C",
      plan: "Standard",
      health: 64,
      risk: "Medium",
      automation: "Review Req.",
      lastActivityTime: "Yesterday",
      lastActivityDesc: "Plan Upgraded",
    },
    {
      id: "venture",
      name: "Venture Labs",
      domain: "venturelabs.io",
      initial: "V",
      plan: "Pro Growth",
      health: 20,
      risk: "High Risk",
      automation: "Review Req.",
      lastActivityTime: "2 hours ago",
      lastActivityDesc: "Credit Card Fail",
    },
    {
      id: "novatech",
      name: "Nova Tech",
      domain: "novatech.com",
      initial: "N",
      plan: "Enterprise Plus",
      health: 96,
      risk: "Low",
      automation: "Full Auto",
      lastActivityTime: "5 mins ago",
      lastActivityDesc: "Seat Cleanup",
    },
    {
      id: "quantum",
      name: "Quantum Labs",
      domain: "quantum.sh",
      initial: "Q",
      plan: "Professional",
      health: 45,
      risk: "High Risk",
      automation: "Manual",
      lastActivityTime: "12 hours ago",
      lastActivityDesc: "User Login",
    },
    {
      id: "echo",
      name: "Echo Digital",
      domain: "echodigital.io",
      initial: "E",
      plan: "Custom Scale",
      health: 88,
      risk: "Low",
      automation: "Full Auto",
      lastActivityTime: "1 day ago",
      lastActivityDesc: "Price Optimization",
    }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExportCSV = () => {
    triggerToast("Customer portfolio CSV export successfully downloaded!");
  };

  const handleAddCustomer = () => {
    const inputName = prompt("Enter new Customer name:");
    if (!inputName) return;
    const inputDomain = prompt("Enter domain name (e.g. example.com):") || `${inputName.toLowerCase().replace(/\s+/g, "")}.com`;
    const inputPlan = prompt("Enter Plan type (e.g. Enterprise, Professional, Custom Scale):") || "Standard";
    const inputHealthStr = prompt("Enter initial Health score (0-100):") || "80";
    const healthNum = Math.min(100, Math.max(0, parseInt(inputHealthStr, 10) || 80));
    
    let riskLevel: "Low" | "Medium" | "High Risk" = "Low";
    if (healthNum < 40) riskLevel = "High Risk";
    else if (healthNum < 70) riskLevel = "Medium";

    const newCust: Customer = {
      id: "cust_" + Date.now(),
      name: inputName,
      domain: inputDomain,
      initial: inputName.charAt(0).toUpperCase(),
      plan: inputPlan,
      health: healthNum,
      risk: riskLevel,
      automation: healthNum < 50 ? "Review Req." : "Full Auto",
      lastActivityTime: "Just now",
      lastActivityDesc: "Account Provisioned"
    };

    setCustomers([newCust, ...customers]);
    triggerToast(`Added ${inputName} to active customer list.`);
  };

  // Toggle sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "none") setSortOrder("asc");
      else if (sortOrder === "asc") setSortOrder("desc");
      else setSortOrder("none");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Helper to render correct sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortOrder === "none") {
      return "swap_vert";
    }
    return sortOrder === "asc" ? "arrow_upward" : "arrow_downward";
  };

  // Filter & sort logic
  const filteredCustomers = customers.filter(cust => {
    // 1. Search Query filter (matches name, domain, plan or activity desc)
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.lastActivityDesc.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Risk Tab filter
    if (riskFilter === "All") return matchesSearch;
    return matchesSearch && cust.risk === riskFilter;
  });

  // Sort filtered customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortOrder === "none") return 0;
    
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "plan") {
      comparison = a.plan.localeCompare(b.plan);
    } else if (sortField === "health") {
      comparison = a.health - b.health;
    } else if (sortField === "risk") {
      comparison = a.risk.localeCompare(b.risk);
    } else if (sortField === "automation") {
      comparison = a.automation.localeCompare(b.automation);
    } else if (sortField === "activity") {
      comparison = a.lastActivityDesc.localeCompare(b.lastActivityDesc);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Pagination calculation
  const totalItems = sortedCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = sortedCustomers.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto w-full" id="customers-view-container">
      {/* Toast alert */}
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

      {/* Page Header & Stats */}
      <div className="flex justify-between items-end mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0.5">Customer Portfolio</h1>
          <p className="text-gray-500 text-xs">Analyze and manage {customers.length} active subscriptions across your ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">download</span> Export CSV
          </button>
          <button 
            onClick={handleAddCustomer}
            className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">add</span> Add Customer
          </button>
        </div>
      </div>

      {/* Decision Spine Focus: Intelligence Insights */}
      {showLeakageCard && (
        <div className="w-full bg-[#1c1c21] rounded-xl p-5 flex flex-col md:flex-row items-center gap-5 mt-1 shadow-sm border border-gray-800">
          {/* Left Section (Circular Metric) */}
          <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center relative border-4 border-gray-700 flex-shrink-0">
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff5722] rounded-full border border-[#1c1c21]"></div>
            <span className="text-white text-xl font-extrabold leading-none">12</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Critical</span>
          </div>
          {/* Middle Section (Text) */}
          <div className="flex-1 flex flex-col gap-1 text-left">
            <h4 className="text-white text-sm font-bold">Revenue Leakage Found</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              12 Professional-tier customers haven't used their expanded seat allotment in 60+ days — an estimated $14.2k annual ARR loss from perceived low value.
            </p>
          </div>
          {/* Right Section (Buttons) */}
          <div className="flex flex-col gap-2 w-full md:w-48">
            <button 
              onClick={() => {
                triggerToast("Strategy 'Automate Seat Replacement' applied successfully to 12 leakage points.");
                setShowLeakageCard(false);
              }}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 text-xs font-semibold hover:bg-opacity-90 transition-all cursor-pointer text-center"
            >
              Apply Strategy
            </button>
            <button 
              onClick={() => {
                triggerToast("Leakage alert dismissed.");
                setShowLeakageCard(false);
              }}
              className="w-full bg-transparent border border-gray-600 text-gray-300 rounded-lg py-2 text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Summary Grid (Quick Insights) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active MRR */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active MRR</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-gray-900 tracking-tight">$2.4M</span>
            <span className="text-emerald-600 text-[10px] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
          </div>
        </div>

        {/* Avg Health Score */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg Health Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-gray-900 tracking-tight">78.4</span>
            <span className="text-rose-600 text-[10px] font-semibold bg-rose-50 px-1.5 py-0.5 rounded">-2.1</span>
          </div>
        </div>

        {/* At Risk (ARR) */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">At Risk (ARR)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-gray-900 tracking-tight">$412k</span>
            <span className="text-rose-600 text-[10px] font-semibold bg-rose-50 px-1.5 py-0.5 rounded">Alert</span>
          </div>
        </div>

        {/* Auto-Optimized */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Auto-Optimized</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-gray-900 tracking-tight">84%</span>
            <span className="text-emerald-600 text-[10px] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Stable</span>
          </div>
        </div>
      </div>

      {/* Table Actions & Filters */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2">
          {(["All", "High Risk", "Medium Risk", "Low Risk"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setRiskFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                riskFilter === tab
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems}
          </span>
          <div className="flex">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200/80">
                
                {/* Company Name Header */}
                <th 
                  onClick={() => handleSort("name")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-1">
                    Company Name 
                    <span className={`material-symbols-outlined text-xs transition-all ${
                      sortField === "name" && sortOrder !== "none" ? "text-secondary opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {getSortIcon("name")}
                    </span>
                  </div>
                </th>

                {/* Plan Header */}
                <th 
                  onClick={() => handleSort("plan")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-1">
                    Plan 
                    <span className={`material-symbols-outlined text-xs transition-all ${
                      sortField === "plan" && sortOrder !== "none" ? "text-secondary opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {getSortIcon("plan")}
                    </span>
                  </div>
                </th>

                {/* Health Score Header */}
                <th 
                  onClick={() => handleSort("health")}
                  className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center justify-center gap-1">
                    Health Score 
                    <span className={`material-symbols-outlined text-xs transition-all ${
                      sortField === "health" && sortOrder !== "none" ? "text-secondary opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {getSortIcon("health")}
                    </span>
                  </div>
                </th>

                {/* Risk Header */}
                <th 
                  onClick={() => handleSort("risk")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-1">
                    Risk 
                    <span className={`material-symbols-outlined text-xs transition-all ${
                      sortField === "risk" && sortOrder !== "none" ? "text-secondary opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {getSortIcon("risk")}
                    </span>
                  </div>
                </th>

                {/* Automation Tier Header */}
                <th 
                  onClick={() => handleSort("automation")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-1">
                    Automation Tier 
                    <span className={`material-symbols-outlined text-xs transition-all ${
                      sortField === "automation" && sortOrder !== "none" ? "text-secondary opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {getSortIcon("automation")}
                    </span>
                  </div>
                </th>

                {/* Last Activity Header */}
                <th 
                  onClick={() => handleSort("activity")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-1">
                    Last Activity 
                    <span className={`material-symbols-outlined text-xs transition-all ${
                      sortField === "activity" && sortOrder !== "none" ? "text-secondary opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {getSortIcon("activity")}
                    </span>
                  </div>
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 font-medium text-xs">
                    No matching customers found for current filters or query.
                  </td>
                </tr>
              ) : (
                currentItems.map((cust) => (
                  <tr 
                    key={cust.id} 
                    onClick={() => onNavigate && onNavigate("details")}
                    className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors duration-150"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-primary">
                          {cust.initial}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{cust.name}</p>
                          <p className="text-xs text-slate-500">{cust.domain}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-gray-600 font-semibold uppercase">
                        {cust.plan}
                      </span>
                    </td>

                    {/* Health Score */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${
                          cust.health > 80 ? "text-emerald-600" : cust.health >= 50 ? "text-amber-600" : "text-red-500"
                        }`}>{cust.health}</span>
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              cust.health > 80 ? "bg-emerald-500" : cust.health >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${cust.health}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-3">
                      {cust.risk === "Low" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Low
                        </span>
                      )}
                      {cust.risk === "Medium" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60 gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Medium
                        </span>
                      )}
                      {cust.risk === "High Risk" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60 gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> High Risk
                        </span>
                      )}
                    </td>

                    {/* Automation Badge */}
                    <td className="px-4 py-3">
                      {cust.automation === "Full Auto" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60 gap-1 w-fit">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span> Full Auto
                        </span>
                      )}
                      {cust.automation === "Review Req." && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60 gap-1 w-fit">
                          <span className="material-symbols-outlined text-xs">visibility</span> Review Req.
                        </span>
                      )}
                      {cust.automation === "Manual" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/60 gap-1 w-fit">
                          <span className="material-symbols-outlined text-xs">person</span> Manual
                        </span>
                      )}
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-gray-900">{cust.lastActivityTime}</p>
                      <p className={`text-[10px] ${
                        cust.risk === "High Risk" ? "text-red-600 font-semibold" : "text-gray-400"
                      }`}>{cust.lastActivityDesc}</p>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
