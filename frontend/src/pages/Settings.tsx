import { useState } from "react";

export default function Settings() {
  const [autoOptim, setAutoOptim] = useState(true);
  const [threshold, setThreshold] = useState(85);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full" id="settings-view-container">
      <div className="mb-xl">
        <h1 className="font-display-lg text-display-lg text-primary mb-sm">Settings</h1>
        <p className="text-on-surface-variant font-body-lg max-w-3xl">Configure your subscription intelligence algorithms, confidence bounds, and notifications.</p>
      </div>

      <div className="max-w-3xl bg-white border border-[#e5e7eb] rounded-xl p-xl shadow-sm space-y-lg">
        {/* Threshold setting */}
        <div>
          <h3 className="font-title-lg text-title-lg text-primary mb-xs">Intervention Limits</h3>
          <p className="text-body-md text-on-surface-variant mb-md">Set the minimum confidence score required to auto-apply solutions without review.</p>
          
          <div className="flex items-center gap-md">
            <input 
              type="range" 
              min="50" 
              max="99" 
              value={threshold} 
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#4253d8]" 
            />
            <span className="font-bold text-[#4253d8] font-mono-md text-lg">{threshold}%</span>
          </div>
        </div>

        <hr className="border-[#e5e7eb]" />

        {/* Toggle option */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary mb-xs">Automate High-Confidence Nudges</h3>
            <p className="text-body-md text-on-surface-variant">When score exceeds limit, immediately execute matching onboarding actions.</p>
          </div>
          <button 
            onClick={() => setAutoOptim(!autoOptim)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${autoOptim ? "bg-secondary" : "bg-outline-variant"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${autoOptim ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <hr className="border-[#e5e7eb]" />

        {/* Save feedback button */}
        <button 
          onClick={() => alert("Settings successfully saved!")}
          className="bg-primary text-white px-lg py-sm rounded-lg font-body-md font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
