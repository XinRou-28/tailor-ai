import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Check,
  TrendingDown,
  Brain,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ArrowDown, // 修复白屏的关键：引入了 ArrowDown
  Cpu,
  Activity,
  ShieldCheck,
  Download,
  Terminal,
  Layers,
  ArrowUpRight,
  Database,
  Scale,
  Bot,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import LandingLogo from "../components/LandingLogo";

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
      {isHovered && (
        <>
          <div
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
            style={{
              background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`
            }}
          />
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

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] w-4 h-4 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

const ProblemSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const problems = [
    {
      icon: <Database className="w-8 h-8 text-cyan-400" />,
      title: "Scattered Customer Data",
      description: "Usage records, payment history, and support tickets live in separate systems, hiding the root cause of customer disengagement."
    },
    {
      icon: <Scale className="w-8 h-8 text-purple-400" />,
      title: "Mismatched Subscription Plans",
      description: "Customers frequently pay for features they never use or constantly hit tier limits, creating hidden dissatisfaction before they cancel."
    },
    {
      icon: <Bot className="w-8 h-8 text-red-400" />,
      title: "Blind Automation Risks",
      description: "High-value enterprise accounts get generic automated messages based on pure predictions, lacking human oversight where it matters most."
    }
  ];

  const handleNext = () => {
    setExpandedIndex((prev) => prev !== null ? (prev + 1) % problems.length : 0);
  };

  const closeExpanded = () => {
    setExpandedIndex(null);
  };

  useEffect(() => {
    if (expandedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '>') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0B0F19] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8B4CFF] to-cyan-400 mb-6 leading-relaxed">
            The Problem
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto tracking-wide">
            Traditional retention tools tell you WHO is leaving, but they don't tell you WHY.
          </p>
        </motion.div>

        {!expandedIndex && (
          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.1 }}
                onClick={() => setExpandedIndex(index)}
                className="bg-slate-900/50 backdrop-blur-md p-8 rounded-xl border border-slate-800 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:-translate-y-1 hover:cursor-none transition-all duration-300"
              >
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  {problem.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">{problem.title}</h3>
                <p className="text-slate-300 leading-relaxed text-center">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {expandedIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeExpanded}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={handleNext}
              className="relative z-10 bg-slate-900/30 backdrop-blur-xl border border-white/20 p-12 rounded-2xl max-w-2xl w-full mx-4 shadow-[0_0_50px_rgba(124,58,237,0.4)] cursor-pointer"
            >
              <button
                onClick={closeExpanded}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-white text-xl font-bold">×</span>
              </button>

              <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mb-8 mx-auto">
                {problems[expandedIndex].icon}
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center leading-relaxed">
                {problems[expandedIndex].title}
              </h3>
              <p className="text-slate-200 text-lg leading-relaxed text-center mb-8">
                {problems[expandedIndex].description}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CoreObjectivesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const objectives = [
    {
      title: "Unified Intelligence & Health Scoring",
      description: "Integrates usage, billing, feature adoption, and support data into a single view, running an explainable Customer Health Scoring model to catch early disengagement.",
      bullets: ["✓ Unified Customer Profile", "✓ Explainable Risk Analytics"]
    },
    {
      title: "Personalised Plan Matching Engine",
      description: "Provides targeted subscription recommendations that suggest the most suitable plan, proactive onboarding support, or capacity upgrades tailored to actual usage metrics.",
      bullets: ["✓ Smart Right-Sizing", "✓ Targeted Value Recovery"]
    },
    {
      title: "Trust Layer & Operations Hub",
      description: "Implements a confidence guardrail determining whether actions are automated or human-reviewed, fed directly into an interactive command dashboard with personalized communications.",
      bullets: ["✓ Guardrailed Automation", "✓ Full Analytics Dashboard"]
    }
  ];

  const nextObjective = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % objectives.length);
  };

  const prevObjective = () => {
    setActiveIndex((prevIndex) =>
      (prevIndex - 1 + objectives.length) % objectives.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextObjective();
      } else if (e.key === 'ArrowLeft') {
        prevObjective();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0B0F19] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8B4CFF] to-cyan-400 mb-6 leading-relaxed">
            Beyond Churn Prediction
          </h2>
          <p className="text-xl text-slate-400">
            Proactive value recovery driven by safe, trust-based AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-row items-center justify-center gap-4 md:gap-12 w-full"
        >
          <button
            onClick={prevObjective}
            className="w-14 h-14 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 max-w-2xl hover:cursor-none"
          >
            <div className="bg-slate-900/30 backdrop-blur-xl p-10 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400 mb-6 leading-relaxed">
                  {activeIndex === 2 ? "Trust-Based Decision Layer" : objectives[activeIndex].title}
                </h3>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  {activeIndex === 2 ? "AI that knows when to act and when to ask. Tailor AI safely automates plan adjustments when AI confidence scores are high, but instantly routes low-confidence or edge cases to a human operator for review." : objectives[activeIndex].description}
                </p>
                <div className="space-y-3">
                  {objectives[activeIndex].bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center text-cyan-400">
                      <span className="mr-3">●</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <button
            onClick={nextObjective}
            className="w-14 h-14 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </motion.div>

        <div className="flex justify-center space-x-2 mt-12">
          {objectives.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'bg-purple-500 scale-125' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const InteractiveTechStack = () => {
  const pipelineSteps = [
    {
      title: "Customer Data",
      subtitle: "(Usage • Billing • Feature Adoption • Support)",
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      borderClass: "border-cyan-500/30",
      bgClass: "bg-cyan-500/10",
      iconBorderClass: "border-cyan-500/20",
      titleClass: "text-cyan-400",
      shadowClass: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      hoverShadowClass: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
    },
    {
      title: "Logistic Regression",
      subtitle: "Health Score Prediction",
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      borderClass: "border-purple-500/30",
      bgClass: "bg-purple-500/10",
      iconBorderClass: "border-purple-500/20",
      titleClass: "text-purple-400",
      shadowClass: "shadow-[0_0_20px_rgba(124,58,237,0.15)]",
      hoverShadowClass: "hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
    },
    {
      title: "Recommendation Engine",
      subtitle: "Root Cause Analysis",
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      borderClass: "border-cyan-500/30",
      bgClass: "bg-cyan-500/10",
      iconBorderClass: "border-cyan-500/20",
      titleClass: "text-cyan-400",
      shadowClass: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      hoverShadowClass: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
    },
    {
      title: "Trust Layer",
      subtitle: "Human-in-the-loop",
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      borderClass: "border-purple-500/30",
      bgClass: "bg-purple-500/10",
      iconBorderClass: "border-purple-500/20",
      titleClass: "text-purple-400",
      shadowClass: "shadow-[0_0_20px_rgba(124,58,237,0.15)]",
      hoverShadowClass: "hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
    },
    {
      title: "Mistral AI",
      subtitle: "Customer Communication",
      icon: <Bot className="w-6 h-6 text-cyan-400" />,
      borderClass: "border-cyan-500/30",
      bgClass: "bg-cyan-500/10",
      iconBorderClass: "border-cyan-500/20",
      titleClass: "text-cyan-400",
      shadowClass: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      hoverShadowClass: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
    },
    {
      title: "React Dashboard",
      subtitle: "Business Insights",
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      borderClass: "border-purple-500/30",
      bgClass: "bg-purple-500/10",
      iconBorderClass: "border-purple-500/20",
      titleClass: "text-purple-400",
      shadowClass: "shadow-[0_0_20px_rgba(124,58,237,0.15)]",
      hoverShadowClass: "hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
    }
  ];

  const technologies = [
    { layer: "Frontend", tech: "React • TypeScript • Tailwind CSS • Framer Motion", color: "text-cyan-400" },
    { layer: "Backend", tech: "FastAPI • SQLAlchemy • SQLite • REST API", color: "text-purple-400" },
    { layer: "Machine Learning", tech: "Logistic Regression • Scikit-learn • Pandas • NumPy", color: "text-cyan-400" },
    { layer: "AI Components", tech: "Recommendation Engine • Trust Layer • Mistral AI • Custom Agents", color: "text-purple-400" },
    { layer: "Deployment", tech: "Vercel • Render", color: "text-cyan-400" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0B0F19] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8B4CFF] to-cyan-400 mb-6 leading-relaxed"
            animate={{
              textShadow: [
                '0 0 10px rgba(124, 58, 237, 0.4)',
                '0 0 20px rgba(124, 58, 237, 0.6)',
                '0 0 10px rgba(124, 58, 237, 0.4)'
              ],
              filter: [
                'drop-shadow(0 0 10px rgba(124, 58, 237, 0.4))',
                'drop-shadow(0 0 20px rgba(124, 58, 237, 0.6))',
                'drop-shadow(0 0 10px rgba(124, 58, 237, 0.4))'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            Technology Architecture
          </motion.h2>
        </motion.div>

        <div className="flex flex-col items-center justify-center mb-24 relative w-full">
          <div className="absolute top-10 bottom-10 w-0.5 bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-cyan-500/20 -z-10"></div>
          
          {pipelineSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.1 }}
                className={`bg-slate-900/60 backdrop-blur-md border ${step.borderClass} p-5 rounded-2xl ${step.shadowClass} ${step.hoverShadowClass} transition-all duration-300 w-[90%] sm:w-[450px] flex flex-col items-center text-center z-10 cursor-default`}
              >
                <div className={`w-12 h-12 ${step.bgClass} border ${step.iconBorderClass} rounded-lg flex items-center justify-center mb-3`}>
                  {step.icon}
                </div>
                <h4 className={`text-xl font-bold ${step.titleClass} mb-1`}>{step.title}</h4>
                <p className="text-slate-300 text-sm font-medium">{step.subtitle}</p>
              </motion.div>
              
              {index < pipelineSteps.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="py-4 z-10 text-slate-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                >
                  <ArrowDown className="w-7 h-7" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-[0_0_40px_rgba(124,58,237,0.1)] hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] transition-shadow duration-500 w-full"
        >
          <h3 className="text-2xl font-bold text-center text-white mb-8 tracking-wide">
            Technology
          </h3>
          <div className="flex flex-col space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-3 border-b border-white/10 text-slate-400 font-semibold text-xs md:text-sm uppercase tracking-wider px-4">
              <div className="md:col-span-1">Layer</div>
              <div className="md:col-span-3">Technology</div>
            </div>
            
            {technologies.map((tech, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", scale: 1.01 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 px-4 border-b border-white/5 last:border-0 rounded-xl transition-all duration-300 items-center cursor-default"
              >
                <div className={`font-bold text-base md:text-lg ${tech.color} md:col-span-1 drop-shadow-md`}>
                  {tech.layer}
                </div>
                <div className="text-slate-200 font-medium md:col-span-3 text-sm md:text-base tracking-wide">
                   {tech.tech}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

const BrandBannerSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="bg-[#0B0F19] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-7xl md:text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4 leading-tight">
            Tailor AI
          </h2>
          <h3 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 pb-2 drop-shadow-[0_0_20px_rgba(124,58,237,0.6)] mb-6">
            Subscription Intelligence
          </h3>
        </motion.div>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Tailor Every Subscription with <span className="text-cyan-300 font-medium drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">Intelligent, Data-Driven Insights</span><br />
          to Fit Your Business.
        </p>
      </div>
    </motion.div>
  );
};

const PotentialImpactSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0B0F19] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8B4CFF] to-cyan-400 mb-6 leading-relaxed">
            Direct Impact
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 150, rotate: 5 },
              visible: { opacity: 1, x: 0, rotate: 0 }
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            <h4 className="text-xl font-bold text-purple-400 mb-3">Revenue Protection</h4>
            <p className="text-slate-300 leading-relaxed">
              Prevents complete cancellations by proactively identifying under-utilized accounts and recommending cost-effective right-sizing.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 150, rotate: -3 },
              visible: { opacity: 1, x: 0, rotate: 0 }
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            <h4 className="text-xl font-bold text-cyan-400 mb-3">Revenue Expansion</h4>
            <p className="text-slate-300 leading-relaxed">
              Tracks highly engaged users hitting plan limits to automatically recommend timely, frictionless premium upgrades.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 150, rotate: 3 },
              visible: { opacity: 1, x: 0, rotate: 0 }
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.45 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            <h4 className="text-xl font-bold text-purple-400 mb-3">Operational Intelligence</h4>
            <p className="text-slate-300 leading-relaxed">
              Aggregates portfolio-wide behavioral data to empower leadership with actionable insights for product and pricing strategies.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

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
    <div id="homepage-container" className="bg-[#111224] text-slate-100 overflow-hidden relative min-h-screen font-sans antialiased cursor-none">
      <CustomCursor />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <LandingLogo size="2rem" />
            </div>
            <span className="text-xl font-bold text-white">Tailor AI</span>
          </div>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="bg-gradient-to-r from-[#8B4CFF] to-cyan-400 hover:from-[#9c66ff] hover:to-cyan-300 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all hover:shadow-[0_0_15px_rgba(139,76,255,0.3)] cursor-pointer border border-white/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleHeroMouseMove}
        className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 border-b border-white/5"
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] transition-transform duration-300 ease-out pointer-events-none"
          style={{ transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)` }}
        ></div>

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[500px] mx-auto lg:ml-auto relative flex flex-col lg:block lg:h-[500px] py-4 lg:py-0"
            style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
          >
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

              <div className="space-y-2.5">
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

              <div className="relative pl-5 space-y-3">
                <div className="absolute left-[3px] top-1 bottom-1 w-[1px] bg-gradient-to-b from-rose-500 via-[#8B4CFF] to-cyan-500"></div>

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
      </motion.div>

      <ProblemSection />

      <CoreObjectivesCarousel />

      <PotentialImpactSection />

      <InteractiveTechStack />

      <BrandBannerSection />

      <section className="py-16 sm:py-20 bg-[#0d0e1b] relative overflow-hidden border-t border-white/5" id="pricing">
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