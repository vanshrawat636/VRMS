import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MetaMaskFox = () => (
  <svg viewBox="0 0 35 33" className="h-4 w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25"/>
    <path d="M2.04858 1L15.0707 10.809L12.7395 4.99099L2.04858 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M28.2292 23.5334L24.6006 29.0334L32.2721 31.1469L34.4799 23.6501L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M0.533203 23.6501L2.72822 31.1469L10.3997 29.0334L6.77106 23.5334L0.533203 23.6501Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M9.96085 14.5149L7.8081 17.7851L15.4035 18.1284L15.1471 9.88306L9.96085 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M25.0381 14.5149L19.7707 9.79248L19.5904 18.1284L27.1858 17.7851L25.0381 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M10.3997 29.0334L14.9424 26.7833L11.0187 23.7001L10.3997 29.0334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M20.0635 26.7833L24.6006 29.0334L23.9873 23.7001L20.0635 26.7833Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
    <path d="M24.6006 29.0334L20.0635 26.7833L20.5284 30.7077L24.6006 29.0334Z" fill="#D56421" stroke="#D56421" strokeWidth="0.25"/>
    <path d="M10.3997 29.0334L14.4719 30.7077L14.9424 26.7833L10.3997 29.0334Z" fill="#D56421" stroke="#D56421" strokeWidth="0.25"/>
  </svg>
);

export default function WalletButton({ wallet }) {
  const {
    address,
    shortAddress,
    balance,
    chainId,
    networkName,
    isConnecting,
    isMetaMaskInstalled,
    error,
    connect,
    disconnect,
  } = wallet;

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = () => {
    if (!address) return "#";
    if (chainId === 11155111) return `https://sepolia.etherscan.io/address/${address}`;
    if (chainId === 1) return `https://etherscan.io/address/${address}`;
    if (chainId === 8453) return `https://basescan.org/address/${address}`;
    return `https://etherscan.io/address/${address}`;
  };

  if (!address) {
    return (
      <div className="relative">
        <button
          onClick={connect}
          disabled={isConnecting}
          id="btn-connect-wallet"
          title={isMetaMaskInstalled ? "Connect MetaMask Wallet" : "Install MetaMask"}
          className="flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300 shadow-sm transition hover:border-orange-500/60 hover:bg-orange-500/20 hover:text-orange-200 disabled:opacity-60"
        >
          {isConnecting ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin text-orange-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <MetaMaskFox />
              <span className="hidden sm:inline">Connect</span>
              <span>Wallet</span>
            </>
          )}
        </button>

        {error && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-red-500/30 bg-red-950/90 p-2.5 text-[11px] text-red-200 shadow-xl backdrop-blur-md z-50">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Connected Capsule */}
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        id="btn-wallet-connected"
        className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-ink-900/90 px-2.5 py-1 text-xs font-medium text-zinc-200 transition hover:border-emerald-500/50 hover:bg-ink-800"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <MetaMaskFox />
        <span className="font-mono text-zinc-300 font-semibold">{shortAddress}</span>
        {balance !== null && (
          <span className="hidden md:inline rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 font-semibold">
            {balance} ETH
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-zinc-900 p-4 shadow-xl z-50"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MetaMaskFox />
                <span className="text-xs font-bold text-white">MetaMask</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Connected
              </span>
            </div>

            {/* Address & Copy */}
            <div className="mt-3">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                Account Address
              </label>
              <div className="mt-1 flex items-center justify-between rounded-xl border border-white/5 bg-ink-950/70 p-2">
                <span className="font-mono text-xs text-zinc-300 truncate max-w-[170px]" title={address}>
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium text-zinc-200 transition hover:bg-white/20 hover:text-white"
                  title="Copy address"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Network & Balance */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-ink-950/50 p-2">
                <span className="block text-[10px] text-zinc-500">Network</span>
                <span className="mt-0.5 block font-semibold text-zinc-200 truncate">
                  {networkName || "Unknown"}
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-950/50 p-2">
                <span className="block text-[10px] text-zinc-500">Balance</span>
                <span className="mt-0.5 block font-semibold text-emerald-400 truncate">
                  {balance !== null ? `${balance} ETH` : "—"}
                </span>
              </div>
            </div>

            {/* Links and Disconnect */}
            <div className="mt-4 flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <a
                href={getExplorerUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>View on Explorer</span>
                <span>↗</span>
              </a>
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <span>Disconnect Wallet</span>
                <span>⏏</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
