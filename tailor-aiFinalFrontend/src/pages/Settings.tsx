import { useState } from "react";

export default function Settings() {
  const [autoOptim, setAutoOptim] = useState(true);
  const [threshold, setThreshold] = useState(85);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full" id="settings-view-container">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Settings</h1>
        <p className="text-slate-400 text-sm max-w-3xl">Configure your subscription intelligence algorithms, confidence bounds, and notifications.</p>
      </div>

      <div className="max-w-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-xl p-6 space-y-6">
        {/* Threshold setting */}
        <div>
          <h3 className="text-base font-bold text-white mb-1">Intervention Limits</h3>
          <p className="text-xs text-slate-400 mb-4">Set the minimum confidence score required to auto-apply solutions without review.</p>
          
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="50" 
              max="99" 
              value={threshold} 
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer" 
            />
            <span className="font-bold text-indigo-400 font-mono text-lg">{threshold}%</span>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Toggle option */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Automate High-Confidence Nudges</h3>
            <p className="text-xs text-slate-400">When score exceeds limit, immediately execute matching onboarding actions.</p>
          </div>
          <button 
            onClick={() => setAutoOptim(!autoOptim)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${autoOptim ? "bg-indigo-600" : "bg-white/10"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${autoOptim ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <hr className="border-white/10" />

        {/* Save feedback button and notification */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Save Configuration
          </button>
          {isSaved && (
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined !text-[16px]">check_circle</span>
              Configuration saved successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
