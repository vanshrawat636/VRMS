import { useState, useCallback, useReducer, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import CardStack from "./components/CardStack.jsx";
import CardSkeleton from "./components/CardSkeleton.jsx";
import ActionButtons from "./components/ActionButtons.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import NegotiationModal from "./components/NegotiationModal.jsx";
import ProfileView from "./components/ProfileView.jsx";
import SkillFilterBar from "./components/SkillFilterBar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import MarketTelemetry from "./components/MarketTelemetry.jsx";
import { useWallet } from "./hooks/useWallet.js";
import { MOCK_GIGS, ALL_SKILLS } from "./data/gigs.js";
import { track } from "./utils/analytics.js";
import {
  dealReducer,
  initialDealState,
  DEAL_ACTIONS,
  DEAL_STATES,
} from "./state/dealMachine.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  // ── Web3 MetaMask Wallet ───────────────────────────────────────────────────
  const wallet = useWallet();

  // ── Auth State ───────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sg_user")); } catch { return null; }
  });
  const [role, setRole] = useState(() => localStorage.getItem("sg_role") || null);

  const handleEnter = (u, r) => {
    setUser(u);
    setRole(r);
  };

  const handleLogout = () => {
    localStorage.removeItem("sg_user");
    localStorage.removeItem("sg_role");
    setUser(null);
    setRole(null);
  };

  // ── Gigs & Feed loading state ───────────────────────────────────────────────
  const [gigs, setGigs] = useState(MOCK_GIGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  const fetchGigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_URL}/gigs`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setGigs(data);
        setIsLiveBackend(true);
      } else {
        setGigs(MOCK_GIGS);
        setIsLiveBackend(false);
      }
    } catch (err) {
      console.info("Backend offline or unreachable, seamlessly running in offline demo mode with local AI.");
      setGigs(MOCK_GIGS);
      setIsLiveBackend(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // ── Core swiping state ──────────────────────────────────────────────────────
  const [swipedIds, setSwipedIds] = useState(new Set());
  const [swipedHistory, setSwipedHistory] = useState([]);
  const [matched, setMatched] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [direction, setDirection] = useState(1);
  const [completedDeals, setCompletedDeals] = useState([]);

  // ── Skill & Category Filters ─────────────────────────────────────────────────
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Remaining unswiped gigs, filtered by active skill/category selections
  const filteredGigs = useMemo(() => {
    return gigs.filter((g) => {
      if (swipedIds.has(g.id)) return false;
      if (selectedCategory && g.category !== selectedCategory) return false;
      if (selectedSkills.length > 0 && !selectedSkills.every((s) => g.skills.includes(s)))
        return false;
      return true;
    });
  }, [gigs, swipedIds, selectedSkills, selectedCategory]);

  // Skills to show in the filter bar
  const visibleSkills = useMemo(() => {
    const base = selectedCategory
      ? gigs.filter((g) => g.category === selectedCategory)
      : gigs;
    const skillSet = new Set(base.flatMap((g) => g.skills));
    return ALL_SKILLS.filter((s) => skillSet.has(s));
  }, [gigs, selectedCategory]);

  // ── Budget Settings ──────────────────────────────────────────────────────────
  const [userBudget, setUserBudget] = useState({ min: 1000, max: 3000 });

  // ── Navigation & Modals ──────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState("feed");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ── Deal State Machine ───────────────────────────────────────────────────────
  const [dealState, dispatch] = useReducer(dealReducer, initialDealState);

  // Sync completed deal into persistent list
  useEffect(() => {
    if (dealState.status === DEAL_STATES.COMPLETED && dealState.completedDeal) {
      setCompletedDeals((prev) => {
        const exists = prev.some((d) => d.id === dealState.completedDeal.id);
        if (exists) return prev;
        return [dealState.completedDeal, ...prev];
      });
    }
  }, [dealState.status, dealState.completedDeal]);

  // ── Swipe Handler with Analytics ─────────────────────────────────────────────
  const handleSwipe = useCallback(
    (dir) => {
      const top = filteredGigs[0];
      if (!top) return;
      setDirection(dir);
      setSwipedIds((prev) => new Set([...prev, top.id]));
      setSwipedHistory((prev) => [...prev, { gig: top, dir }]);

      // Analytics event: gig_swiped
      track("gig_swiped", {
        gig_id: top.id,
        direction: dir === 1 ? "right" : "left",
        title: top.title,
        budget: top.budget,
      });

      if (dir === 1) {
        setMatched((m) => [...m, top]);
        // Analytics event: deal_started
        track("deal_started", {
          gig_id: top.id,
          user_min_budget: userBudget.min,
          user_max_budget: userBudget.max,
        });

        dispatch({
          type: DEAL_ACTIONS.START_NEGOTIATION,
          payload: { gig: top, userBudget },
        });
      } else {
        setSkipped((s) => [...s, top]);
      }
    },
    [filteredGigs, userBudget]
  );

  // ── Skill Filter Handlers ────────────────────────────────────────────────────
  const handleToggleSkill = useCallback((skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }, []);

  const handleToggleCategory = useCallback((cat) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
    setSelectedSkills([]);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedSkills([]);
    setSelectedCategory(null);
  }, []);

  // ── Rewind / Undo Handler ───────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (swipedHistory.length === 0) return;
    const last = swipedHistory[swipedHistory.length - 1];
    setSwipedHistory((prev) => prev.slice(0, -1));
    setSwipedIds((prev) => {
      const next = new Set(prev);
      next.delete(last.gig.id);
      return next;
    });
    if (last.dir === 1) {
      setMatched((m) => m.filter((g) => g.id !== last.gig.id));
    } else {
      setSkipped((s) => s.filter((g) => g.id !== last.gig.id));
    }
  }, [swipedHistory]);

  // ── Global Keyboard Shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when modal is open or when typing in input
      if (isSettingsOpen || isNegotiationOpen || !user) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSwipe(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSwipe(1);
      } else if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe, handleUndo, isSettingsOpen, isNegotiationOpen, user]);

  // ── Reset ────────────────────────────────────────────────────────────────────
  const reset = () => {
    setSwipedIds(new Set());
    setSwipedHistory([]);
    setMatched([]);
    setSkipped([]);
    setSelectedSkills([]);
    setSelectedCategory(null);
  };

  const handleCloseNegotiation = () => dispatch({ type: DEAL_ACTIONS.RESET_DEAL });
  const handleViewProfileFromModal = () => {
    dispatch({ type: DEAL_ACTIONS.RESET_DEAL });
    setCurrentView("profile");
  };

  const empty = filteredGigs.length === 0;
  const isNegotiationOpen = dealState.status !== DEAL_STATES.IDLE;
  const hasActiveFilter = selectedSkills.length > 0 || !!selectedCategory;
  const totalUnswiped = gigs.filter((g) => !swipedIds.has(g.id)).length;

  return (
    <>
      {/* ── Landing / Auth Gate ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!user && <LandingPage key="landing" onEnter={handleEnter} />}
      </AnimatePresence>

    <div className="flex min-h-screen flex-col overflow-x-hidden bg-grid-subtle">
      {/* ── Global Header ─────────────────────────────────────────────────────── */}
      <Header
        matched={matched.length}
        skipped={skipped.length}
        completedCount={completedDeals.length}
        currentView={currentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleProfile={(view) => setCurrentView(view)}
        wallet={wallet}
        isLiveBackend={isLiveBackend}
        onRefreshBackend={fetchGigs}
        role={role}
      />

      {/* ── Main View Router ──────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col py-4 sm:py-5">
        <AnimatePresence mode="wait">
          {currentView === "profile" ? (
            <ProfileView
              key="profile"
              completedDeals={completedDeals}
              savedGigs={matched}
              budget={userBudget}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onBackToFeed={() => setCurrentView("feed")}
            />
          ) : (
            <div key="feed" className="flex flex-1 flex-col items-center justify-center w-full max-w-7xl mx-auto px-3 sm:px-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full py-2">
                {/* Center Swiping Arena */}
                <div className="flex flex-col items-center w-full max-w-[460px]">
                  {/* ── Skill & Category Filter Bar ─────────────────────────────── */}
                  <SkillFilterBar
                    skills={visibleSkills}
                    selectedSkills={selectedSkills}
                    selectedCategory={selectedCategory}
                    onToggleSkill={handleToggleSkill}
                    onToggleCategory={handleToggleCategory}
                    onClearAll={handleClearAll}
                    totalGigs={totalUnswiped}
                    filteredCount={filteredGigs.length}
                  />

              {/* ── Feed Content: Loading Skeleton or Card Feed ── */}
              {isLoading ? (
                <CardSkeleton />
              ) : empty ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-4 flex h-[520px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-ink-900/50 p-8 text-center"
                >
                  {hasActiveFilter ? (
                    <>
                      <div className="text-4xl">🔍</div>
                      <h2 className="mt-4 text-xl font-bold text-white">No gigs match your filters</h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        Try removing some skill or category filters to see more gigs.
                      </p>
                      <button
                        onClick={handleClearAll}
                        className="mt-5 min-h-[44px] rounded-full border border-white/10 bg-ink-800 px-5 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-ink-700 hover:text-white"
                      >
                        Clear All Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl">✨</div>
                      <h2 className="mt-4 text-xl font-bold text-white">You're all caught up</h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        {matched.length} gig{matched.length === 1 ? "" : "s"} saved ·{" "}
                        {completedDeals.length} deal{completedDeals.length === 1 ? "" : "s"} completed.
                      </p>
                      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                        <button
                          onClick={reset}
                          className="min-h-[44px] rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-soft"
                        >
                          Reload Demo Gigs
                        </button>
                        {completedDeals.length > 0 && (
                          <button
                            onClick={() => setCurrentView("profile")}
                            className="min-h-[44px] rounded-full border border-white/10 bg-ink-800 px-6 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-ink-700 hover:text-white"
                          >
                            View Profile & SBTs
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <>
                  <CardStack
                    gigs={filteredGigs}
                    direction={direction}
                    onSwipe={handleSwipe}
                    onSkillClick={handleToggleSkill}
                    activeSkills={selectedSkills}
                  />
                  <ActionButtons
                    onSkip={() => handleSwipe(-1)}
                    onApply={() => handleSwipe(1)}
                    onUndo={handleUndo}
                    canUndo={swipedHistory.length > 0}
                    disabled={empty}
                  />
                </>
              )}
            </div>

            {/* Right Desktop Protocol Telemetry Sidebar */}
            <MarketTelemetry
              matchedCount={matched.length}
              completedCount={completedDeals.length}
              userBudget={userBudget}
              onOpenSettings={() => setIsSettingsOpen(true)}
              wallet={wallet}
            />
          </div>
        </div>
      )}
        </AnimatePresence>
      </main>

      {/* ── Settings Modal ────────────────────────────────────────────────────── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        budget={userBudget}
        onSave={(newBudget) => setUserBudget(newBudget)}
        onLogout={handleLogout}
        user={user}
        role={role}
        wallet={wallet}
      />

      {/* ── Full-Screen Negotiation & Escrow Modal ────────────────────────────── */}
      <NegotiationModal
        isOpen={isNegotiationOpen}
        dealState={dealState}
        dispatch={dispatch}
        onClose={handleCloseNegotiation}
        onViewProfile={handleViewProfileFromModal}
      />
      </div>
    </>
  );
}
