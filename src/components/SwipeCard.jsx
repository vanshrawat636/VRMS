import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import SBTBadge from "./SBTBadge.jsx";

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 450;

const exitVariants = {
  exit: (direction) => ({
    x: direction * 650,
    rotate: direction * 16,
    opacity: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CATEGORY_STYLES = {
  Development: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-indigo-400",
  },
  Design: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-fuchsia-400",
  },
  Security: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-emerald-400",
  },
  Writing: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-amber-400",
  },
  "AI / ML": {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-rose-400",
  },
  Data: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-teal-400",
  },
  Mobile: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-violet-400",
  },
  DevOps: {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-sky-400",
  },
};

export default function SwipeCard({
  gig,
  index,
  direction,
  onSwipe,
  onSkillClick,
  activeSkills = [],
}) {
  const isTop = index === 0;
  const [skillToast, setSkillToast] = useState(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-13, 0, 13]);
  const applyOpacity = useTransform(x, [20, 130], [0, 1]);
  const skipOpacity = useTransform(x, [-130, -20], [1, 0]);

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) onSwipe(1);
    else if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) onSwipe(-1);
  };

  const handleSkillClick = (e, skill) => {
    if (!isTop) return;
    e.stopPropagation();
    onSkillClick?.(skill);
    setSkillToast(skill);
    setTimeout(() => setSkillToast(null), 1400);
  };

  const cat = CATEGORY_STYLES[gig.category] || {
    border: "border-white/10",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    dot: "bg-zinc-400",
  };

  return (
    <motion.div
      className="swipe-surface absolute inset-0"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - index,
        touchAction: "pan-y",
      }}
      custom={direction}
      variants={exitVariants}
      exit="exit"
      initial={{ scale: 0.94, y: 24, opacity: 0 }}
      animate={{
        scale: 1 - index * 0.04,
        y: index * 14,
        opacity: 1 - index * 0.22,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={isTop ? handleDragEnd : undefined}
    >
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition duration-200 ${
          isTop ? "cursor-grab hover:border-white/20" : ""
        }`}
      >
        {/* Swipe Feedback Overlay Stamps */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: applyOpacity }}
              className="pointer-events-none absolute left-6 top-6 z-30 -rotate-12 rounded-xl border-2 border-emerald-500 bg-zinc-950/90 px-4 py-2 text-sm font-extrabold tracking-widest text-emerald-400"
            >
              MATCH & NEGOTIATE
            </motion.div>
            <motion.div
              style={{ opacity: skipOpacity }}
              className="pointer-events-none absolute right-6 top-6 z-30 rotate-12 rounded-xl border-2 border-rose-500 bg-zinc-950/90 px-4 py-2 text-sm font-extrabold tracking-widest text-rose-400"
            >
              PASS GIG
            </motion.div>
          </>
        )}

        {/* Skill Tap Filter Toast */}
        <AnimatePresence>
          {skillToast && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-300 shadow-md"
            >
              <svg className="h-3 w-3 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span>Filtering for "{skillToast}"</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Body */}
        <div className="relative flex flex-1 flex-col p-6 sm:p-7">
          {/* Top Badges Row */}
          <div className="flex items-center justify-between gap-2">
            <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cat.border} ${cat.bg} ${cat.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
              <span>{gig.category}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                <svg className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Escrow Safe</span>
              </span>
              <span className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                <svg className="h-3 w-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{gig.timeline}</span>
              </span>
            </div>
          </div>

          {/* Title & Core Value Proposition */}
          <div className="mt-4 sm:mt-5">
            <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-white">
              {gig.title}
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-400">
              {gig.description}
            </p>
          </div>

          {/* Skills Required Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {gig.skills.map((skill) => {
              const isActive = activeSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={(e) => handleSkillClick(e, skill)}
                  className={`group flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                    isActive
                      ? "border-brand-500 bg-brand-500/20 text-brand-300"
                      : isTop
                      ? "border-white/10 bg-zinc-800/60 text-zinc-300 hover:border-white/20 hover:text-white"
                      : "border-white/10 bg-zinc-800/40 text-zinc-400"
                  }`}
                  title={isTop ? `Click to filter by ${skill}` : skill}
                >
                  {isActive && (
                    <svg className="h-2.5 w-2.5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Smart Contract Bounty Box */}
          <div className="mt-5 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Target Bounty (Escrow Locked)
                </span>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    ${gig.budget.toLocaleString()}
                  </span>
                  <span className="rounded-md border border-white/10 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
                    {gig.currency}
                  </span>
                </div>
              </div>

              {/* AI Agent Match Indicator */}
              <div className="flex flex-col items-end text-right">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI Dealmaker Ready
                </span>
                <span className="mt-1 text-[10px] text-zinc-500">
                  Auto-negotiates on right swipe
                </span>
              </div>
            </div>
          </div>

          {/* Verified Client Row */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-200 border border-white/10">
                {gig.buyer.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs sm:text-sm font-semibold text-zinc-100">
                    {gig.buyer.name}
                  </span>
                  {gig.buyer.verified && (
                    <span
                      title="Verified Client on Ethereum Escrow"
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-500/20 text-sky-400"
                    >
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>{gig.buyer.rating.toFixed(1)}</span>
                  </span>
                  <span>·</span>
                  <span>{gig.buyer.jobs} completed bounties</span>
                </div>
              </div>
            </div>

            {/* Soulbound Token Reputation Badge */}
            {gig.buyer.sbt && (
              <SBTBadge count={gig.buyer.sbt.count} tier={gig.buyer.sbt.tier} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
