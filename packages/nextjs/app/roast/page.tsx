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

const RoastPage: NextPage = () => {
  const [form, setForm] = useState({
    batchId: "",
    roastingMethod: "0",
    beforeWeight: "",
    afterWeight: "",
    roastLevel: "0",
    cuppingNotes: "",
    transportTime: "",
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
            Roaster
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 500, color: colors.coffeeDark, margin: 0 }}>Log roasting</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            Record roast level, cupping notes, and weight loss for a processed batch.
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
            { label: "Batch ID", key: "batchId", placeholder: "e.g. 1" },
            { label: "Weight before roasting (kg)", key: "beforeWeight", placeholder: "e.g. 100" },
            { label: "Weight after roasting (kg)", key: "afterWeight", placeholder: "e.g. 85" },
            { label: "Transport time (hours)", key: "transportTime", placeholder: "e.g. 24" },
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
              Roasting method
            </label>
            <select
              value={form.roastingMethod}
              onChange={e => setForm({ ...form, roastingMethod: e.target.value })}
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
              <option value="0">Drum</option>
              <option value="1">Air</option>
              <option value="2">Fluid bed</option>
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
              Roast level
            </label>
            <select
              value={form.roastLevel}
              onChange={e => setForm({ ...form, roastLevel: e.target.value })}
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
              <option value="0">Light</option>
              <option value="1">Medium</option>
              <option value="2">Medium-dark</option>
              <option value="3">Dark</option>
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
              Cupping notes
            </label>
            <textarea
              placeholder="e.g. bright acidity, notes of chocolate and macadamia..."
              value={form.cuppingNotes}
              onChange={e => setForm({ ...form, cuppingNotes: e.target.value })}
              rows={3}
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
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
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
            Submit roast →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoastPage;
