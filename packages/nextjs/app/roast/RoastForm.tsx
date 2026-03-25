"use client";

import React, { useEffect, useState } from "react";
import { useScaffoldWriteContract, useUserBatches } from "~~/hooks/scaffold-eth";

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

export default function RoastForm() {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });
  const { batches, isLoading: batchesLoading } = useUserBatches();

  const [batchId, setBatchId] = useState("");
  const [roastingMethod, setRoastingMethod] = useState("0");
  const [beforeWeight, setBeforeWeight] = useState("");
  const [afterWeight, setAfterWeight] = useState("");
  const [roastLevel, setRoastLevel] = useState("0");
  const [cuppingNotes, setCuppingNotes] = useState("");
  const [transportTime, setTransportTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-fill before weight when batch is selected
  useEffect(() => {
    if (batchId && batches) {
      const selectedBatch = batches.find(b => b.batchId.toString() === batchId);
      if (selectedBatch) {
        setBeforeWeight(selectedBatch.processingAfterWeight.toString());
      }
    }
  }, [batchId, batches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      await writeContractAsync({
        functionName: "roastBatch",
        args: [
          BigInt(batchId || "0"),
          Number(roastingMethod),
          BigInt(beforeWeight || "0"),
          BigInt(afterWeight || "0"),
          Number(roastLevel),
          cuppingNotes,
          Number(transportTime || 0),
        ],
      });

      setStatus("success");
      setBatchId("");
      setRoastingMethod("0");
      setBeforeWeight("");
      setAfterWeight("");
      setRoastLevel("0");
      setCuppingNotes("");
      setTransportTime("");
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
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Select Batch to Roast</label>
        {batchesLoading ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              border: `1px solid ${colors.coffeeParchment}`,
              background: "#fff",
              color: colors.textMuted,
            }}
          >
            Loading your batches...
          </div>
        ) : batches && batches.length > 0 ? (
          <select value={batchId} onChange={e => setBatchId(e.target.value)} style={inputStyle}>
            <option value="">Select a batch...</option>
            {batches
              .filter(
                batch =>
                  batch.processor !== "0x0000000000000000000000000000000000000000" &&
                  batch.roaster === "0x0000000000000000000000000000000000000000",
              ) // Only show processed but unroasted batches
              .map(batch => (
                <option key={batch.batchId.toString()} value={batch.batchId.toString()}>
                  #{batch.batchId.toString()} - {batch.batchNumber} ({batch.farmName})
                </option>
              ))}
          </select>
        ) : (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              border: `1px solid ${colors.coffeeParchment}`,
              background: "#fff",
              color: colors.textMuted,
            }}
          >
            No batches available. Please process a batch first.
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Roasting Method</label>
        <select value={roastingMethod} onChange={e => setRoastingMethod(e.target.value)} style={inputStyle}>
          <option value="0">Drum</option>
          <option value="1">HotAir</option>
          <option value="2">FluidBed</option>
          <option value="3">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Before Weight (kg)</label>
        <input
          type="number"
          step="0.01"
          value={beforeWeight}
          onChange={e => setBeforeWeight(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>After Weight (kg)</label>
        <input
          type="number"
          step="0.01"
          value={afterWeight}
          onChange={e => setAfterWeight(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Roast Level</label>
        <select value={roastLevel} onChange={e => setRoastLevel(e.target.value)} style={inputStyle}>
          <option value="0">Light</option>
          <option value="1">Medium</option>
          <option value="2">Dark</option>
          <option value="3">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Cupping Notes</label>
        <textarea
          value={cuppingNotes}
          onChange={e => setCuppingNotes(e.target.value)}
          style={{ ...inputStyle, minHeight: 100 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Transport Time (minutes)</label>
        <input
          type="number"
          value={transportTime}
          onChange={e => setTransportTime(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <button type="submit" disabled={isMining || status === "sending"} style={btnStyle}>
          {isMining || status === "sending" ? "Submitting..." : "Record roasting"}
        </button>
        {status === "success" && <span style={{ color: colors.greenDark, fontWeight: 600 }}>Roast recorded ✓</span>}
        {status === "error" && <span style={{ color: "#a33", fontWeight: 600 }}>Error: {errorMsg}</span>}
      </div>
    </form>
  );
}
