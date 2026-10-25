import { motion } from "framer-motion";

export default function MarketTelemetry({
  matchedCount = 0,
  completedCount = 0,
  userBudget,
  onOpenSettings,
  wallet,
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[340px] shrink-0">
      {/* Protocol Metrics Card */}
      <div className="rounded-3xl border border-white/[0.08] bg-ink-900/80 p-5 shadow-card backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Protocol Telemetry
            </span>
          </div>
          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-400">
            Sepolia / EVM
          </span>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.05] bg-ink-950/60 p-3">
            <span className="text-[10px] font-medium text-zinc-400">Escrow Locked</span>
            <div className="mt-1 font-mono text-base font-bold text-emerald-400">
              $1,420,000
            </div>
            <span className="text-[10px] text-zinc-500">100% Milestone Safe</span>
          </div>

          <div className="rounded-2xl border border-white/[0.05] bg-ink-950/60 p-3">
            <span className="text-[10px] font-medium text-zinc-400">AI Deals Settled</span>
            <div className="mt-1 font-mono text-base font-bold text-brand-300">
              2,840+
            </div>
            <span className="text-[10px] text-zinc-500">Avg. 14s negotiation</span>
          </div>
        </div>

        {/* User Session Progress */}
        <div className="mt-4 rounded-2xl border border-white/[0.05] bg-ink-950/40 p-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-400">Session Matches</span>
            <span className="text-white font-mono">{matchedCount} saved</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (matchedCount / 5) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="mt-1.5 block text-[10px] text-zinc-500">
            {completedCount} smart contract deal{completedCount === 1 ? "" : "s"} finalized
          </span>
        </div>
      </div>

      {/* Autonomous AI Agent Budget Status */}
      <div className="rounded-3xl border border-white/[0.08] bg-ink-900/80 p-5 shadow-card backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white">Your AI Agent</span>
            <p className="text-[11px] text-zinc-400">Autonomous dealmaking parameters</p>
          </div>
          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-brand-300 hover:bg-white/10 transition"
          >
            Adjust
          </button>
        </div>

        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-ink-950/60 px-3 py-2 text-xs">
            <span className="text-zinc-400">Acceptable Floor</span>
            <span className="font-mono font-semibold text-zinc-200">
              ${userBudget.min.toLocaleString()} USDC
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-ink-950/60 px-3 py-2 text-xs">
            <span className="text-zinc-400">Target Ceiling</span>
            <span className="font-mono font-semibold text-emerald-400">
              ${userBudget.max.toLocaleString()} USDC
            </span>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-zinc-500 leading-relaxed">
          🔒 Private boundaries: Neither clients nor other freelancers can see your confidential floor.
        </p>
      </div>

      {/* Live On-Chain Activity Feed */}
      <div className="rounded-3xl border border-white/[0.08] bg-ink-900/80 p-5 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <span className="text-sm">⚡</span>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live Escrow Activity
          </span>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-zinc-300">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <p className="font-medium text-white">Escrow Released: $3,200 USDC</p>
              <p className="text-[10px] text-zinc-500 font-mono">0x4a9...81e2 · Fullstack DEX Audit</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-zinc-300">
            <span className="text-brand-400 font-bold">★</span>
            <div>
              <p className="font-medium text-white">Soulbound SBT Minted</p>
              <p className="text-[10px] text-zinc-500 font-mono">Tier Gold · Rust Solana Engineer</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-zinc-300">
            <span className="text-amber-400 font-bold">🤖</span>
            <div>
              <p className="font-medium text-white">AI Deal Settled: $1,750 USDC</p>
              <p className="text-[10px] text-zinc-500 font-mono">Countered in 3 autonomous rounds</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
