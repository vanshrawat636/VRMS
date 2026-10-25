import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_CATEGORIES } from "../data/gigs.js";

export default function SkillFilterBar({
  skills,
  selectedSkills,
  selectedCategory,
  onToggleSkill,
  onToggleCategory,
  onClearAll,
  totalGigs,
  filteredCount,
}) {
  const skillsScrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!selectedSkills.length) return;
    const last = selectedSkills[selectedSkills.length - 1];
    const el = document.getElementById(`skill-pill-${CSS.escape(last)}`);
    el?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [selectedSkills]);

  const hasActiveFilter = selectedSkills.length > 0 || selectedCategory;

  const filteredSkillsList = searchQuery.trim()
    ? skills.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    : skills;

  return (
    <div className="mx-auto w-full max-w-[450px] space-y-2.5 pb-2">
      {/* Category Chips Bar with Search Toggle */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {/* Search Toggle Icon */}
        <button
          onClick={() => setShowSearch((p) => !p)}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
            showSearch || searchQuery
              ? "border-brand-500 bg-brand-500/20 text-brand-300"
              : "border-white/[0.08] bg-ink-900/60 text-zinc-400 hover:text-white"
          }`}
          title="Search skills"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* All Reset */}
        <button
          onClick={onClearAll}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            !hasActiveFilter
              ? "border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-500/30"
              : "border-white/[0.08] bg-ink-900/60 text-zinc-400 hover:border-white/20 hover:text-white"
          }`}
        >
          All Categories
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? "border-brand-400 bg-brand-500/20 text-brand-200 shadow-sm"
                  : "border-white/[0.08] bg-ink-900/60 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Input Bar (revealed on click) */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by skill (e.g. Solidity, React, AI)..."
                className="w-full rounded-xl border border-white/10 bg-ink-900/90 py-1.5 pl-8 pr-7 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                autoFocus
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Pills Horizontal Row */}
      <div
        ref={skillsScrollRef}
        className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
      >
        {filteredSkillsList.map((skill) => {
          const active = selectedSkills.includes(skill);
          return (
            <button
              id={`skill-pill-${skill}`}
              key={skill}
              onClick={() => onToggleSkill(skill)}
              className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                active
                  ? "border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-500/30"
                  : "border-white/[0.08] bg-ink-900/60 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
            >
              {active && <span className="mr-1 text-[10px] font-bold">✓</span>}
              <span>{skill}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Summary Bar */}
      <AnimatePresence>
        {hasActiveFilter && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center justify-between rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 backdrop-blur-md"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedCategory && (
                <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-200">
                  <span>{selectedCategory}</span>
                  <button
                    onClick={() => onToggleCategory(selectedCategory)}
                    className="ml-0.5 text-zinc-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSkills.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 rounded-md border border-brand-500/30 bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-300"
                >
                  <span>{s}</span>
                  <button
                    onClick={() => onToggleSkill(s)}
                    className="ml-0.5 text-brand-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold text-zinc-400">
                {filteredCount} of {totalGigs}
              </span>
              <button
                onClick={onClearAll}
                className="text-[10px] font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-2"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
