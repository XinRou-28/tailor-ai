import { useState } from "react";
import { Menu, X } from "lucide-react";
import LandingLogo from "./LandingLogo";

interface NavbarProps {
  setCurrentView: (view: string) => void;
}

export default function Navbar({ setCurrentView }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full top-0 sticky z-50 bg-[#1A1B30]/80 backdrop-blur-md border-b border-white/10" id="app-header">
      <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-sm justify-start">
          <LandingLogo />
          <span className="text-title-lg font-headline-md font-bold text-white tracking-tight" id="navbar-logo-text">
            Tailor AI
          </span>
        </div>
        
        {/* Desktop Nav - Centered */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          <a href="#" className="text-white font-semibold border-b-2 border-[#8B4CFF] font-body-md text-sm py-1 transition-colors hover:text-slate-200" id="nav-platform">
            Platform
          </a>
          <a href="#features" className="text-slate-300 hover:text-[#8B4CFF] transition-colors font-body-md text-sm py-1" id="nav-features">
            Features
          </a>
        </nav>

        {/* Action Buttons - Right Aligned */}
        <div className="flex items-center gap-md justify-end">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="bg-gradient-to-r from-[#8B4CFF] to-[#7033FF] hover:from-[#9c66ff] hover:to-[#8247ff] text-white px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(139,76,255,0.5)] transition-all font-body-md text-sm font-semibold cursor-pointer border border-[#a475ff]/20"
            id="nav-get-started-btn"
          >
            Get Started
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-[#8B4CFF] p-1"
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1B30] border-b border-white/10 px-6 py-4 flex flex-col gap-4" id="mobile-dropdown">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white font-semibold font-body-md text-sm py-1"
          >
            Platform
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-[#8B4CFF] transition-colors font-body-md text-sm py-1"
          >
            Features
          </a>
          <div className="flex flex-col gap-sm pt-4 border-t border-white/10">
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView("dashboard"); }}
              className="bg-gradient-to-r from-[#8B4CFF] to-[#7033FF] text-white px-5 py-2.5 rounded-full font-body-md text-sm font-semibold text-center hover:brightness-110 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
