import { useState, useEffect, useCallback } from "react";

const SUPPORTED_CHAINS = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
  31337: "Anvil / Localhost",
  1337: "Localhost",
  8453: "Base",
  42161: "Arbitrum One",
  137: "Polygon",
};

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isMetaMaskInstalled =
    typeof window !== "undefined" && !!(window.ethereum && (window.ethereum.isMetaMask || window.ethereum.providers?.some(p => p.isMetaMask)));

  const getEthereum = () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    if (window.ethereum.providers) {
      return window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum;
    }
    return window.ethereum;
  };

  const fetchBalance = useCallback(async (addr) => {
    const eth = getEthereum();
    if (!addr || !eth) return;
    try {
      const { ethers } = await import("ethers");
      const provider = new ethers.BrowserProvider(eth);
      const bal = await provider.getBalance(addr);
      setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    } catch (err) {
      console.warn("Failed to fetch balance:", err);
      setBalance(null);
    }
  }, []);

  const connect = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const hexChain = await eth.request({ method: "eth_chainId" });
      const addr = accounts[0];
      const cId = parseInt(hexChain, 16);

      setAddress(addr);
      setChainId(cId);
      localStorage.setItem("sg_wallet", addr);
      await fetchBalance(addr);
    } catch (err) {
      console.error("MetaMask connect error:", err);
      setError(
        err.code === 4001
          ? "Connection request rejected."
          : err.message || "Failed to connect MetaMask."
      );
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setError(null);
    localStorage.removeItem("sg_wallet");
  }, []);

  // Auto-reconnect if previously connected and authorized
  useEffect(() => {
    const saved = localStorage.getItem("sg_wallet");
    const eth = getEthereum();
    if (!saved || !eth) return;

    eth
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === saved.toLowerCase()) {
          setAddress(accounts[0]);
          eth
            .request({ method: "eth_chainId" })
            .then((hex) => setChainId(parseInt(hex, 16)))
            .catch(() => {});
          fetchBalance(accounts[0]);
        }
      })
      .catch(() => {});
  }, [fetchBalance]);

  // Listen for accounts & chain change events
  useEffect(() => {
    const eth = getEthereum();
    if (!eth || !eth.on) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        localStorage.setItem("sg_wallet", accounts[0]);
        fetchBalance(accounts[0]);
      }
    };

    const handleChainChanged = (hexChain) => {
      setChainId(parseInt(hexChain, 16));
      if (address) {
        fetchBalance(address);
      }
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      if (eth.removeListener) {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [address, disconnect, fetchBalance]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const networkName = chainId ? SUPPORTED_CHAINS[chainId] || `Chain ID ${chainId}` : null;
  const isCorrectNetwork = chainId === 11155111 || chainId === 31337 || chainId === 1337 || chainId === 1;

  return {
    address,
    shortAddress,
    balance,
    chainId,
    networkName,
    isCorrectNetwork,
    isConnecting,
    isMetaMaskInstalled: !!getEthereum(),
    error,
    connect,
    disconnect,
  };
}
