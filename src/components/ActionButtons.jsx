import { motion } from "framer-motion";

export default function ActionButtons({
  onSkip,
  onApply,
  onUndo,
  canUndo = false,
  disabled = false,
}) {
  return (
    <div className="mt-6 flex flex-col items-center">
      {/* 4 Professional Deck Action Buttons */}
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {/* Undo / Rewind Button */}
        <motion.button
          whileHover={{ scale: canUndo && !disabled ? 1.08 : 1 }}
          whileTap={{ scale: canUndo && !disabled ? 0.92 : 1 }}
          onClick={onUndo}
          disabled={!canUndo || disabled}
          aria-label="Rewind last swiped gig"
          title="Rewind last card (or press Z)"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-ink-900/80 text-amber-400 shadow-lg backdrop-blur-md transition hover:border-amber-500/60 hover:bg-amber-500/10 disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4" />
          </svg>
        </motion.button>

        {/* Pass / Skip Button */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.08 }}
          whileTap={{ scale: disabled ? 1 : 0.92 }}
          onClick={onSkip}
          disabled={disabled}
          aria-label="Skip this gig"
          title="Pass / Skip (or press Left Arrow)"
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-ink-900/90 text-rose-400 shadow-xl backdrop-blur-md transition hover:border-rose-500/60 hover:bg-rose-500/15 disabled:opacity-30"
        >
          <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Super Match / Direct Escrow Star Button */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.08 }}
          whileTap={{ scale: disabled ? 1 : 0.92 }}
          onClick={onApply}
          disabled={disabled}
          aria-label="Super match"
          title="Super Match (Auto-accept optimal terms)"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/30 bg-ink-900/80 text-sky-400 shadow-lg backdrop-blur-md transition hover:border-sky-500/60 hover:bg-sky-500/10 disabled:opacity-30"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </motion.button>

        {/* Apply & Autonomous AI Negotiation Handshake Button */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.08 }}
          whileTap={{ scale: disabled ? 1 : 0.92 }}
          onClick={onApply}
          disabled={disabled}
          aria-label="Swipe right and start AI negotiation"
          title="Negotiate with AI & Lock Escrow (or press Right Arrow)"
          className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 text-emerald-400 shadow-xl shadow-emerald-500/20 backdrop-blur-md transition hover:border-emerald-500 hover:bg-emerald-500/30 disabled:opacity-30"
        >
          <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.button>
      </div>

      {/* Keyboard Shortcuts Helper */}
      <div className="mt-3.5 hidden sm:flex items-center gap-3 text-[11px] font-medium text-zinc-500">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-white/10 bg-ink-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">←</kbd>
          <span>Pass</span>
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-white/10 bg-ink-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">→</kbd>
          <span>Negotiate</span>
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-white/10 bg-ink-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">Z</kbd>
          <span>Undo</span>
        </span>
      </div>
    </div>
  );
}
