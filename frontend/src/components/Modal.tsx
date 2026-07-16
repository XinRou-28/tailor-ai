import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "get_started" | "demo";
  onSubmitSuccess?: () => void;
}

export default function Modal({ isOpen, onClose, type, onSubmitSuccess }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-surface p-xl shadow-2xl border border-outline-variant z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-md top-md p-1 rounded-full text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Body depending on Type */}
            {type === "login" && (
              <div id="modal-login">
                <div className="flex items-center gap-sm mb-lg">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>architecture</span>
                  <span className="text-title-lg font-headline-md font-bold text-on-surface">Tailor AI</span>
                </div>
                
                <h3 className="text-headline-md font-headline-md text-primary mb-xs">Welcome back</h3>
                <p className="text-body-md text-on-surface-variant mb-lg">Sign in to manage your subscription intelligence dashboard.</p>
                
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    alert("Interactive Login simulation successful!"); 
                    if (onSubmitSuccess) {
                      onSubmitSuccess();
                    } else {
                      onClose();
                    }
                  }} 
                  className="space-y-md"
                >
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-xs font-semibold">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      defaultValue="peishing1103@gmail.com"
                      className="w-full px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="you@company.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-xs font-semibold">Password</label>
                    <input 
                      type="password" 
                      required 
                      defaultValue="••••••••••••"
                      className="w-full px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="••••••••" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-sm">
                    <label className="flex items-center gap-xs text-[13px] text-on-surface-variant">
                      <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" />
                      Remember me
                    </label>
                    <a href="#" className="text-[13px] text-secondary hover:underline">Forgot password?</a>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-primary text-on-primary font-bold py-md rounded-xl hover:opacity-95 transition-opacity mt-lg cursor-pointer"
                  >
                    Sign In
                  </button>
                </form>
              </div>
            )}

            {type === "get_started" && (
              <div id="modal-get-started">
                <div className="inline-flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-full text-label-md text-on-primary-fixed-variant mb-md border border-outline-variant">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  14-DAY TRIAL
                </div>
                
                <h3 className="text-headline-md font-headline-md text-primary mb-xs">Activate Subscription Intelligence</h3>
                <p className="text-body-md text-on-surface-variant mb-lg">Start recovering value in under 15 minutes. No credit card required.</p>
                
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    alert("Interactive setup triggered! We've sent a simulated connection invitation."); 
                    if (onSubmitSuccess) {
                      onSubmitSuccess();
                    } else {
                      onClose();
                    }
                  }} 
                  className="space-y-md"
                >
                  <div className="grid grid-cols-2 gap-sm">
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-xs font-semibold">First Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary" 
                        placeholder="First" 
                      />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-xs font-semibold">Last Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary" 
                        placeholder="Last" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-xs font-semibold">Company Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary" 
                      placeholder="Acme Corp" 
                    />
                  </div>
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-xs font-semibold">Integrate SaaS Source</label>
                    <select className="w-full px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-secondary">
                      <option>Stripe Billing System</option>
                      <option>Paddle Subscriptions</option>
                      <option>Braintree Subscriptions</option>
                      <option>Zuora Enterprise</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-secondary text-white font-bold py-md rounded-xl hover:opacity-95 transition-all shadow-md shadow-secondary/20 mt-lg cursor-pointer"
                  >
                    Create Free Account & Integrate
                  </button>
                </form>
              </div>
            )}

            {type === "demo" && (
              <div id="modal-demo">
                <h3 className="text-headline-md font-headline-md text-primary mb-xs">Tailor AI Platform Walkthrough</h3>
                <p className="text-body-md text-on-surface-variant mb-lg">See how subscription intelligence automatically flags the value gap and acts.</p>
                
                {/* Simulated Interactive Video Screen */}
                <div className="relative aspect-video bg-primary rounded-xl overflow-hidden flex flex-col items-center justify-center border border-outline-variant shadow-inner p-md">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-secondary blur-[50px] -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  {/* Visual Simulation of Video Content */}
                  <div className="z-10 text-center text-white p-lg space-y-sm">
                    <span className="material-symbols-outlined text-secondary text-5xl animate-pulse">architecture</span>
                    <p className="font-headline-md text-body-lg text-white font-semibold">Intervention Sequence: Active</p>
                    <p className="text-body-md text-on-primary-container opacity-80 max-w-sm">
                      "Analyzing account activity... identifying 3 core triggers... firing guided in-app tutorials automatically."
                    </p>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-md">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="bg-secondary h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-md flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                  <span className="flex items-center gap-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE SIMULATOR ACTIVE
                  </span>
                  <span>Duration: 1:32 min</span>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full bg-primary text-on-primary font-bold py-md rounded-xl hover:opacity-95 transition-opacity mt-lg cursor-pointer"
                >
                  Close Demo
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
