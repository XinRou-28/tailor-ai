/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { apiGet } from "./api/client";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";

// Internal layout imports
import Sidebar from "./components/Sidebar";
import DashboardTopBar from "./components/DashboardTopBar";

// Internal pages imports
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";

type ActiveView = "homepage" | "dashboard" | "customers" | "details" | "insights" | "settings";

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>("homepage");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "get_started" | "demo">("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [accountsCache, setAccountsCache] = useState<any[] | null>(null);
  const [digestCache, setDigestCache] = useState<any[] | null>(null);
  const [insightsCache, setInsightsCache] = useState<{ total_accounts: number; top_reasons: any[] } | null>(null);

  const handleOpenModal = (type: "login" | "get_started" | "demo") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Callback when user signs in or creates an account from modal
  const handleModalSubmit = () => {
    setModalOpen(false);
    setCurrentView("dashboard");
  };

  useEffect(() => {
  if (currentView === "homepage") return;
  if (!accountsCache) {
    apiGet("/accounts", { accounts: [], total: 0 }).then((res) => {
      const mapped = res.accounts.map((a: any) => ({
        id: a.customer_id,
        name: a.company_name,
        domain: "",
        initial: a.company_name[0],
        plan: a.current_plan,
        health: a.health_score,
        risk: a.risk_level === "High" ? "High Risk" : a.risk_level,
        automation: a.tier === "auto_send" ? "Full Auto" : a.tier === "csm_review" ? "Review Req." : "Manual",
        lastActivityTime: "",
        lastActivityDesc: "",
        revenue: a.monthly_revenue,
      }));
      setAccountsCache(mapped);
    });
  }
  if (!digestCache) {
    apiGet("/digest", { date: "", count: 0, items: [] }).then((res) => setDigestCache(res.items));
  }
  if (!insightsCache) {
    apiGet("/insights", { total_accounts: 0, top_reasons: [] }).then(setInsightsCache);
  }
}, [currentView, accountsCache, digestCache, insightsCache]);
  // Helper to render active view when inside Dashboard Workspace
  const renderDashboardContent = () => {
    switch (currentView) {
      case "dashboard":
  return <Dashboard searchQuery={searchQuery} cachedCustomers={accountsCache} cachedDigest={digestCache} cachedInsights={insightsCache} onTabChange={(tab) => {
    setSearchQuery("");
    setCurrentView(tab as ActiveView);
  }} />;
      case "customers":
        return <Customers
          searchQuery={searchQuery}
          onNavigate={(view, id) => {
            if (id) setSelectedCustomerId(id);
            setCurrentView(view as ActiveView);
          }}
          cachedCustomers={accountsCache}
        />;
      case "details":
        return <CustomerDetails customerId={selectedCustomerId} />;
      case "insights":
        return <Insights cachedInsights={insightsCache} />;
      case "settings":
        return <Settings />;
      default:
      return <Dashboard searchQuery={searchQuery} cachedCustomers={accountsCache} cachedDigest={digestCache} cachedInsights={insightsCache} />;    }
      };

  // If we are in homepage, render static marketing site
  if (currentView === "homepage") {
    return (
      <div className="min-h-screen bg-[#1A1B30] font-body-md text-slate-100 flex flex-col justify-between" id="app-root-wrapper">
        {/* Navbar Container */}
        <Navbar
          setCurrentView={(view) => setCurrentView(view as ActiveView)}
        />

        {/* Main Content Area */}
        <main className="flex-grow" id="app-main-content">
          <Homepage
            onWatchDemoClick={() => handleOpenModal("demo")}
            setCurrentView={(view) => setCurrentView(view as ActiveView)}
          />
        </main>

        {/* Footer Container */}
        <Footer />

        </div>
    );
  }

  // Otherwise, render full screen Dashboard layout with sidebar navigation
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0B1026] to-[#1a264a] font-body-md text-white" id="app-workspace-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={currentView} 
        onTabChange={(tab) => {
          setSearchQuery(""); // clear search on page switch
          setCurrentView(tab as ActiveView);
        }}
        onLogout={() => setCurrentView("homepage")}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-transparent relative" id="workspace-main-canvas">
        {/* Dashboard Top Navigation Bar */}
        <DashboardTopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userEmail="peishing1103@gmail.com"
          onProfileClick={() => setCurrentView("settings")}
        />

        {/* Dynamic page contents */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 bg-transparent">
          {renderDashboardContent()}
        </div>
      </main>

    </div>
  );
}
