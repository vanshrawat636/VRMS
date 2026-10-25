import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    icon: "👥",
    title: "1. Choose Your Role",
    color: "from-violet-500 to-indigo-500",
    badge: "Step 1",
    tagline: "Client or Freelancer",
    content:
      "When you first launch Matchwork, pick whether you are hiring talent (Client) or finding work (Freelancer). Your role tailors the feed, negotiation prompts, and wallet escrow actions.",
    details: [
      "Clients post gig bounties and lock payment in escrow.",
      "Freelancers swipe right on jobs and earn Soulbound reputation tokens upon delivery.",
      "Switch roles anytime from Settings.",
    ],
  },
  {
    icon: "🔥",
    title: "2. Tinder-Style Swiping",
    color: "from-cyan-500 to-teal-500",
    badge: "Step 2",
    tagline: "Fast & intuitive matchmaking",
    content:
      "Replace tedious cover letters and 10-page resumes. Swipe through interactive cards with key deliverables, requirements, and budget ranges.",
    details: [
      "Swipe RIGHT (or click ♥) to match and trigger automated AI negotiation.",
      "Swipe LEFT (or click ✕) to skip the gig.",
      "Tap any skill pill at the top (e.g. Solidity, React, AI) to filter the catalogue instantly.",
    ],
  },
  {
    icon: "🤖",
    title: "3. AI Automated Negotiation",
    color: "from-amber-500 to-orange-500",
    badge: "Step 3",
    tagline: "Autonomous dealmaking",
    content:
      "No more back-and-forth messaging. Your personal AI Agent negotiates price, timeline, and terms in the background using your confidential budget preferences.",
    details: [
      "Set your minimum acceptable payout and target ceiling in Settings.",
      "AI agents exchange counter-offers in seconds and settle on a fair equilibrium.",
      "You review and confirm the negotiated rate before locking funds.",
    ],
  },
  {
    icon: "🔒",
    title: "4. Web3 Smart Contract Escrow",
    color: "from-emerald-500 to-green-500",
    badge: "Step 4",
    tagline: "Trustless decentralized payments",
    content:
      "Once an agreement is struck, the client's payment is locked into an audited Ethereum/EVM smart contract escrow (GigEscrow.sol).",
    details: [
      "Funds are safely held on-chain — no centralized middlemen.",
      "Released to the freelancer's wallet immediately when the job is submitted and accepted.",
      "MetaMask integration for one-click signing and deposits.",
    ],
  },
  {
    icon: "🏆",
    title: "5. Soulbound Reputation Tokens",
    color: "from-rose-500 to-pink-500",
    badge: "Step 5",
    tagline: "Verifiable on-chain resume",
    content:
      "Every completed gig mints a permanent Soulbound Token (ERC-5192) to the freelancer's wallet. It cannot be sold or transferred.",
    details: [
      "Builds an unforgeable cryptographic portfolio of completed projects.",
      "View all earned SBTs, ratings, and stats on your Profile page.",
      "Verifiable by clients globally without relying on centralized platform reviews.",
    ],
  },
  {
    icon: "⚙️",
    title: "6. Settings & Hidden Budget",
    color: "from-purple-500 to-pink-500",
    badge: "Step 6",
    tagline: "Personalize your experience",
    content:
      "Open Settings anytime via the gear icon in the top header. Tailor your agent's negotiation boundaries and access account controls.",
    details: [
      "Configure your confidential budget floor and ceiling.",
      "Manage MetaMask wallet connection and address switching.",
      "Logout or switch account roles at any time.",
    ],
  },
];

export default function StarterManual({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const step = steps[activeStep];

  return (
    <div className="flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20 text-accent-soft text-base">
            📖
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Starter Manual</h3>
            <p className="text-[11px] text-zinc-400">Everything you need to master Matchwork</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Step Tabs / Indicators */}
      <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`flex flex-1 min-w-[40px] flex-col items-center gap-1 rounded-xl py-2 px-1 text-center transition ${
              activeStep === idx
                ? "bg-white/10 text-white font-bold ring-1 ring-white/20"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            <span className="text-sm">{s.icon}</span>
            <span className="text-[10px] whitespace-nowrap">{s.badge}</span>
          </button>
        ))}
      </div>

      {/* Active Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4 rounded-2xl border border-white/10 bg-ink-950/70 p-5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-white/10 text-2xl`}>
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-soft">
                {step.tagline}
              </span>
              <h4 className="text-base font-bold text-white">{step.title}</h4>
            </div>
          </div>

          <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed">
            {step.content}
          </p>

          <div className="mt-4 space-y-2 rounded-xl border border-white/5 bg-ink-900/60 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Key Highlights
            </span>
            {step.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-300">
                <span className="text-accent text-xs">✓</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
          disabled={activeStep === 0}
          className="flex-1 rounded-xl border border-white/10 bg-ink-800 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-ink-700 disabled:opacity-40"
        >
          ← Previous
        </button>

        {activeStep < steps.length - 1 ? (
          <button
            onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
            className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-soft"
          >
            Next Step →
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            Got it, Let's Swipe! 🔥
          </button>
        )}
      </div>
    </div>
  );
}
