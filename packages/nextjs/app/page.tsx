"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

const colors = {
  coffeeDark: "#2C1A0E",
  coffeeMid: "#6B3A2A",
  coffeeLight: "#C4956A",
  coffeeCream: "#F5ECD7",
  coffeeParchment: "#EDE0C4",
  greenDark: "#2D4A2D",
  greenMid: "#4A7C4A",
  greenLight: "#7AB87A",
  greenPale: "#E8F2E8",
  textMuted: "#9B7B5C",
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const shortAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : "0x0000...0000";

  return (
    <div style={{ background: colors.coffeeCream, minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Stats bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: `1px solid ${colors.coffeeParchment}`,
        }}
      >
        {[
          { label: "Total batches", value: "0", sub: "on local network" },
          { label: "Your role", value: "—", sub: "connect wallet to view" },
          { label: "Network", value: targetNetwork.name, sub: `chain ${targetNetwork.id}` },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "18px 24px",
              background: "#F9F0E0",
              borderRight: i < 2 ? `1px solid ${colors.coffeeParchment}` : "none",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: colors.textMuted,
                marginBottom: 4,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: i === 0 ? 22 : 15,
                fontWeight: 500,
                color: colors.coffeeDark,
                paddingTop: i === 0 ? 0 : 4,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "44px 24px 36px",
          textAlign: "center",
          background: colors.coffeeCream,
          borderBottom: `1px solid ${colors.coffeeParchment}`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.greenDark,
            background: colors.greenPale,
            border: `1px solid ${colors.greenLight}`,
            padding: "4px 12px",
            borderRadius: 6,
            marginBottom: 18,
          }}
        >
          Hawaii Coffee Supply Chain
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: colors.coffeeDark, marginBottom: 10 }}>
          Track coffee from farm to cup
        </h1>
        <p style={{ fontSize: 14, color: colors.coffeeMid, maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.65 }}>
          A blockchain-based provenance system for Hawaiian coffee. Each batch is recorded on-chain across harvesting,
          processing, roasting, and distribution.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: colors.coffeeParchment,
            border: `1px solid #D4B896`,
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 13,
            color: colors.coffeeMid,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: colors.greenMid }} />
          <span>Connected address:</span>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: colors.coffeeDark }}>{shortAddress}</span>
        </div>
      </div>

      {/* Pipeline stages */}
      <div style={{ padding: "28px 24px", background: "#F2E6CC", borderBottom: `1px solid ${colors.coffeeParchment}` }}>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: colors.textMuted,
            marginBottom: 14,
          }}
        >
          Supply chain stages
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {[
            { icon: "🌱", name: "Harvest", desc: "Farm, region, variety, elevation", role: "Farmer", admin: false },
            { icon: "⚙️", name: "Process", desc: "Method, moisture, SCA score", role: "Processor", admin: false },
            { icon: "🔥", name: "Roast", desc: "Roast level, cupping notes", role: "Roaster", admin: false },
            {
              icon: "🚚",
              name: "Distribute",
              desc: "Final handoff, transport time",
              role: "Distributor",
              admin: false,
            },
            { icon: "✓", name: "Verify", desc: "Admin signs off on batch", role: "Admin", admin: true },
          ].map((stage, i) => (
            <div
              key={i}
              style={{
                background: colors.coffeeCream,
                border: `1px solid #D4B896`,
                borderRadius: 12,
                padding: "14px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 6 }}>{stage.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: colors.coffeeDark, marginBottom: 4 }}>
                {stage.name}
              </div>
              <div style={{ fontSize: 10, color: colors.textMuted, lineHeight: 1.4 }}>{stage.desc}</div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: stage.admin ? colors.coffeeCream : colors.greenPale,
                  color: stage.admin ? colors.coffeeMid : colors.greenDark,
                  border: `1px solid ${stage.admin ? colors.coffeeLight : colors.greenLight}`,
                }}
              >
                {stage.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "28px 24px",
          background: colors.coffeeCream,
          borderBottom: `1px solid ${colors.coffeeParchment}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: colors.textMuted,
            marginBottom: 14,
          }}
        >
          Actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            {
              title: "Record a harvest",
              role: "Farmer",
              desc: "Submit a new coffee batch with farm details, region, variety, and harvest weight.",
              href: "/harvest",
              roleStyle: {
                background: colors.greenPale,
                color: colors.greenDark,
                border: `1px solid ${colors.greenLight}`,
              },
            },
            {
              title: "Log processing",
              role: "Processor",
              desc: "Record processing method, moisture content, and SCA quality score.",
              href: "/process",
              roleStyle: { background: "#E8F0E8", color: "#2D4A2D", border: `1px solid ${colors.greenLight}` },
            },
            {
              title: "Log roasting",
              role: "Roaster",
              desc: "Add roast level, cupping notes, and before/after weights.",
              href: "/roast",
              roleStyle: {
                background: colors.coffeeCream,
                color: colors.coffeeMid,
                border: `1px solid ${colors.coffeeLight}`,
              },
            },
            {
              title: "Distribute batch",
              role: "Distributor",
              desc: "Mark a roasted batch as distributed and log transport time.",
              href: "/distribute",
              roleStyle: { background: colors.coffeeParchment, color: colors.coffeeDark, border: `1px solid #C4956A` },
            },
            {
              title: "Verify batch",
              role: "Admin",
              desc: "Admin role verifies the batch and finalizes provenance.",
              href: "/verify",
              roleStyle: {
                background: colors.coffeeCream,
                color: colors.coffeeDark,
                border: `1px solid ${colors.coffeeParchment}`,
              },
            },
          ].map((action, i) => (
            <Link key={i} href={action.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#FAF4E8",
                  border: `1px solid #D4B896`,
                  borderRadius: 12,
                  padding: 16,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: colors.coffeeDark }}>{action.title}</div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, ...action.roleStyle }}>
                    {action.role}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: colors.coffeeMid, lineHeight: 1.5 }}>{action.desc}</div>
                <div style={{ fontSize: 13, color: colors.coffeeLight, marginTop: 10 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: 20, background: colors.coffeeDark }}>
        <Link href="/debug" style={{ color: colors.coffeeLight, textDecoration: "none", fontSize: 13 }}>
          Debug contracts →
        </Link>
        <Link href="/blockexplorer" style={{ color: colors.coffeeLight, textDecoration: "none", fontSize: 13 }}>
          Block explorer →
        </Link>
      </div>
    </div>
  );
};

export default Home;
