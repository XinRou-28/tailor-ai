export default function Footer() {
  return (
    <footer className="w-full py-xl bg-primary dark:bg-primary-container border-t border-white/5" id="app-footer">
      <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-7xl mx-auto gap-md">
        <div className="flex flex-col items-center md:items-start gap-sm">
          <span className="text-headline-md font-headline-md text-on-primary" id="footer-brand-title">
            Tailor AI
          </span>
          <p className="text-on-primary-container opacity-80 font-label-md text-label-md" id="footer-copyright">
            © 2024 Tailor AI. Empowering subscription mastery.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-xl" id="footer-links-container">
          <a href="#" className="text-on-primary-container opacity-80 hover:text-secondary-fixed transition-colors font-label-md text-label-md">
            Privacy Policy
          </a>
          <a href="#" className="text-on-primary-container opacity-80 hover:text-secondary-fixed transition-colors font-label-md text-label-md">
            Terms of Service
          </a>
          <a href="#" className="text-on-primary-container opacity-80 hover:text-secondary-fixed transition-colors font-label-md text-label-md">
            Security
          </a>
          <a href="#" className="text-on-primary-container opacity-80 hover:text-secondary-fixed transition-colors font-label-md text-label-md">
            Contact
          </a>
        </div>

        <div className="flex gap-md" id="footer-socials-container">
          <a href="#" className="text-on-primary-container hover:text-secondary-fixed transition-colors" aria-label="Share">
            <span className="material-symbols-outlined">share</span>
          </a>
          <a href="#" className="text-on-primary-container hover:text-secondary-fixed transition-colors" aria-label="Website">
            <span className="material-symbols-outlined">public</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
