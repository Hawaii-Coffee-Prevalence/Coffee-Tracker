"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={`flex flex-col min-h-screen`}>
        {/* Top banner */}
        <div
          style={{
            background: "#1A2E1A",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7AB87A" }} />
            <span
              style={{
                color: "#F5ECD7",
                fontSize: 14,
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "0.05em",
              }}
            >
              Coffee Tracker
            </span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#9FD09F" }}>
            <Link href="/" style={{ color: "#C4E8C4", textDecoration: "none" }}>
              Home
            </Link>
            <Link href="/debug" style={{ color: "#C4E8C4", textDecoration: "none" }}>
              Debug Contracts
            </Link>
            <Link href="/blockexplorer" style={{ color: "#C4E8C4", textDecoration: "none" }}>
              Block Explorer
            </Link>
          </div>
        </div>

        <main className="relative flex flex-col flex-1">{children}</main>

        {/* Bottom banner */}
        <div style={{ background: "#2D4A2D", padding: "12px 24px", textAlign: "center" }}>
          <span style={{ color: "#7AB87A", fontSize: 12, fontFamily: "'Playfair Display', serif" }}>
            Hawaii Coffee Tracker — Built on Ethereum
          </span>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ProgressBar height="3px" color="#2299dd" />
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
