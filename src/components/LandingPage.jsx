import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_ICON = (
  <svg viewBox="0 0 48 48" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const roles = [
  {
    id: "client",
    title: "1. Client",
    subtitle: "Hire Talent & Fund Escrows",
    desc: "Post gigs, browse top Web3 & AI freelancers, let your personal AI negotiate optimal rates, and deposit funds securely into smart contract escrow.",
    pill: "border border-white/10 bg-zinc-800 text-zinc-300",
  },
  {
    id: "freelancer",
    title: "2. Freelancing",
    subtitle: "Find Work & Earn Reputation",
    desc: "Swipe right on high-paying gigs, negotiate contracts autonomously via AI agents, get paid directly on-chain, and mint permanent Soulbound reputation tokens.",
    pill: "border border-white/10 bg-zinc-800 text-zinc-300",
  },
];

export default function LandingPage({ onEnter }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState("role"); // "role" | "auth"
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [customName, setCustomName] = useState("");

  const handleSelectRole = (rId) => {
    setSelectedRole(rId);
    setStep("auth");
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const isClient = selectedRole === "client";
      const mockUser = {
        name: isClient ? "Alex Chen (Client)" : "Sarah Vance (Freelancer)",
        email: isClient ? "alex.chen@client.ai" : "sarah.dev@freelance.eth",
        avatar: isClient
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        provider: "google",
        role: selectedRole,
      };
      localStorage.setItem("sg_user", JSON.stringify(mockUser));
      localStorage.setItem("sg_role", selectedRole);
      setIsGoogleLoading(false);
      onEnter(mockUser, selectedRole);
    }, 700);
  };

  const handleQuickDemo = () => {
    const isClient = selectedRole === "client";
    const name = customName.trim() || (isClient ? "Demo Client" : "Demo Freelancer");
    const demoUser = {
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@matchwork.xyz`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      provider: "demo",
      role: selectedRole,
    };
    localStorage.setItem("sg_user", JSON.stringify(demoUser));
    localStorage.setItem("sg_role", selectedRole);
    onEnter(demoUser, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 p-6 sm:p-8"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-800 text-brand-400 font-bold text-xl">
            M
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome to Match<span className="text-brand-400">work</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Tinder-style matching · AI negotiation · Web3 smart contract escrows
          </p>
        </div>

        {/* Stepper Views */}
        <AnimatePresence mode="wait">
          {step === "role" ? (
            <motion.div
              key="step-role"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
              className="mt-6 flex flex-col gap-4"
            >
              <div className="text-center">
                <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-[11px] font-medium text-zinc-300">
                  Step 1 of 2: Select Your Profile
                </span>
                <h2 className="mt-2 text-sm font-semibold text-zinc-200">
                  How would you like to use Matchwork?
                </h2>
              </div>

              {/* 2 Options: Client and Freelancing */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className="group relative flex flex-col items-start rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-left transition hover:border-white/20 hover:bg-zinc-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-zinc-300">
                        {r.id === "client" ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                          </svg>
                        )}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${r.pill}`}>
                        {r.id === "client" ? "Option 1" : "Option 2"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white group-hover:text-brand-300 transition">
                      {r.title}
                    </h3>
                    <p className="text-xs font-medium text-zinc-300">
                      {r.subtitle}
                    </p>
                    <p className="mt-2 text-[11px] text-zinc-400 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="mt-4 flex w-full items-center justify-between text-xs font-medium text-brand-400 group-hover:text-brand-300 transition duration-150">
                      <span>Choose {r.id === "client" ? "Client" : "Freelancing"}</span>
                      <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step-auth"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="mt-6 flex flex-col gap-4"
            >
              {/* Back to role selector button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep("role")}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
                >
                  ← Back to role choice
                </button>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                  {selectedRole === "client" ? (
                    <>
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <span>Client Mode</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span>Freelancing Mode</span>
                    </>
                  )}
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-5 text-center">
                <h2 className="text-base font-bold text-white">Sign In to Continue</h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Save your swipes, negotiate with AI agents, and manage on-chain escrows.
                </p>

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  id="btn-google-login"
                  className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 active:scale-[0.99] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-zinc-900" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Signing in with Google...</span>
                    </div>
                  ) : (
                    <>
                      {GOOGLE_ICON}
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="my-4 flex items-center gap-3 text-xs text-zinc-500">
                  <div className="h-px flex-1 bg-white/10" />
                  <span>or enter as guest demo</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Custom Name / Quick Demo */}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={selectedRole === "client" ? "Enter Client Name (Optional)" : "Enter Freelancer Handle (Optional)"}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleQuickDemo()}
                  />
                  <button
                    onClick={handleQuickDemo}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 px-4 text-xs font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                    </svg>
                    <span>Enter Instantly ({selectedRole === "client" ? "Client" : "Freelancer"})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <p className="mt-6 text-center text-[11px] text-zinc-500">
          By entering, you agree to decentralized escrow settlement & AI negotiation terms.
        </p>
      </motion.div>
    </div>
  );
}
