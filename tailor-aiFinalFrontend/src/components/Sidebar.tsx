interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "customers", label: "Customers", icon: "group" },
    { id: "details", label: "Customer Detail", icon: "person_search" },
    { id: "insights", label: "Insights", icon: "analytics" },
  ];

  return (
    <aside className="h-screen w-[220px] flex-shrink-0 bg-[#0B1026]/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-4 gap-3 sticky top-0" id="dashboard-sidebar">
      {/* Brand logo */}
      <div 
        className="flex items-center gap-2 mb-4 cursor-pointer"
        onClick={() => onTabChange("homepage")}
        title="Go to Home"
      >
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Tailor AI</h1>
          <p className="text-[11px] font-medium text-slate-400">Subscription Intelligence</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all text-left cursor-pointer w-full ${
                isActive
                  ? "bg-white/10 text-white border border-white/10 font-semibold cursor-default"
                  : "text-slate-400 font-medium hover:bg-white/5 hover:text-white"
              }`}
            >
              <span 
                className="material-symbols-outlined !text-[18px]" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User profile section at the bottom */}
      <div 
        className="p-2.5 bg-white/5 border border-white/5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all"
        onClick={() => onTabChange("settings")}
        title="Settings"
      >
        <img 
          className="w-8 h-8 rounded-full object-cover" 
          referrerPolicy="no-referrer"
          alt="Mei Chen profile headshot"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOPGmkvCpZxvaU6YNaBTw_FZ3NKBHj-HBbcDTVeNt1qa2TEYU-lB7Tq2Mo3b-zMz5K8mEH2wFPXanR8ApOtAwFdbimOP-AOZ1mSERw8UcM2UGJjDPgAWK5GWuLf4Uu0p279lXRKSmBwWbns3De9s4ipfualu2I8a-cZe36tLVt4aA2dZn2yCVwQZZl4jHNLtmK_vx9Th9cl4YwsrVV21hYeRfhZN2YkLdkoGVjbM-eRLUVwYNGdYVlpYhWKXP1PQS5rZKp6CoUUlBc"
        />
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-bold text-white truncate">Mei Chen</p>
          <p className="text-[10px] text-slate-400 truncate">Ops Lead</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLogout();
          }}
          className="material-symbols-outlined text-slate-400 hover:text-red-400 !text-[18px] p-1 rounded-full hover:bg-white/10 transition-colors"
          title="Logout"
        >
          logout
        </button>
      </div>
    </aside>
  );
}
