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
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Protocol Telemetry
            </span>
          </div>
          <span className="rounded-md bg-zinc-800 border border-white/10 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-400">
            Sepolia / EVM
          </span>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/10 bg-zinc-950/60 p-3">
            <span className="text-[10px] font-medium text-zinc-400">Escrow Locked</span>
            <div className="mt-1 font-mono text-base font-bold text-emerald-400">
              $1,420,000
            </div>
            <span className="text-[10px] text-zinc-500">100% Milestone Safe</span>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950/60 p-3">
            <span className="text-[10px] font-medium text-zinc-400">AI Deals Settled</span>
            <div className="mt-1 font-mono text-base font-bold text-zinc-200">
              2,840+
            </div>
            <span className="text-[10px] text-zinc-500">Avg. 14s negotiation</span>
          </div>
        </div>

        {/* User Session Progress */}
        <div className="mt-4 rounded-lg border border-white/10 bg-zinc-950/40 p-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-zinc-400">Session Matches</span>
            <span className="text-white font-mono">{matchedCount} saved</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full bg-brand-500 rounded-full"
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
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white">Your AI Agent</span>
            <p className="text-[11px] text-zinc-400">Autonomous dealmaking parameters</p>
          </div>
          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-white/10 bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-white hover:border-white/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Adjust
          </button>
        </div>

        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs">
            <span className="text-zinc-400">Acceptable Floor</span>
            <span className="font-mono font-medium text-zinc-200">
              ${userBudget.min.toLocaleString()} USDC
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs">
            <span className="text-zinc-400">Target Ceiling</span>
            <span className="font-mono font-medium text-emerald-400">
              ${userBudget.max.toLocaleString()} USDC
            </span>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-zinc-500 leading-relaxed flex items-center gap-1">
          <svg className="h-3 w-3 shrink-0 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Private boundaries: Neither clients nor other freelancers can see your confidential floor.</span>
        </p>
      </div>

      {/* Live On-Chain Activity Feed */}
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live Escrow Activity
          </span>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-zinc-300">
            <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div>
              <p className="font-medium text-white">Escrow Released: $3,200 USDC</p>
              <p className="text-[10px] text-zinc-500 font-mono">0x4a9...81e2 · Fullstack DEX Audit</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-zinc-300">
            <svg className="h-3.5 w-3.5 text-zinc-300 fill-current shrink-0 mt-0.5" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <div>
              <p className="font-medium text-white">Soulbound SBT Minted</p>
              <p className="text-[10px] text-zinc-500 font-mono">Tier Gold · Rust Solana Engineer</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-zinc-300">
            <svg className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2"/>
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4M8 16h0M16 16h0"/>
            </svg>
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
