/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import Modal from "./components/Modal";

// Internal layout imports
import Sidebar from "./components/Sidebar";
import DashboardTopBar from "./components/DashboardTopBar";

// Internal pages imports
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import DailyDigest from "./pages/DailyDigest";
import CustomerDetails from "./pages/CustomerDetails";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";

type ActiveView = "homepage" | "dashboard" | "customers" | "digest" | "details" | "insights" | "settings";

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>("homepage");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "get_started" | "demo">("login");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Helper to render active view when inside Dashboard Workspace
  const renderDashboardContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard searchQuery={searchQuery} />;
      case "customers":
        return <Customers searchQuery={searchQuery} onNavigate={setCurrentView} />;
      case "digest":
        return <DailyDigest />;
      case "details":
        return <CustomerDetails />;
      case "insights":
        return <Insights />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard searchQuery={searchQuery} />;
    }
  };

  // If we are in homepage, render static marketing site
  if (currentView === "homepage") {
    return (
      <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col justify-between" id="app-root-wrapper">
        {/* Navbar Container */}
        <Navbar 
          onLoginClick={() => handleOpenModal("login")} 
          onGetStartedClick={() => handleOpenModal("get_started")} 
        />

        {/* Main Content Area */}
        <main className="flex-grow" id="app-main-content">
          <Homepage 
            onGetStartedClick={() => setCurrentView("dashboard")}
            onWatchDemoClick={() => handleOpenModal("demo")}
          />
        </main>

        {/* Footer Container */}
        <Footer />

        {/* Popups & Dialogs Portal */}
        <Modal 
          isOpen={modalOpen} 
          onClose={handleCloseModal} 
          type={modalType} 
          onSubmitSuccess={handleModalSubmit}
        />
      </div>
    );
  }

  // Otherwise, render full screen Dashboard layout with sidebar navigation
  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-md" id="app-workspace-wrapper">
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
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative" id="workspace-main-canvas">
        {/* Dashboard Top Navigation Bar */}
        <DashboardTopBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userEmail="peishing1103@gmail.com"
          onProfileClick={() => setCurrentView("settings")}
        />

        {/* Dynamic page contents */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 bg-gray-50">
          {renderDashboardContent()}
        </div>
      </main>

      {/* Secondary confirmation trigger for simulator inside Modal context */}
      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        type={modalType} 
        onSubmitSuccess={handleModalSubmit}
      />
    </div>
  );
}
