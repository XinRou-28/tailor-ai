import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { 
  Check, 
  TrendingDown, 
  Brain, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Activity,
  ShieldCheck,
  Download,
  Terminal,
  Layers,
  ArrowUpRight
} from "lucide-react";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function CountUp({ end, duration = 1.2, suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Silk-smooth easeOutQuad easing
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentVal = Math.floor(easeOutQuad(progress) * (end - startValue) + startValue);
      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    const animId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animId);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

interface InteractiveGlowCardProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  id?: string;
}

function InteractiveGlowCard({ children, className = "", glowColor = "rgba(139, 76, 255, 0.12)", id, ...props }: InteractiveGlowCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden rounded-xl border border-white/5 bg-[#15172c]/50 backdrop-blur-xl shadow-lg transition-colors duration-300 hover:border-white/10 ${className}`}
      {...props}
    >
      {/* Dynamic spot light glow */}
      {isHovered && (
        <>
          <div
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
            style={{
              background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`
            }}
          />
          {/* Glass reflection sheen */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
            style={{
              background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`
            }}
          />
        </>
      )}
      {children}
    </motion.div>
  );
}

interface HomepageProps {
  onWatchDemoClick?: () => void;
  setCurrentView: (view: string) => void;
}

export default function Homepage({ setCurrentView }: HomepageProps) {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left - rect.width / 2) / 60;
    const y = (clientY - rect.top - rect.height / 2) / 60;
    setParallaxOffset({ x, y });
  };

  return (
    <div id="homepage-container" className="bg-[#111224] text-slate-100 overflow-hidden relative min-h-screen font-sans antialiased">
      
      {/* Hero Section */}
      <section 
        onMouseMove={handleHeroMouseMove}
        className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-white/5"
      >
        {/* Subtle high-tech grid background with mouse parallax */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] transition-transform duration-300 ease-out pointer-events-none"
          style={{ transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)` }}
        ></div>
        
        {/* Floating glass blobs with parallax and slow hover */}
        <motion.div 
          animate={{ 
            x: [0, 40, -20, 0], 
            y: [0, -30, 20, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-[#8B4CFF]/8 blur-[130px] rounded-full pointer-events-none"
          style={{ x: parallaxOffset.x * -0.5, y: parallaxOffset.y * -0.5 }}
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 30, 0], 
            y: [0, 40, -20, 0],
            scale: [1, 0.95, 1.05, 1]
          }}
          transition={{ 
            duration: 24, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-10 right-1/4 translate-x-1/3 -z-10 w-[450px] h-[450px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none"
          style={{ x: parallaxOffset.x * 0.8, y: parallaxOffset.y * 0.8 }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content & CTA with Scroll reveal, opacity, and blur reduction */}
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[550px] flex flex-col items-start text-left gap-6 justify-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#8B4CFF]/10 border border-[#8B4CFF]/20 px-3 py-1 rounded-full text-[11px] font-semibold text-[#b68cff] tracking-wider uppercase whitespace-normal break-normal">
              <Sparkles className="w-3 h-3 text-[#8B4CFF]" />
              SaaS Intelligence Engine
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-extrabold tracking-tight leading-tight sm:leading-[1.15] text-white whitespace-normal break-normal">
              <span className="block text-white mb-1.5 sm:mb-2">
                Tailor Every Subscription
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B4CFF] via-[#b68cff] to-cyan-400 py-1">
                with Intelligent, Data-Driven Insights
              </span>
              <span className="block text-white mt-1.5 sm:mt-2">
                to Fit Your Business.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-normal break-normal max-w-full">
              Spot mismatched subscriptions before customers churn. Tailor AI identifies changing seat needs and automatically triggers the exact intervention to keep your customers happy and maximize lifetime value, without manual analysis.
            </p>

            <button
              onClick={() => setCurrentView("dashboard")}
              className="group bg-gradient-to-r from-[#8B4CFF] to-[#7033FF] hover:from-[#9c66ff] hover:to-[#8247ff] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,76,255,0.4)] cursor-pointer flex items-center justify-center gap-2 border border-[#a475ff]/20 mt-2 whitespace-normal break-normal"
              id="hero-get-started"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Right Column: Floating Interactive UI Preview with 3D perspective and overlapping */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[500px] mx-auto lg:ml-auto relative flex flex-col lg:block lg:h-[500px] py-4 lg:py-0"
            style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
          >
            {/* Top Card: "Top reasons for value loss" with Interactive Hover Glow and CountUp */}
            <InteractiveGlowCard 
              id="top-value-loss-card"
              className="w-full lg:absolute lg:top-0 lg:left-0 lg:w-[90%] z-20"
              glowColor="rgba(34, 211, 238, 0.1)"
              initial={{ opacity: 0, x: 100, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              style={{ 
                transformStyle: "preserve-3d",
                rotateX: 14,
                rotateY: -18,
                rotateZ: 4,
                z: 40
              } as any}
              whileHover={{ 
                rotateX: 6,
                rotateY: -8,
                rotateZ: 1,
                z: 90,
                scale: 1.03
              }}
              transition={{
                x: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
                opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                filter: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                default: { type: "spring", stiffness: 300, damping: 22 }
              }}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">Top reasons for value loss</span>
                </div>
                <button className="text-[9px] bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-full font-bold hover:bg-white/10 flex items-center gap-1 transition-all">
                  <Download className="w-2.5 h-2.5" />
                  Export
                </button>
              </div>

              {/* Progress Bar Rows with Animated Counts & Spring Expansion */}
              <div className="space-y-2.5">
                {/* List item 1 */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-200 mb-0.5">
                    <span>Advanced Analytics unused</span>
                    <span className="text-cyan-400 font-bold">
                      <CountUp end={42} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "42%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
                    />
                  </div>
                </div>

                {/* List item 2 */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-200 mb-0.5">
                    <span>Poor onboarding completion</span>
                    <span className="text-purple-400 font-bold">
                      <CountUp end={30} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "30%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="h-full bg-[#8B4CFF] rounded-full shadow-[0_0_8px_#8b4cff]"
                    />
                  </div>
                </div>

                {/* List item 3 */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-200 mb-0.5">
                    <span>Missing integrations</span>
                    <span className="text-blue-400 font-bold">
                      <CountUp end={18} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "18%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      className="h-full bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"
                    />
                  </div>
                </div>

                {/* List item 4 */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-200 mb-0.5">
                    <span>Payment friction</span>
                    <span className="text-emerald-400 font-bold">
                      <CountUp end={10} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "10%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                      className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"
                    />
                  </div>
                </div>
              </div>
            </InteractiveGlowCard>

            {/* Bottom Card: "AI Causal Analysis" with Interactive Hover Glow and Timeline nodes */}
            <InteractiveGlowCard 
              id="bottom-causal-card"
              className="w-full -mt-10 lg:mt-0 lg:absolute lg:top-[170px] lg:right-0 lg:w-[90%] z-10"
              glowColor="rgba(139, 76, 255, 0.15)"
              initial={{ opacity: 0, x: 120, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              style={{ 
                transformStyle: "preserve-3d",
                rotateX: 14,
                rotateY: -18,
                rotateZ: 4,
                z: 10
              } as any}
              whileHover={{ 
                rotateX: 6,
                rotateY: -8,
                rotateZ: 1,
                z: 60,
                scale: 1.03,
                zIndex: 30
              }}
              transition={{
                x: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 },
                opacity: { duration: 0.9, ease: "easeOut", delay: 0.35 },
                filter: { duration: 0.9, ease: "easeOut", delay: 0.35 },
                default: { type: "spring", stiffness: 300, damping: 22 }
              }}
            >
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-3.5">
                <Brain className="w-3.5 h-3.5 text-[#8B4CFF] animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-slate-200 uppercase">AI Causal Analysis</span>
                <span className="ml-auto text-[8px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30 font-bold">Active Refiner</span>
              </div>

              {/* Left timeline vertical node line */}
              <div className="relative pl-5 space-y-3">
                <div className="absolute left-[3px] top-1 bottom-1 w-[1px] bg-gradient-to-b from-rose-500 via-[#8B4CFF] to-cyan-500"></div>

                {/* Item 01 */}
                <div className="relative">
                  <span className="absolute -left-[24px] top-1 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] ring-4 ring-[#1a1c36]"></span>
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-bold text-white">Item 01</span>
                    <span className="text-[8px] font-bold text-rose-400 bg-rose-400/10 border border-rose-400/20 px-1 py-0.2 rounded">CRITICAL</span>
                    <span className="text-[10px] font-medium text-slate-300 ml-auto">Advanced Analytics unused</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    User has not interacted with the dashboard in 14 days, despite the enterprise tier upgrade.
                  </p>
                </div>

                {/* Item 02 */}
                <div className="relative">
                  <span className="absolute -left-[24px] top-1 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#8b4cff] ring-4 ring-[#1a1c36]"></span>
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-bold text-white">Item 02</span>
                    <span className="text-[10px] font-medium text-slate-300 ml-auto">Login frequency down</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Monthly login volume decreased by 74% compared to previous cycle.
                  </p>
                </div>
              </div>

              {/* Bottom Box [INVESTIGATION AGENT REFINEMENT] */}
              <div className="mt-3.5 p-3 rounded-lg bg-slate-950/40 border border-cyan-500/10 text-[10px] font-mono leading-relaxed text-slate-300">
                <div className="flex items-center gap-1 text-cyan-400 font-bold uppercase tracking-wider mb-1.5 text-[8px]">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  INVESTIGATION AGENT REFINEMENT
                </div>
                <div>
                  <span className="text-slate-500">Original status:</span> <span className="text-rose-400">"Abandoned"</span>.{" "}
                  <span className="text-slate-500">Refinement:</span> <span className="text-cyan-400">"Never Onboarded"</span>.
                </div>
                <div className="mt-1 text-[10px] text-slate-400 border-t border-white/5 pt-1">
                  Deeper analysis reveals the key decision-maker never completed the initial SSO setup.
                </div>
              </div>
            </InteractiveGlowCard>

          </motion.div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-6 relative" id="features">
        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 relative flex flex-col items-center"
        >
          {/* Faint large background text centered */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 select-none pointer-events-none text-white/[0.01] text-5xl sm:text-7xl lg:text-8xl font-black tracking-widest uppercase">
            Core Capabilities
          </div>

          <h3 className="text-[11px] font-bold tracking-widest text-[#8B4CFF] uppercase mb-2 relative z-10 text-center">
            CORE CAPABILITIES
          </h3>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight relative z-10 text-center">
            Beyond Churn Prediction
          </h2>
        </motion.div>

        {/* Side-by-Side Horizontal 3-Block Grid with perfectly aligned heights */}
        <motion.div 
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          
          {/* Block 1: Value Recovery Engine */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 180, filter: "blur(6px)" },
              show: { 
                opacity: 1, 
                x: 0, 
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                  mass: 1
                }
              }
            }}
            className="flex"
          >
            <InteractiveGlowCard className="w-full flex flex-col justify-between p-6 sm:p-8" glowColor="rgba(139, 76, 255, 0.15)">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#8B4CFF]/10 border border-[#8B4CFF]/20 flex items-center justify-center mb-5">
                    <Activity className="w-5 h-5 text-[#8B4CFF]" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2.5">Value Recovery Engine</h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    Tailor AI doesn't just predict churn; it recovers value. By analyzing customer usage drops against your existing plan catalog, our engine recommends the precise intervention needed—whether that's onboarding support, a capacity upgrade, or safely right-sizing an account.
                  </p>
                </div>
                
                <div>
                  {/* Feature list */}
                  <div className="flex flex-col items-start gap-2.5 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>Advanced Analytics Unused</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>Onboarding Difficulty</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentView("dashboard")}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#8B4CFF] to-[#7033FF] hover:from-[#9c66ff] hover:to-[#8247ff] text-white text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(139,76,255,0.25)] cursor-pointer border border-[#a475ff]/20"
                  >
                    Offer Onboarding Support
                  </button>
                </div>
              </div>
            </InteractiveGlowCard>
          </motion.div>

          {/* Block 2: Safe AI Integration */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 180, filter: "blur(6px)" },
              show: { 
                opacity: 1, 
                x: 0, 
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                  mass: 1
                }
              }
            }}
            className="flex"
          >
            <InteractiveGlowCard className="w-full flex flex-col justify-between p-6 sm:p-8" glowColor="rgba(168, 85, 247, 0.15)">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2.5">Safe AI Integration</h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    Tailor AI constructs automated communication using your real product tiers, guaranteeing a zero-hallucination guardrail. It never invents or claims unsupported prices.
                  </p>
                </div>
                
                <div>
                  {/* Feature list */}
                  <div className="flex flex-col items-start gap-2.5 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="w-4.5 h-4.5 rounded-full bg-[#8B4CFF]/15 flex items-center justify-center border border-[#8B4CFF]/30 text-[#b68cff]">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>Single Product Tiers</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="w-4.5 h-4.5 rounded-full bg-[#8B4CFF]/15 flex items-center justify-center border border-[#8B4CFF]/30 text-[#b68cff]">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>Automated Communication</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentView("dashboard")}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#8B4CFF] to-[#7033FF] hover:from-[#9c66ff] hover:to-[#8247ff] text-white text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(139,76,255,0.25)] cursor-pointer border border-[#a475ff]/20"
                  >
                    No Hallucinations Guarantee
                  </button>
                </div>
              </div>
            </InteractiveGlowCard>
          </motion.div>

          {/* Block 3: Trust-Based Decision Layer */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 180, filter: "blur(6px)" },
              show: { 
                opacity: 1, 
                x: 0, 
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                  mass: 1
                }
              }
            }}
            className="flex"
          >
            <InteractiveGlowCard className="w-full flex flex-col justify-between p-6 sm:p-8" glowColor="rgba(245, 158, 11, 0.15)">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2.5">Trust-Based Decision Layer</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Automation should support operators, not overwhelm them. Tailor AI performs actions automatically only when confidence thresholds are met. When confidence drops below target parameters, a workflow is instantly generated for a human operator to review and approve.
                </p>
                
                {/* Clean card containing stats, gauges, and statuses */}
                <div className="bg-slate-950/50 border border-white/5 rounded-lg p-4 space-y-3.5">
                  
                  {/* Header info with circular index gauge on top right */}
                  <div className="flex justify-between items-start gap-2 border-b border-white/5 pb-2">
                    <div>
                      <span className="text-[8px] font-bold text-emerald-400 tracking-wider uppercase block">STATUS LEVEL</span>
                      <span className="text-[11px] text-white font-bold block mt-0.5">High certainty threshold met</span>
                    </div>
                    
                    {/* Gauge */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
                          <motion.circle 
                            cx="16" 
                            cy="16" 
                            r="13" 
                            stroke="#10b981" 
                            strokeWidth="2" 
                            fill="transparent" 
                            strokeDasharray="81" 
                            initial={{ strokeDashoffset: 81 }}
                            whileInView={{ strokeDashoffset: 6 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            strokeLinecap="round" 
                          />
                        </svg>
                        <span className="absolute text-[9px] font-black text-white">
                          <CountUp end={92} />
                        </span>
                      </div>
                      <span className="text-[7px] text-emerald-400 font-mono font-semibold mt-1">
                        <CountUp end={92} /> Confidence
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                    Reason: Confidence high (<CountUp end={92} />%) with no negative billing telemetry. Executing action protocol.
                  </p>

                  {/* Status indicators */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-[9px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                      <span className="font-bold">CONFIDENCE DEMONSTRATION: HIGH</span>
                      <span className="text-slate-400 font-medium">(Auto-Apply)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                      <span>Low Confidence</span>
                      <span className="font-medium">(Operator Verification)</span>
                    </div>
                  </div>

                  {/* Action box at the bottom */}
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded p-2.5 text-[9px] text-emerald-400 font-mono">
                    <div className="flex items-center gap-1.5 font-bold uppercase mb-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTION: AUTO APPLIED
                    </div>
                    Right-sizing proposal dispatched automatically to customer.
                  </div>

                </div>
              </div>
            </InteractiveGlowCard>
          </motion.div>

        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-20 bg-[#0d0e1b] relative overflow-hidden border-t border-white/5" id="pricing">
        {/* Slowly floating ambient background blobs */}
        <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 20, -20, 0], 
              y: [0, -20, 20, 0],
              scale: [1, 1.1, 0.9, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-80 h-80 bg-[#8B4CFF] blur-[150px] -translate-x-1/2 -translate-y-1/2"
          ></motion.div>
          <motion.div 
            animate={{ 
              x: [0, -20, 20, 0], 
              y: [0, 20, -20, 0],
              scale: [1, 0.9, 1.1, 1] 
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500 blur-[150px] translate-x-1/2 translate-y-1/2"
          ></motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Ready to tailor every subscription to fit?
          </h2>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => setCurrentView("dashboard")}
            className="bg-gradient-to-r from-[#8B4CFF] to-cyan-400 hover:from-[#9c66ff] hover:to-cyan-300 text-white font-bold px-10 py-3.5 rounded-full text-sm transition-all hover:shadow-[0_0_20px_rgba(139,76,255,0.35)] cursor-pointer border border-white/10"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
