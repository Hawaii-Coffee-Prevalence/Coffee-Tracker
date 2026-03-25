"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";

const colors = {
  coffeeDark: "#1A0A05",
  coffeeMid: "#4A2010",
  coffeeLight: "#B8845A",
  coffeeCream: "#F5ECD7",
  coffeeParchment: "#EDE0C4",
  greenDark: "#1A2E1A",
  greenLight: "#6AA86A",
  greenPale: "#E8F2E8",
  textMuted: "#8A6B4C",
};

const DistributePage: NextPage = () => {
  const [form, setForm] = useState({ batchId: "" });

  return (
    <div
      style={{
        background: colors.coffeeCream,
        minHeight: "100vh",
        fontFamily: "'Playfair Display', serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: colors.coffeeLight,
            fontSize: 13,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 24,
          }}
        >
          ← Back
        </Link>

        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: colors.greenDark,
              marginBottom: 8,
            }}
          >
            Distributor
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 500, color: colors.coffeeDark, margin: 0 }}>Distribute batch</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            Mark a roasted batch as distributed and finalize the supply chain record.
          </p>
        </div>

        <div
          style={{
            background: "#FAF4E8",
            border: `1px solid #D4B896`,
            borderRadius: 16,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                display: "block",
                marginBottom: 6,
              }}
            >
              Batch ID
            </label>
            <input
              placeholder="e.g. 1"
              value={form.batchId}
              onChange={e => setForm({ batchId: e.target.value })}
              style={{
                width: "100%",
                background: colors.coffeeCream,
                border: `1px solid #D4B896`,
                borderRadius: 8,
                padding: "10px 14px",
                color: colors.coffeeDark,
                fontSize: 14,
                fontFamily: "'Playfair Display', serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{ background: colors.coffeeParchment, border: `1px solid #D4B896`, borderRadius: 8, padding: 16 }}
          >
            <p style={{ fontSize: 13, color: colors.textMuted, margin: 0, lineHeight: 1.6 }}>
              This will mark the batch as distributed on-chain. Make sure the batch has been harvested, processed, and
              roasted before distributing.
            </p>
          </div>

          <button
            style={{
              marginTop: 8,
              background: colors.greenDark,
              border: `1px solid ${colors.greenLight}`,
              borderRadius: 8,
              padding: "12px 24px",
              color: colors.coffeeCream,
              fontSize: 14,
              fontFamily: "'Playfair Display', serif",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Distribute batch →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributePage;
