"use client";

import React, { useState } from "react";
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

export default function VerifyForm() {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });
  const { batches, isLoading } = useUserBatches();
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Filter for batches that are not yet verified
  const availableBatches = batches?.filter(batch => !batch.verified) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      await writeContractAsync({ functionName: "verifyBatch", args: [BigInt(selectedBatchId || "0")] });
      setStatus("success");
      setSelectedBatchId("");
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
    maxWidth: 480,
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
        <label style={labelStyle}>Select Batch to Verify</label>
        <select
          value={selectedBatchId}
          onChange={e => setSelectedBatchId(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        >
          <option value="">
            {isLoading
              ? "Loading batches..."
              : availableBatches.length === 0
                ? "No batches available for verification"
                : "Select a batch"}
          </option>
          {availableBatches.map(batch => (
            <option key={batch.batchId.toString()} value={batch.batchId.toString()}>
              Batch #{batch.batchId.toString()} - {batch.farmName} ({Number(batch.harvestWeight)}kg)
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <button type="submit" disabled={isMining || status === "sending"} style={btnStyle}>
          {isMining || status === "sending" ? "Submitting..." : "Verify Batch"}
        </button>
        {status === "success" && <span style={{ color: colors.greenDark, fontWeight: 600 }}>Batch verified ✓</span>}
        {status === "error" && <span style={{ color: "#a33", fontWeight: 600 }}>Error: {errorMsg}</span>}
      </div>
    </form>
  );
}
