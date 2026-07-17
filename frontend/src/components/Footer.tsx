export default function Footer() {
  return (
    <footer className="w-full py-xl bg-primary dark:bg-primary-container border-t border-white/5" id="app-footer">
      <div className="flex flex-col items-center px-lg max-w-7xl mx-auto gap-md">
        <div className="flex flex-col items-center gap-sm">
          <span className="text-headline-md font-headline-md text-on-primary" id="footer-brand-title">
            Tailor AI
          </span>
          <p className="text-on-primary-container opacity-80 font-label-md text-label-md" id="footer-copyright">
            © 2026 Tailor AI. Empowering Subscription Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}