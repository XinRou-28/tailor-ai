import { useState } from "react";
import { Menu, X } from "lucide-react";
import LandingLogo from "./LandingLogo";

interface NavbarProps {
  setCurrentView: (view: string) => void;
}

export default function Navbar({ setCurrentView }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex justify-between items-center h-16 px-lg max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-sm">
          <LandingLogo />
          <span className="text-title-lg font-headline-md font-bold text-on-surface" id="navbar-logo-text">
            Tailor AI
          </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-xl">
          <a href="#" className="text-primary font-semibold border-b-2 border-secondary font-body-md text-body-md py-1" id="nav-platform">
            Platform
          </a>
          <a href="#features" className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md py-1" id="nav-features">
            Features
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-md">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="bg-primary text-on-primary px-md py-sm rounded-lg hover:opacity-90 transition-all font-body-md text-body-md font-semibold cursor-pointer"
            id="nav-get-started-btn"
          >
            Get Started
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface hover:text-secondary p-1"
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant px-lg py-md flex flex-col gap-md" id="mobile-dropdown">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="text-primary font-semibold font-body-md text-body-md py-1"
          >
            Platform
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md py-1"
          >
            Features
          </a>
          <div className="flex flex-col gap-sm pt-sm border-t border-outline-variant/30">
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView("dashboard"); }}
              className="bg-primary text-on-primary px-md py-sm rounded-lg hover:opacity-90 transition-all font-body-md text-body-md font-semibold text-center"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
