"use client";

import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const colors = {
  coffeeDark: "#2C1A0E",
  coffeeMid: "#6B3A2A",
  coffeeLight: "#C4956A",
  coffeeCream: "#F5ECD7",
  coffeeParchment: "#EDE0C4",
  greenDark: "#2D4A2D",
  greenMid: "#4A7C4A",
  greenLight: "#7AB87A",
  textMuted: "#9B7B5C",
};

export default function HarvestForm() {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });

  const [batchNumber, setBatchNumber] = useState("");
  const [farmName, setFarmName] = useState("");
  const [region, setRegion] = useState("0");
  const [variety, setVariety] = useState("0");
  const [elevation, setElevation] = useState("");
  const [harvestWeight, setHarvestWeight] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const parsedDate = harvestDate ? new Date(harvestDate) : new Date("1970-01-01");
      const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date("1970-01-01") : parsedDate;
      const harvestTimestamp = BigInt(Math.floor(safeDate.getTime() / 1000));

      await writeContractAsync({
        functionName: "harvestBatch",
        args: [
          batchNumber,
          farmName,
          Number(region),
          Number(variety),
          Number(elevation || 0),
          BigInt(Number(harvestWeight || 0)),
          harvestTimestamp,
        ],
      });

      setStatus("success");
      // reset
      setBatchNumber("");
      setFarmName("");
      setRegion("0");
      setVariety("0");
      setElevation("");
      setHarvestWeight("");
      setHarvestDate("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: colors.textMuted,
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${colors.coffeeParchment}`,
    background: "#fff",
    color: colors.coffeeDark,
    boxShadow: colors.coffeeLight,
  };

  const formStyle: React.CSSProperties = {
    maxWidth: 680,
    margin: "0 auto",
  };

  const btnStyle: React.CSSProperties = {
    background: colors.coffeeDark,
    color: colors.coffeeCream,
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Batch Number</label>
        <input
          value={batchNumber}
          onChange={e => setBatchNumber(e.target.value)}
          placeholder="e.g. BATCH-001"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Farm Name</label>
        <input
          value={farmName}
          onChange={e => setFarmName(e.target.value)}
          placeholder="e.g. Kona Sunrise"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Region</label>
        <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
          <option value="0">Kona</option>
          <option value="1">Kau</option>
          <option value="2">Puna</option>
          <option value="3">Hamakua</option>
          <option value="4">Maui</option>
          <option value="5">Kauai</option>
          <option value="6">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Variety</label>
        <select value={variety} onChange={e => setVariety(e.target.value)} style={inputStyle}>
          <option value="0">Arabica</option>
          <option value="1">Geisha</option>
          <option value="2">Typica</option>
          <option value="3">Caturra</option>
          <option value="4">Catuai</option>
          <option value="5">MauiMokka</option>
          <option value="6">Bourbon</option>
          <option value="7">Peaberry</option>
          <option value="8">Maragogype</option>
          <option value="9">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Elevation (m)</label>
        <input
          type="number"
          value={elevation}
          onChange={e => setElevation(e.target.value)}
          placeholder="e.g. 1200"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Harvest Weight (kg)</label>
        <input
          type="number"
          value={harvestWeight}
          onChange={e => setHarvestWeight(e.target.value)}
          placeholder="e.g. 520"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Harvest Date (YYYY-MM-DD)</label>
        <input
          type="text"
          value={harvestDate}
          onChange={e => setHarvestDate(e.target.value)}
          placeholder="2026-03-25"
          pattern="\d{4}-\d{2}-\d{2}"
          title="Enter date in format YYYY-MM-DD"
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <button type="submit" disabled={isMining || status === "sending"} style={btnStyle}>
          {isMining || status === "sending" ? "Submitting..." : "Submit Harvest"}
        </button>
        {status !== "idle" && (
          <span style={{ color: status === "success" ? colors.greenDark : "#a33", fontWeight: 600 }}>
            {status === "success" ? "Harvest recorded successfully!" : `Error: ${errorMsg}`}
          </span>
        )}
      </div>
    </form>
  );
}
