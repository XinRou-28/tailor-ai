// INTERACTIVE TECH STACK (Grid Layout with Mascot)
const InteractiveTechStack = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0B0F19] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
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
            Our Tech Stack
          </motion.h2>
        </motion.div>

        {/* Grid Layout with Mascot Integration */}
        <div className="relative">
          {/* Mascot on left side with floating animation */}
          <motion.div
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: 'scaleX(-1)' }}
          >
            <img
              src="/src/assets/MascotTotogo.png"
              alt="Tailor AI Mascot"
              className="w-48 h-48 object-contain"
            />
          </motion.div>

          {/* Mobile Mascot */}
          <motion.div
            className="lg:hidden block mb-12 text-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: 'scaleX(-1)' }}
          >
            <img
              src="/src/assets/MascotTotogo.png"
              alt="Tailor AI Mascot"
              className="w-32 h-32 object-contain mx-auto"
            />
          </motion.div>

          {/* 4 Tech Stack Cards in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:pl-48">
            {/* Frontend & UI */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300"
            >
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Terminal className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="text-xl font-bold text-cyan-400 mb-4 text-center">Frontend & UI</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>React</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>TypeScript</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>Tailwind CSS</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>Framer Motion</li>
              </ul>
            </motion.div>

            {/* Backend Engine */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-md border border-purple-500/20 p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Database className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-purple-400 mb-4 text-center">Backend Engine</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>FastAPI</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>SQLAlchemy</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>SQLite</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>REST API</li>
              </ul>
            </motion.div>

            {/* Machine Learning */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300"
            >
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="text-xl font-bold text-cyan-400 mb-4 text-center">Machine Learning</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>XGBoost</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>Scikit-learn</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>Pandas</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>NumPy</li>
              </ul>
            </motion.div>

            {/* Decision Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-md border border-purple-500/20 p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-purple-400 mb-4 text-center">Decision Intelligence</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>LLM Recommendation</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>Trust Layer</li>
                <li className="flex items-start"><span className="mr-2 mt-1">•</span>Custom Agents</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveTechStack;