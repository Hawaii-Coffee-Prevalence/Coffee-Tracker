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

const HarvestPage: NextPage = () => {
  const [form, setForm] = useState({
    batchNumber: "",
    farmName: "",
    region: "0",
    variety: "0",
    elevation: "",
    harvestWeight: "",
    harvestDate: "",
  });

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
            Farmer
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 500, color: colors.coffeeDark, margin: 0 }}>Record a harvest</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            Submit a new coffee batch to the blockchain with your farm and harvest details.
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
          {[
            { label: "Batch number", key: "batchNumber", placeholder: "e.g. KON-2024-001" },
            { label: "Farm name", key: "farmName", placeholder: "e.g. Greenwell Farms" },
            { label: "Elevation (ft)", key: "elevation", placeholder: "e.g. 2200" },
            { label: "Harvest weight (kg)", key: "harvestWeight", placeholder: "e.g. 500" },
            { label: "Harvest date", key: "harvestDate", placeholder: "YYYY-MM-DD" },
          ].map(field => (
            <div key={field.key}>
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
                {field.label}
              </label>
              <input
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
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
          ))}

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
              Region
            </label>
            <select
              value={form.region}
              onChange={e => setForm({ ...form, region: e.target.value })}
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
              }}
            >
              <option value="0">Kona</option>
              <option value="1">Ka&apos;u</option>
              <option value="2">Hamakua</option>
              <option value="3">Puna</option>
              <option value="4">Kauai</option>
              <option value="5">Maui</option>
            </select>
          </div>

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
              Variety
            </label>
            <select
              value={form.variety}
              onChange={e => setForm({ ...form, variety: e.target.value })}
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
              }}
            >
              <option value="0">Typica</option>
              <option value="1">Bourbon</option>
              <option value="2">Catuai</option>
              <option value="3">Mundo Novo</option>
            </select>
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
            Submit harvest →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HarvestPage;
