import WalletButton from "./WalletButton.jsx";

export default function Header({
  matched = 0,
  skipped = 0,
  completedCount = 0,
  currentView = "feed",
  onOpenSettings,
  onToggleProfile,
  wallet,
  isLiveBackend = false,
  onRefreshBackend,
  role = "freelancer",
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand Logo & Protocol Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleProfile("feed")}
            className="group flex items-center gap-2.5 text-left transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
            title="Matchwork Home Feed"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-brand-400 group-hover:border-white/20 transition duration-200">
              <svg className="h-4 w-4 text-brand-400 transition" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Match<span className="text-brand-400">work</span>
                </span>
                <span className="rounded-md border border-white/10 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  Protocol
                </span>
              </div>
            </div>
          </button>

          {/* Backend Engine Status Pill */}
          <button
            onClick={onRefreshBackend}
            title={
              isLiveBackend
                ? "FastAPI AI Engine Connected (Port 8000). Click to re-check."
                : "Autonomous Demo Mode (FastAPI offline). Running in-browser AI heuristics. Click to ping backend."
            }
            className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isLiveBackend ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            <span>{isLiveBackend ? "AI Engine Active" : "Autonomous Mode"}</span>
          </button>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center rounded-xl border border-white/10 bg-zinc-900 p-1">
          <button
            onClick={() => onToggleProfile("feed")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
              currentView === "feed"
                ? "bg-brand-500 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Feed</span>
            {matched > 0 && currentView === "feed" && (
              <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300">
                {matched}
              </span>
            )}
          </button>

          <button
            onClick={() => onToggleProfile("profile")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
              currentView === "profile"
                ? "bg-brand-500 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Reputation</span>
            {completedCount > 0 && (
              <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {completedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Controls: Wallet & Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* User Mode Pill */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
            <span>Role:</span>
            <span className="font-semibold text-white capitalize">{role}</span>
          </div>

          {/* Web3 MetaMask Wallet Capsule */}
          {wallet && <WalletButton wallet={wallet} />}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Protocol & Agent Settings"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Open settings"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
