import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {getAccounts} from "../api/accounts";
import {useEffect} from "react";

interface Customer {
  id: string;
  name: string;
  domain: string;
  initial: string;
  plan: string;
  health: number;
  risk: "Low" | "Medium" | "High";
  automation: "Full Auto" | "Review Req." | "Manual";
  lastActivityTime: string;
  lastActivityDesc: string;
}

interface CustomersProps {
  searchQuery: string;
  onNavigate?: (view: string) => void;
}

type SortField = "name" | "plan" | "health" | "risk" | "automation" | "lastActivityTime";
type SortOrder = "none" | "asc" | "desc";

export default function Customers({ searchQuery, onNavigate }: CustomersProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<"All" | "High Risk" | "Medium Risk" | "Low Risk">("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  // ... (保持原有的 customers 数据状态和逻辑不变)
  const [customers,setCustomers]=useState<Customer[]>([]);


useEffect(()=>{

 async function loadCustomers(){

    try{

       const data = await getAccounts();

       setCustomers(
          data.accounts.map(account=>({
             id:account.customer_id,
             name:account.company_name,
             plan:account.current_plan,
             health:account.health_score,
             risk:account.risk_level,
             initial:account.company_name[0],
             domain:"",
             automation:"Review Req.",
             lastActivityTime:"",
             lastActivityDesc:""
          }))
       );

    }catch(error){
       console.error(error);

    }finally{

       setLoading(false);

    }

 }

 loadCustomers();

},[]);

  const triggerToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };
  
  // Comprehensive search and risk filtering logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cust.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.plan.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (riskFilter === "All") return matchesSearch;
    // Map risk tab selector values properly to data values
    const mappedRisk = riskFilter === "High Risk" ? "High Risk" : riskFilter === "Medium Risk" ? "Medium" : "Low";
    return matchesSearch && cust.risk === mappedRisk;
  });

  // Dynamic sorting implementation
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortOrder === "none" || !sortField) return 0;
    
    let valA: any = a[sortField];
    let valB: any = b[sortField];
    
    if (sortField === "risk") {
      const riskWeight = { "High": 3, "Medium": 2, "Low": 1 };
      valA = riskWeight[a.risk] || 0;
      valB = riskWeight[b.risk] || 0;
    } else if (sortField === "automation") {
      const autoWeight = { "Full Auto": 3, "Review Req.": 2, "Manual": 1 };
      valA = autoWeight[a.automation] || 0;
      valB = autoWeight[b.automation] || 0;
    } else if (sortField === "lastActivityTime") {
      valA = a.lastActivityTime;
      valB = b.lastActivityTime;
    }
    
    if (typeof valA === "string") {
      return sortOrder === "asc" 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc"
        ? (valA > valB ? 1 : -1)
        : (valA < valB ? 1 : -1);
    }
  });

  const totalItems = sortedCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentItems = sortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRiskFilterChange = (tab: typeof riskFilter) => {
    setRiskFilter(tab);
    setCurrentPage(1); // reset to page 1 on filter
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "none" ? "asc" : prev === "asc" ? "desc" : "none");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // reset to page 1 on sort
  };

  const getAutomationBadge = (type: string) => {
    switch (type) {
      case "Full Auto":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 text-emerald-200 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Full Auto
          </span>
        );
      case "Review Req.":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-200 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Review Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-200 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Manual
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full p-6 text-slate-200">
      {/* Background radial glow */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Customer Portfolio</h1>
            <p className="text-slate-400 text-sm">Analyze and manage {customers.length} active subscriptions.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => triggerToast("Exporting...")} className="bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">Export CSV</button>
             <button onClick={() => triggerToast("Add customer flow requested.")} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer">Add Customer</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Active MRR", val: "$2.4M", trend: "+12%", color: "emerald" },
            { label: "Avg Health Score", val: "78.4", trend: "-2.1", color: "rose" },
            { label: "At Risk (ARR)", val: "$412k", trend: "Alert", color: "rose" },
            { label: "Auto-Optimized", val: "84%", trend: "Stable", color: "emerald" }
          ].map((stat, i) => (
            <div key={i} className="relative overflow-hidden bg-gradient-to-br from-[#141233] via-[#09081a] to-[#1a1133] backdrop-blur-xl border border-indigo-500/15 border-t-indigo-400/25 border-b-indigo-950/60 p-5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:border-indigo-500/30 transition-all duration-300">
              <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.05em] text-[#E2E8F0]">{stat.label}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold">{stat.val}</span>
                <span className={`text-[10px] font-bold bg-${stat.color}-500/10 text-${stat.color}-400 px-2 py-0.5 rounded-md`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlighted Table Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#12132e] via-[#08081a] to-[#171032] backdrop-blur-2xl border border-indigo-500/25 border-t-indigo-400/35 border-b-indigo-950 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.65),_inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300">
           {/* Ambient radial glows inside the deep dark table */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
           <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/5 rounded-full blur-[50px] pointer-events-none" />
           
           {/* Cyan/indigo gradient light bar at the top of the table for distinct premium finish */}
           <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/40 to-teal-500/15 pointer-events-none"></div>

           {/* Table Header Controls / Filter Tabs */}
           <div className="p-5 border-b border-white/[0.06] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.01]">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <span className="material-symbols-outlined !text-[18px]">group</span>
               </div>
               <div>
                 <h3 className="text-sm font-semibold text-white tracking-tight">Active Portfolio</h3>
                 <p className="text-[11px] text-slate-400">Deep search and sort customer parameters live</p>
               </div>
             </div>
             <div className="flex flex-wrap gap-1 bg-slate-950/40 p-1 rounded-xl border border-white/5">
               {(["All", "High Risk", "Medium Risk", "Low Risk"] as const).map(tab => {
                 const isActive = riskFilter === tab;
                 return (
                   <button
                     key={tab}
                     onClick={() => handleRiskFilterChange(tab)}
                     className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                       isActive
                         ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] border-t border-white/10'
                         : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                     }`}
                   >
                     {tab}
                   </button>
                 );
               })}
             </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-slate-400 text-xs border-b border-white/[0.08] bg-[#0c0e1e]/60 select-none">
                   {/* Column 1: Company */}
                   <th 
                     onClick={() => handleSort("name")}
                     className="px-6 py-4.5 font-semibold tracking-wider uppercase cursor-pointer hover:text-white transition-all group/th"
                   >
                     <div className="flex items-center gap-1.5">
                       <span>Company</span>
                       <span className={`material-symbols-outlined !text-[14px] transition-all duration-200 ${
                         sortField === "name" && sortOrder !== "none"
                           ? "opacity-100 text-indigo-400"
                           : "opacity-0 group-hover/th:opacity-50 text-slate-400"
                       } ${sortField === "name" && sortOrder === "desc" ? "rotate-180" : ""}`}>
                         arrow_upward
                       </span>
                     </div>
                   </th>
                   {/* Column 2: Plan */}
                   <th 
                     onClick={() => handleSort("plan")}
                     className="px-6 py-4.5 font-semibold tracking-wider uppercase cursor-pointer hover:text-white transition-all group/th"
                   >
                     <div className="flex items-center gap-1.5">
                       <span>Plan</span>
                       <span className={`material-symbols-outlined !text-[14px] transition-all duration-200 ${
                         sortField === "plan" && sortOrder !== "none"
                           ? "opacity-100 text-indigo-400"
                           : "opacity-0 group-hover/th:opacity-50 text-slate-400"
                       } ${sortField === "plan" && sortOrder === "desc" ? "rotate-180" : ""}`}>
                         arrow_upward
                       </span>
                     </div>
                   </th>
                   {/* Column 3: Health */}
                   <th 
                     onClick={() => handleSort("health")}
                     className="px-6 py-4.5 font-semibold tracking-wider text-center uppercase cursor-pointer hover:text-white transition-all group/th"
                   >
                     <div className="flex items-center justify-center gap-1.5">
                       <span>Health</span>
                       <span className={`material-symbols-outlined !text-[14px] transition-all duration-200 ${
                         sortField === "health" && sortOrder !== "none"
                           ? "opacity-100 text-indigo-400"
                           : "opacity-0 group-hover/th:opacity-50 text-slate-400"
                       } ${sortField === "health" && sortOrder === "desc" ? "rotate-180" : ""}`}>
                         arrow_upward
                       </span>
                     </div>
                   </th>
                   {/* Column 4: Risk */}
                   <th 
                     onClick={() => handleSort("risk")}
                     className="px-6 py-4.5 font-semibold tracking-wider uppercase cursor-pointer hover:text-white transition-all group/th"
                   >
                     <div className="flex items-center gap-1.5">
                       <span>Risk</span>
                       <span className={`material-symbols-outlined !text-[14px] transition-all duration-200 ${
                         sortField === "risk" && sortOrder !== "none"
                           ? "opacity-100 text-indigo-400"
                           : "opacity-0 group-hover/th:opacity-50 text-slate-400"
                       } ${sortField === "risk" && sortOrder === "desc" ? "rotate-180" : ""}`}>
                         arrow_upward
                       </span>
                     </div>
                   </th>
                   {/* Column 5: Automation */}
                   <th 
                     onClick={() => handleSort("automation")}
                     className="px-6 py-4.5 font-semibold tracking-wider uppercase cursor-pointer hover:text-white transition-all group/th"
                   >
                     <div className="flex items-center gap-1.5">
                       <span>Automation</span>
                       <span className={`material-symbols-outlined !text-[14px] transition-all duration-200 ${
                         sortField === "automation" && sortOrder !== "none"
                           ? "opacity-100 text-indigo-400"
                           : "opacity-0 group-hover/th:opacity-50 text-slate-400"
                       } ${sortField === "automation" && sortOrder === "desc" ? "rotate-180" : ""}`}>
                         arrow_upward
                       </span>
                     </div>
                   </th>
                   {/* Column 6: Last Activity */}
                   <th className="px-6 py-4.5 font-semibold tracking-wider uppercase">
                     Last Activity
                   </th>
                   {/* Column 7: Actions */}
                   <th className="px-6 py-4.5 w-10"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.04]">
                 {currentItems.map((cust) => (
                   <tr 
                     key={cust.id} 
                     onClick={() => onNavigate?.("details")}
                     className="hover:bg-white/[0.03] active:bg-white/[0.05] transition-all duration-200 cursor-pointer group"
                   >
                     <td className="px-6 py-5">
                       <div className="flex items-center gap-3.5">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 border border-indigo-500/15 flex items-center justify-center text-indigo-300 font-bold text-base shadow-[0_2px_12px_rgba(99,102,241,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-400/40">
                           {cust.initial}
                         </div>
                         <div>
                           <p className="text-[14px] font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors duration-200">{cust.name}</p>
                           <p className="text-[11px] text-slate-400 mt-0.5">{cust.domain}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-5">
                       <div className="flex flex-col justify-center">
                         <span className="text-xs font-semibold text-slate-100 tracking-wide">{cust.plan}</span>
                         <span className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {cust.id}</span>
                       </div>
                     </td>
                     <td className="px-6 py-5">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              cust.health >= 80 ? 'bg-emerald-400' : cust.health >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}></span>
                            <span className="text-xs font-mono font-bold text-white tracking-wider">{cust.health}%</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                                cust.health >= 80 
                                  ? 'from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.35)]' 
                                  : cust.health >= 50 
                                  ? 'from-amber-500 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.35)]' 
                                  : 'from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.35)]'
                              }`} 
                              style={{ width: `${cust.health}%` }}
                            ></div>
                          </div>
                        </div>
                     </td>
                     <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          cust.risk === 'High' 
                            ? 'bg-rose-500/15 text-rose-200 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]' 
                            : cust.risk === 'Medium' 
                            ? 'bg-amber-500/15 text-amber-200 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
                            : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        }`}>
                          {cust.risk === 'High' ? '⚠️ High Risk' : cust.risk === 'Medium' ? '⚡ Medium' : '✓ Low Risk'}
                        </span>
                     </td>
                     <td className="px-6 py-5 text-xs font-medium text-slate-300 tracking-wide">
                       {getAutomationBadge(cust.automation)}
                     </td>
                     <td className="px-6 py-5">
                        <p className="text-xs font-semibold text-slate-200">{cust.lastActivityTime}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{cust.lastActivityDesc}</p>
                     </td>
                     <td className="px-6 py-5 text-right w-10">
                       <span className="material-symbols-outlined text-slate-500 group-hover:text-indigo-400 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 !text-[18px]">
                         chevron_right
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* Pagination and Summary footer */}
           <div className="px-6 py-4.5 border-t border-white/[0.06] bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
             <span className="text-xs text-[#CBD5E1]">
               Showing <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
               <span className="font-semibold text-white">
                 {Math.min(currentPage * itemsPerPage, totalItems)}
               </span>{" "}
               of <span className="font-semibold text-white">{totalItems}</span> customers
             </span>
             <div className="flex items-center gap-2">
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   setCurrentPage(prev => Math.max(prev - 1, 1));
                 }}
                 disabled={currentPage === 1}
                 className={`px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
                   currentPage === 1
                     ? 'bg-white/5 border-white/5 text-slate-500 cursor-not-allowed'
                     : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 cursor-pointer active:scale-95'
                 }`}
               >
                 Previous
               </button>
               <div className="flex items-center gap-1">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                   <button
                     key={p}
                     onClick={(e) => {
                       e.stopPropagation();
                       setCurrentPage(p);
                     }}
                     className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                       currentPage === p
                         ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] border-t border-white/10'
                         : 'bg-white/5 hover:bg-white/10 text-slate-400'
                     }`}
                   >
                     {p}
                   </button>
                 ))}
               </div>
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   setCurrentPage(prev => Math.min(prev + 1, totalPages));
                 }}
                 disabled={currentPage === totalPages}
                 className={`px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
                   currentPage === totalPages
                     ? 'bg-white/5 border-white/5 text-slate-500 cursor-not-allowed'
                     : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 cursor-pointer active:scale-95'
                 }`}
               >
                 Next
               </button>
             </div>
           </div>

        </div>
      </div>
      
      {/* Toast Alert message rendering */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-white/10 text-slate-100 text-xs px-4.5 py-3 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] z-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-indigo-400 !text-[16px]">info</span>
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}