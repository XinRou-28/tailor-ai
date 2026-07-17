export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-outline-variant">
        <div className="flex items-center gap-sm mb-lg">
          <img
            src="/src/assets/logo.png"
            alt="Tailor AI Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-title-lg font-headline-md font-bold text-on-surface">Tailor AI</span>
        </div>
        <h3 className="text-headline-md font-headline-md text-primary mb-xs">Welcome back</h3>
        <p className="text-body-md text-on-surface-variant mb-lg">Sign in to manage your subscription intelligence dashboard.</p>
        <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }} className="space-y-lg mt-lg">
          <div className="space-y-xs">
            <label className="block text-label-md text-on-surface-variant font-semibold">Username</label>
            <input type="text" defaultValue="mei@projectflow.com" className="w-full px-md py-md bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary" />
          </div>
          <div className="space-y-xs">
            <label className="block text-label-md text-on-surface-variant font-semibold">Password</label>
            <input type="password" defaultValue="demo1234" className="w-full px-md py-md bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary" />
          </div>
          <button type="submit" className="w-full bg-primary text-on-primary font-bold py-lg rounded-xl hover:opacity-95 transition-opacity mt-xl cursor-pointer text-body-lg shadow-md">Sign In</button>
        </form>
      </div>
    </div>
  );
}
