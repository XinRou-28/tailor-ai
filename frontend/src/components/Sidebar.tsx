interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "customers", label: "Customers", icon: "group" },
    { id: "digest", label: "Digest", icon: "fact_check" },
    { id: "details", label: "Customer Detail", icon: "person_search" },
    { id: "insights", label: "Insights", icon: "analytics" },
  ];

  return (
    <aside className="h-screen w-[220px] flex-shrink-0 bg-surface border-r border-outline-variant flex flex-col p-4 gap-3 sticky top-0" id="dashboard-sidebar">
      {/* Brand logo */}
      <div 
        className="flex items-center gap-2 mb-4 cursor-pointer"
        onClick={() => onTabChange("homepage")}
        title="Go to Home"
      >
        <div>
          <h1 className="text-xl font-bold text-primary tracking-tight">Tailor AI</h1>
          <p className="text-[11px] font-medium text-on-surface-variant">Subscription Intelligence</p>
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
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-left cursor-pointer w-full ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold cursor-default"
                  : "text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900"
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
        className="p-2.5 bg-surface-container-low rounded-lg flex items-center gap-2 cursor-pointer hover:bg-surface-container transition-colors"
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
          <p className="text-xs font-bold text-gray-900 truncate">Mei Chen</p>
          <p className="text-[10px] text-on-surface-variant truncate">Ops Lead</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLogout();
          }}
          className="material-symbols-outlined text-on-surface-variant hover:text-error !text-[18px] p-1 rounded-full hover:bg-surface-container-high transition-colors"
          title="Logout"
        >
          logout
        </button>
      </div>
    </aside>
  );
}
