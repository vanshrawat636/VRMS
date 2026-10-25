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
    emoji: "💼",
    title: "1. Client",
    subtitle: "Hire Talent & Fund Escrows",
    desc: "Post gigs, browse top Web3 & AI freelancers, let your personal AI negotiate optimal rates, and deposit funds securely into smart contract escrow.",
    gradient: "from-violet-600/20 to-indigo-600/20",
    border: "border-violet-500/40",
    glow: "shadow-violet-500/20",
    active: "border-violet-400 bg-violet-500/15 ring-2 ring-violet-500/40",
    pill: "bg-violet-500/20 text-violet-300",
  },
  {
    id: "freelancer",
    emoji: "⚡",
    title: "2. Freelancing",
    subtitle: "Find Work & Earn Reputation",
    desc: "Swipe right on high-paying gigs, negotiate contracts autonomously via AI agents, get paid directly on-chain, and mint permanent Soulbound reputation tokens.",
    gradient: "from-cyan-600/20 to-teal-600/20",
    border: "border-cyan-500/40",
    glow: "shadow-cyan-500/20",
    active: "border-cyan-400 bg-cyan-500/15 ring-2 ring-cyan-500/40",
    pill: "bg-cyan-500/20 text-cyan-300",
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
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@swipegig.xyz`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      provider: "demo",
      role: selectedRole,
    };
    localStorage.setItem("sg_user", JSON.stringify(demoUser));
    localStorage.setItem("sg_role", selectedRole);
    onEnter(demoUser, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950 p-4 sm:p-6 overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[500px] rounded-full bg-cyan-600/10 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-ink-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-accent to-pink-500 shadow-lg shadow-accent/30 text-white font-black text-2xl">
            S
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to Swipe<span className="text-accent-soft">Gig</span>
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
              transition={{ duration: 0.2 }}
              className="mt-6 flex flex-col gap-4"
            >
              <div className="text-center">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-zinc-300">
                  Step 1 of 2: Select Your Profile
                </span>
                <h2 className="mt-2 text-sm font-semibold text-zinc-200">
                  How would you like to use SwipeGig?
                </h2>
              </div>

              {/* 2 Options: Client and Freelancing */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition duration-200 hover:scale-[1.02] ${r.border} bg-gradient-to-b ${r.gradient} hover:border-white/40 shadow-lg`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-3xl">{r.emoji}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${r.pill}`}>
                        {r.id === "client" ? "Option 1" : "Option 2"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white group-hover:text-accent-soft transition">
                      {r.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-300">
                      {r.subtitle}
                    </p>
                    <p className="mt-2 text-[11px] text-zinc-400 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="mt-4 flex w-full items-center justify-between text-xs font-semibold text-accent-soft group-hover:translate-x-1 transition duration-150">
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
              transition={{ duration: 0.2 }}
              className="mt-6 flex flex-col gap-4"
            >
              {/* Back to role selector button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep("role")}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
                >
                  ← Back to role choice
                </button>
                <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-bold text-accent-soft uppercase">
                  {selectedRole === "client" ? "💼 Client Mode" : "⚡ Freelancing Mode"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-5 text-center">
                <h2 className="text-base font-bold text-white">Sign In to Continue</h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Save your swipes, negotiate with AI agents, and manage on-chain escrows.
                </p>

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  id="btn-google-login"
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white px-5 py-3 text-sm font-bold text-zinc-900 shadow-xl transition hover:bg-zinc-100 hover:shadow-2xl active:scale-[0.99] disabled:opacity-60"
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
                    className="w-full rounded-xl border border-white/10 bg-ink-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleQuickDemo()}
                  />
                  <button
                    onClick={handleQuickDemo}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-ink-800 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-ink-700 hover:text-white"
                  >
                    🚀 Enter Instantly ({selectedRole === "client" ? "Client" : "Freelancer"})
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
