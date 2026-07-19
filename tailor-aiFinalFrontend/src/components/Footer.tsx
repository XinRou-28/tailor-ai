import LandingLogo from "./LandingLogo";

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-slate-900 border-t border-white/10" id="app-footer">
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 max-w-7xl mx-auto gap-4">
        {/* Left Side: Circular T Logo and Text */}
        <div className="flex items-center gap-2" id="footer-logo-wrapper">
          <LandingLogo />
          <span className="text-xl font-bold text-white tracking-tight" id="footer-brand-title">
            Tailor AI
          </span>
        </div>
        
        {/* Right Side: Copyright text */}
        <p className="text-slate-400 text-sm font-medium" id="footer-copyright">
          © 2024 Tailor AI. Optimizing Subscription Intelligence.
        </p>
      </div>
    </footer>
  );
}