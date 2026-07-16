import { useState } from "react";
import { motion } from "motion/react";

interface HomepageProps {
  onGetStartedClick: () => void;
  onWatchDemoClick: () => void;
}

type TriggerType = "usage_drop" | "feature_fatigue" | "billing_issue" | "new_admin";

export default function Homepage({ onGetStartedClick, onWatchDemoClick }: HomepageProps) {
  // Value Recovery Sandbox State
  const [activeTrigger, setActiveTrigger] = useState<TriggerType>("usage_drop");
  
  // Trust Layer Confidence State
  const [confidenceLevel, setConfidenceLevel] = useState<"high" | "low">("high");

  // Trigger configurations for interactive Value Recovery preview
  const triggerConfigs = {
    usage_drop: {
      analyze: "Analyze: Usage Drop (50% WoW)",
      predict: "Predict: Core Friction Point",
      action: "Action: Trigger Inline Help",
      icon: "rocket_launch",
      confidence: "98%",
      badge: "Auto",
      badgeBg: "bg-[#e2f5e9] text-[#1e4620]",
      description: "Classify why value is dropping and recommend the matching fix. We analyze over 50 behavioral signals to identify the exact friction points."
    },
    feature_fatigue: {
      analyze: "Analyze: Feature Fatigue Detected",
      predict: "Predict: User Overwhelm Risk",
      action: "Action: Custom Workspace Trim",
      icon: "tune",
      confidence: "94%",
      badge: "Auto",
      badgeBg: "bg-[#e2f5e9] text-[#1e4620]",
      description: "Understand which features are causing noise. Guide users back to core value streams by temporarily hiding unused premium complexity."
    },
    billing_issue: {
      analyze: "Analyze: Card Expiry Near",
      predict: "Predict: Involuntary Churn",
      action: "Action: Grace Period & Smart Banner",
      icon: "credit_card",
      confidence: "99%",
      badge: "Instant",
      badgeBg: "bg-[#e2f5e9] text-[#1e4620]",
      description: "Analyze passive subscription risk. Automatically deploy customized, non-intrusive renewal nudges and configure elegant payment grace windows."
    },
    new_admin: {
      analyze: "Analyze: New Workspace Admin",
      predict: "Predict: Adoption Expansion Opportunity",
      action: "Action: Trigger 1:1 Guided Setup",
      icon: "group",
      confidence: "87%",
      badge: "Review",
      badgeBg: "bg-[#fef3c7] text-[#92400e]",
      description: "Identify key changes in account ownership or team leadership. Proactively launch high-touch guided experiences for newly-appointed decision makers."
    }
  };

  return (
    <div id="homepage-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-xxl pb-spine-gap">
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-indigo-600/15 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            className="flex-1 flex flex-col items-start gap-6 relative z-10 max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-full text-label-md text-on-primary-fixed-variant border border-outline-variant">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              AI-DRIVEN OPTIMIZATION
            </div>
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
              Subscription Intelligence <br />that fits your business.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Tailor AI helps you understand why customers lose value and recommends the perfect intervention — not just a generic downgrade or cancellation path.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button 
                onClick={onGetStartedClick}
                className="bg-secondary text-white px-6 py-3 rounded-lg text-sm font-semibold hover:translate-y-[-2px] transition-all shadow-lg shadow-secondary/20 cursor-pointer"
                id="hero-get-started"
              >
                Get Started
              </button>
              <button 
                onClick={() => alert("Watch Demo video coming soon!")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Social Proof Trust Indicators */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100 w-full">
              <div className="flex -space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                    alt="User 1" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                    alt="User 2" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
                    alt="User 3" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" 
                    alt="User 4" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <span className="text-sm text-gray-500 font-medium">Trusted by 50+ Ops Teams</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full relative h-[500px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Card 1 (Back, Dark Theme) */}
            <div className="absolute top-10 right-0 w-[400px] h-[300px] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl rotate-3 p-6 flex flex-col gap-4">
              {/* Fake Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-24 h-2.5 bg-slate-700 rounded"></div>
                  <div className="w-16 h-2 bg-slate-800 rounded"></div>
                </div>
                <div className="ml-auto flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500/60"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500/60"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500/60"></span>
                </div>
              </div>
              
              {/* AI Recommendation content */}
              <div className="flex-1 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Tailor AI Recommendation</span>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  "Acme Global's value metric has dropped by 42%. We recommend offering the <span className="text-indigo-300 font-semibold">Scale Tier</span> option with automatic seat reclamation."
                </p>
                
                <div className="mt-auto flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[11px] text-slate-400 font-medium">Recommended Interventions</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">Auto-Apply Active</span>
                </div>
              </div>

              {/* Purple Glowing Button */}
              <div className="mt-2">
                <div className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-xs font-bold text-center shadow-lg shadow-indigo-600/30 border border-indigo-500">
                  Execute Optimization Playbook
                </div>
              </div>
            </div>

            {/* Card 2 (Front, White Theme) */}
            <div className="absolute bottom-10 left-10 w-[380px] h-[260px] bg-white rounded-2xl border border-gray-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] -rotate-2 p-6 flex flex-col backdrop-blur-sm bg-white/90 justify-between">
              {/* Top Row: Info & Badges */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Account</span>
                  <h4 className="text-base font-extrabold text-gray-900 leading-tight">Acme Global</h4>
                  
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold">Enterprise</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-semibold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"></span> High Risk
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1.5">
                  <span className="material-symbols-outlined text-gray-400 text-lg">more_horiz</span>
                </div>
              </div>

              {/* Bottom Section with Circular Health Score & Fake Chart Lines */}
              <div className="flex items-center gap-4 mt-4">
                {/* Circular Health Score */}
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 flex-shrink-0">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="currentColor" 
                      strokeWidth="6" 
                      fill="transparent" 
                      className="text-gray-100"
                    />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="currentColor" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="175" 
                      strokeDashoffset="110" 
                      className="text-red-500" 
                    />
                  </svg>
                  <span className="relative z-10 text-lg font-bold text-gray-900">35</span>
                </div>

                {/* Fake Chart Lines or Status Rows */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px] font-medium text-gray-500">
                    <span>Seat Engagement</span>
                    <span className="text-red-600 font-bold">12%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: "12%" }}></div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-medium text-gray-500 mt-1">
                    <span>License Utilization</span>
                    <span className="text-amber-600 font-bold">45%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-surface-container-low py-xl" id="social-proof-section">
        <div className="max-w-7xl mx-auto px-lg">
          <p className="text-center text-label-md text-on-primary-container font-semibold uppercase tracking-widest mb-lg">
            Trusted by ProjectFlow and leading B2B SaaS companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-spine-gap opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-xs font-headline-md text-primary">
              <span className="material-symbols-outlined text-primary">lan</span> ProjectFlow
            </div>
            <div className="flex items-center gap-xs font-headline-md text-primary">
              <span className="material-symbols-outlined text-primary">auto_graph</span> CloudScale
            </div>
            <div className="flex items-center gap-xs font-headline-md text-primary">
              <span className="material-symbols-outlined text-primary">stream</span> DataNexus
            </div>
            <div className="flex items-center gap-xs font-headline-md text-primary">
              <span className="material-symbols-outlined text-primary">hub</span> Velocity
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / Bento Grid */}
      <section className="py-xxl max-w-7xl mx-auto px-lg" id="features">
        <div className="text-center mb-xxl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Beyond Churn Prediction</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Traditional churn metrics only tell you what's already happened. Tailor AI looks at the "Value Gap" to intervene before it's too late.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-lg">
          {/* Card 1: Value Recovery (Stateful / Interactive Demo) */}
          <motion.div 
            className="md:col-span-8 glass-card rounded-xl p-xl flex flex-col md:flex-row gap-xl items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="value-recovery-card"
          >
            <div className="md:w-1/2">
              <div className="bg-success-container/10 p-md rounded-full w-fit mb-md">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>healing</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">Value Recovery</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed min-h-[80px]">
                {triggerConfigs[activeTrigger].description}
              </p>
              
              {/* Interactive Sandbox Selector */}
              <div className="mt-md">
                <p className="text-[11px] font-bold text-on-primary-container tracking-wider uppercase mb-sm">Interactive Sandbox Trigger:</p>
                <div className="flex flex-wrap gap-xs">
                  {(["usage_drop", "feature_fatigue", "billing_issue", "new_admin"] as TriggerType[]).map((trig) => (
                    <button
                      key={trig}
                      onClick={() => setActiveTrigger(trig)}
                      className={`text-[12px] px-sm py-xs rounded-lg font-semibold transition-all cursor-pointer ${
                        activeTrigger === trig
                          ? "bg-secondary text-white shadow-sm"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {trig.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-xl flex items-center gap-md">
                <span className={`${triggerConfigs[activeTrigger].badgeBg} text-label-md px-sm py-xs rounded uppercase font-bold`}>
                  {triggerConfigs[activeTrigger].badge}
                </span>
                <span className="text-secondary font-semibold font-body-md">
                  Confidence: {triggerConfigs[activeTrigger].confidence}
                </span>
              </div>
            </div>
            
            <div className="md:w-1/2 w-full h-full min-h-[200px] bg-surface-container rounded-lg border border-outline-variant p-md flex flex-col gap-sm justify-center">
              <div className="h-10 bg-white rounded shadow-sm border-l-4 border-secondary flex items-center px-md justify-between transition-all duration-300">
                <span className="text-label-md font-medium text-on-surface">{triggerConfigs[activeTrigger].analyze}</span>
                <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
              </div>
              <div className="h-10 bg-white rounded shadow-sm border-l-4 border-secondary flex items-center px-md justify-between opacity-80 transition-all duration-300">
                <span className="text-label-md font-medium text-on-surface-variant">{triggerConfigs[activeTrigger].predict}</span>
                <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
              </div>
              <motion.div 
                key={activeTrigger}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-10 bg-secondary text-on-primary rounded shadow-md flex items-center px-md justify-between"
              >
                <span className="text-label-md font-bold">{triggerConfigs[activeTrigger].action}</span>
                <span className="material-symbols-outlined text-sm">{triggerConfigs[activeTrigger].icon}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Card 2: Investigation Agent */}
          <motion.div 
            className="md:col-span-4 glass-card rounded-xl p-xl flex flex-col justify-between"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            id="investigation-agent-card"
          >
            <div>
              <div className="bg-surface-container p-md rounded-full w-fit mb-md">
                <span className="material-symbols-outlined text-primary text-3xl">search_check</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">Investigation Agent</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                A narrow, honest agent that disambiguates complex cases. It asks questions when data is messy, bypassing the classic hallucination issues common in other systems.
              </p>
            </div>
            <div className="mt-xl pt-lg border-t border-outline-variant">
              <div className="flex items-center gap-sm text-label-md text-on-primary-container">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                No Hallucination Architecture
              </div>
            </div>
          </motion.div>

          {/* Card 3: Trust-Based Decision Layer */}
          <motion.div 
            className="md:col-span-12 glass-card rounded-xl p-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="trust-decision-card"
          >
            <div className="grid md:grid-cols-2 gap-xl items-center">
              <div>
                <div className="bg-surface-container p-md rounded-full w-fit mb-md">
                  <span className="material-symbols-outlined text-primary text-3xl">policy</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-sm">Trust-Based Decision Layer</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-lg">
                  Confidence-tiered automation that knows when to act and when to ask. Define your guardrails and let Tailor AI handle the rest.
                </p>
                
                {/* Confidence Level Selector */}
                <div className="mb-lg">
                  <p className="text-[11px] font-bold text-on-primary-container tracking-wider uppercase mb-sm">Confidence Nudge Demo:</p>
                  <div className="flex gap-sm">
                    <button
                      onClick={() => setConfidenceLevel("high")}
                      className={`flex-1 p-md rounded-lg border text-left transition-all cursor-pointer ${
                        confidenceLevel === "high"
                          ? "bg-secondary/10 border-secondary ring-2 ring-secondary/20"
                          : "bg-surface border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="text-[#1e4620] font-bold text-label-md mb-xs">HIGH CONFIDENCE</div>
                      <div className="text-body-md text-on-surface-variant">Auto-Applied intervention</div>
                    </button>
                    <button
                      onClick={() => setConfidenceLevel("low")}
                      className={`flex-1 p-md rounded-lg border text-left transition-all cursor-pointer ${
                        confidenceLevel === "low"
                          ? "bg-secondary/10 border-secondary ring-2 ring-secondary/20"
                          : "bg-surface border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="text-[#854d0e] font-bold text-label-md mb-xs">LOW CONFIDENCE</div>
                      <div className="text-body-md text-on-surface-variant">Escalated to human review</div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-primary-container p-xl rounded-xl text-on-primary-container h-full min-h-[300px] flex flex-col justify-center overflow-hidden">
                {/* Decision Spine Visualization */}
                <div className="decision-spine space-y-md">
                  <div className="relative flex items-center gap-md z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors ${confidenceLevel === "high" ? "bg-secondary" : "bg-orange-500"}`}>
                      {confidenceLevel === "high" ? "95" : "62"}
                    </div>
                    <div className="bg-white/10 p-md rounded flex-1 backdrop-blur-sm border border-white/10">
                      <p className="text-label-md font-bold text-white uppercase">Subscription Score</p>
                      <p className="text-body-md opacity-80">
                        {confidenceLevel === "high" ? "Severe usage drop detected" : "Slight decrease in active workspace seats"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center gap-md z-10 pl-10">
                    <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
                    </div>
                    <div className="p-sm bg-white/5 rounded-lg text-body-md italic border border-white/5 text-white/90">
                      {confidenceLevel === "high" 
                        ? '"Reason: Clear pattern match with feature fatigue. Recommended trigger sequence is 98% confident."'
                        : '"Reason: Behavior pattern is ambiguous. Could represent normal summer slowdown or risk of admin churn."'
                      }
                    </div>
                  </div>
                  
                  <div className="relative flex items-center gap-md z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${confidenceLevel === "high" ? "bg-on-tertiary-container" : "bg-amber-600"}`}>
                      <span className="material-symbols-outlined">
                        {confidenceLevel === "high" ? "recommend" : "person_search"}
                      </span>
                    </div>
                    <div className={`p-md rounded flex-1 border ${confidenceLevel === "high" ? "bg-secondary/20 border-secondary/30" : "bg-amber-900/40 border-amber-500/30"}`}>
                      <p className={`text-label-md font-bold uppercase ${confidenceLevel === "high" ? "text-secondary-fixed" : "text-amber-200"}`}>
                        {confidenceLevel === "high" ? "Recommendation (Auto-Action)" : "Recommendation (Human Review)"}
                      </p>
                      <p className="text-body-md font-semibold text-white">
                        {confidenceLevel === "high" 
                          ? "Trigger 1:1 Guided Onboarding with App Nudges"
                          : "Flag for Client Success Outreach & Schedule Review Call"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xxl bg-primary relative overflow-hidden" id="pricing">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-on-tertiary-container blur-[150px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto px-lg text-center relative z-10">
          <h2 className="font-display-lg text-headline-lg text-white mb-lg">Ready to master your subscription value?</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-xl">
            Join dozens of B2B leaders who turned subscription anxiety into operational mastery.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <button 
              onClick={onGetStartedClick}
              className="bg-on-secondary-container text-primary font-bold px-xxl py-md rounded-xl hover:scale-105 transition-transform cursor-pointer"
            >
              Get Started Free
            </button>
            <button 
              onClick={onGetStartedClick}
              className="bg-white/10 text-white font-bold px-xxl py-md rounded-xl hover:bg-white/20 transition-colors border border-white/20 cursor-pointer"
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
