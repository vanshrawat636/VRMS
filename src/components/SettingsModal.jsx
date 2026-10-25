import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarterManual from "./StarterManual.jsx";
import WalletButton from "./WalletButton.jsx";

export default function SettingsModal({
  isOpen,
  onClose,
  budget,
  onSave,
  onLogout,
  user,
  role,
  wallet,
}) {
  const [showManual, setShowManual] = useState(false);
  const [min, setMin] = useState(budget.min);
  const [max, setMax] = useState(budget.max);
  const [minError, setMinError] = useState("");
  const [maxError, setMaxError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMin(budget.min);
      setMax(budget.max);
      setMinError("");
      setMaxError("");
      setGeneralError("");
      setShowManual(false);
    }
  }, [isOpen, budget]);

  const validate = (minVal, maxVal) => {
    let hasErr = false;
    setMinError("");
    setMaxError("");
    setGeneralError("");

    if (isNaN(minVal) || minVal === "") {
      setMinError("Please enter a valid numeric value.");
      hasErr = true;
    } else if (minVal <= 0) {
      setMinError("Minimum budget must be greater than 0 USDC.");
      hasErr = true;
    }

    if (isNaN(maxVal) || maxVal === "") {
      setMaxError("Please enter a valid numeric value.");
      hasErr = true;
    } else if (maxVal <= 0) {
      setMaxError("Maximum target must be greater than 0 USDC.");
      hasErr = true;
    } else if (maxVal > 1_000_000) {
      setMaxError("Maximum budget cannot exceed 1,000,000 USDC.");
      hasErr = true;
    }

    if (!hasErr && minVal > maxVal) {
      setGeneralError("Minimum floor cannot exceed maximum target budget.");
      hasErr = true;
    }

    return !hasErr;
  };

  const handleMinChange = (val) => {
    setMin(val);
    const nMin = Number(val);
    const nMax = Number(max);
    if (!isNaN(nMin) && !isNaN(nMax) && nMin > nMax && nMin > 0 && nMax > 0) {
      setGeneralError("Minimum floor cannot exceed maximum target budget.");
    } else {
      setGeneralError("");
    }
    if (nMin <= 0 && val !== "") {
      setMinError("Minimum budget must be greater than 0 USDC.");
    } else {
      setMinError("");
    }
  };

  const handleMaxChange = (val) => {
    setMax(val);
    const nMin = Number(min);
    const nMax = Number(val);
    if (!isNaN(nMin) && !isNaN(nMax) && nMin > nMax && nMin > 0 && nMax > 0) {
      setGeneralError("Minimum floor cannot exceed maximum target budget.");
    } else {
      setGeneralError("");
    }
    if (nMax <= 0 && val !== "") {
      setMaxError("Maximum target must be greater than 0 USDC.");
    } else if (nMax > 1_000_000) {
      setMaxError("Maximum budget cannot exceed 1,000,000 USDC.");
    } else {
      setMaxError("");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const minVal = Number(min);
    const maxVal = Number(max);

    if (!validate(minVal, maxVal)) {
      return;
    }

    onSave({ min: minVal, max: maxVal });
    onClose();
  };

  const handleReset = () => {
    setMin(1000);
    setMax(3000);
    setMinError("");
    setMaxError("");
    setGeneralError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 p-6 sm:p-7"
          >
            {showManual ? (
              <StarterManual onClose={() => setShowManual(false)} />
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-zinc-300">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Settings</h3>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      Agent budget · Starter Manual · Web3 & Account
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label="Close settings"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Account / User Card */}
                {user && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/60 p-3.5">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full border border-white/20 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-sm border border-white/10">
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">{user.name}</span>
                          <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300 uppercase">
                            {role === "client" ? "Client" : "Freelancer"}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">{user.email}</span>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      id="btn-logout"
                      className="min-h-[44px] sm:min-h-0 flex items-center rounded-xl border border-rose-500/30 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                      title="Log out of current session"
                    >
                      Log out
                    </button>
                  </div>
                )}

                {/* Starter Manual Card Promo */}
                <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 text-zinc-300">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Starter Manual</h4>
                        <p className="text-[11px] text-zinc-400">
                          Interactive walkthrough of Tinder swiping, AI negotiation & escrows
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowManual(true)}
                      id="btn-open-starter-manual"
                      className="min-h-[44px] flex items-center rounded-xl border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Open Guide
                    </button>
                  </div>
                </div>

                {/* Web3 / MetaMask Wallet Section */}
                <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">MetaMask Wallet</span>
                        {wallet?.address && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {wallet?.address
                          ? `${wallet.shortAddress} · ${wallet.balance || "0"} ETH`
                          : "Connect your Web3 wallet for smart contract escrow"}
                      </p>
                    </div>
                    {wallet && <WalletButton wallet={wallet} />}
                  </div>
                </div>

                {/* Form: Hidden AI Budget */}
                <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-bold text-white">Private AI Negotiation Budget</span>
                    <p className="mt-0.5 text-[11px] text-zinc-400">
                      Your autonomous agent uses this range to make counter-offers without revealing your limit.
                    </p>
                  </div>

                  {/* Min Budget Field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="min-budget"
                      className="flex items-center justify-between text-xs font-medium text-zinc-300"
                    >
                      <span>Minimum Floor (Acceptable)</span>
                      <span className="font-mono text-xs text-zinc-400">USDC</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500">
                        $
                      </span>
                      <input
                        id="min-budget"
                        type="number"
                        min="1"
                        max="1000000"
                        step="50"
                        value={min}
                        onChange={(e) => handleMinChange(e.target.value)}
                        className={`w-full rounded-xl border bg-zinc-950 py-2.5 pl-8 pr-4 text-xs font-medium text-white transition focus:outline-none ${
                          minError || generalError
                            ? "border-rose-500/80 focus:border-rose-400"
                            : "border-white/10 focus:border-brand-500"
                        }`}
                        placeholder="e.g. 1000"
                      />
                    </div>
                    {minError && (
                      <p className="text-[11px] font-medium text-rose-400">{minError}</p>
                    )}
                  </div>

                  {/* Max Budget Field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="max-budget"
                      className="flex items-center justify-between text-xs font-medium text-zinc-300"
                    >
                      <span>Maximum Target (Ceiling)</span>
                      <span className="font-mono text-xs text-zinc-400">USDC</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500">
                        $
                      </span>
                      <input
                        id="max-budget"
                        type="number"
                        min="1"
                        max="1000000"
                        step="50"
                        value={max}
                        onChange={(e) => handleMaxChange(e.target.value)}
                        className={`w-full rounded-xl border bg-zinc-950 py-2.5 pl-8 pr-4 text-xs font-medium text-white transition focus:outline-none ${
                          maxError || generalError
                            ? "border-rose-500/80 focus:border-rose-400"
                            : "border-white/10 focus:border-brand-500"
                        }`}
                        placeholder="e.g. 3000"
                      />
                    </div>
                    {maxError && (
                      <p className="text-[11px] font-medium text-rose-400">{maxError}</p>
                    )}
                  </div>

                  {/* Cross-field validation error */}
                  {generalError && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-[11px] font-medium text-rose-400">
                      {generalError}
                    </div>
                  )}

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Quick Presets
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMin(500);
                          setMax(1500);
                        }}
                        className="rounded-xl border border-white/10 bg-zinc-800/40 py-2 text-center text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                      >
                        $500 – $1.5k
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMin(1000);
                          setMax(3000);
                        }}
                        className="rounded-xl border border-white/10 bg-zinc-800/40 py-2 text-center text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                      >
                        $1k – $3k
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMin(3000);
                          setMax(8000);
                        }}
                        className="rounded-xl border border-white/10 bg-zinc-800/40 py-2 text-center text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                      >
                        $3k – $8k
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-2 flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="min-h-[44px] rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Reset Defaults
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="min-h-[44px] rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="min-h-[44px] rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
