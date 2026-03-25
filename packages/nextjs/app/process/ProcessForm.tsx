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

export default function ProcessForm() {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });
  const { batches, isLoading: batchesLoading } = useUserBatches();

  const [batchId, setBatchId] = useState("");
  const [processingMethod, setProcessingMethod] = useState("0");
  const [beforeWeight, setBeforeWeight] = useState("");
  const [afterWeight, setAfterWeight] = useState("");
  const [moistureContent, setMoistureContent] = useState("");
  const [scaScore, setScaScore] = useState("");
  const [humidity, setHumidity] = useState("");
  const [dryTemp, setDryTemp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-fill before weight when batch is selected
  useEffect(() => {
    if (batchId && batches) {
      const selectedBatch = batches.find(b => b.batchId.toString() === batchId);
      if (selectedBatch) {
        setBeforeWeight(selectedBatch.harvestWeight.toString());
      }
    }
  }, [batchId, batches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await writeContractAsync({
        functionName: "processBatch",
        args: [
          BigInt(batchId || "0"),
          Number(processingMethod),
          BigInt(beforeWeight || "0"),
          BigInt(afterWeight || "0"),
          Number(moistureContent || 0),
          Number(scaScore || 0),
          Number(humidity || 0),
          Number(dryTemp || 0),
        ],
      });

      setStatus("success");
      // reset
      setBatchId("");
      setProcessingMethod("0");
      setBeforeWeight("");
      setAfterWeight("");
      setMoistureContent("");
      setScaScore("");
      setHumidity("");
      setDryTemp("");
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
        <label style={labelStyle}>Select Batch to Process</label>
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
              .filter(batch => batch.processor === "0x0000000000000000000000000000000000000000") // Only show unprocessed batches
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
            No batches available. Please harvest a batch first.
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Processing Method</label>
        <select value={processingMethod} onChange={e => setProcessingMethod(e.target.value)} style={inputStyle}>
          <option value="0">Natural</option>
          <option value="1">Washed</option>
          <option value="2">Honey</option>
          <option value="3">Anaerobic</option>
          <option value="4">Other</option>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Moisture (%)</label>
          <input
            type="number"
            value={moistureContent}
            onChange={e => setMoistureContent(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>SCA Score</label>
          <input type="number" value={scaScore} onChange={e => setScaScore(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Humidity</label>
          <input type="number" value={humidity} onChange={e => setHumidity(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Dry Temp (°C)</label>
          <input type="number" value={dryTemp} onChange={e => setDryTemp(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
        <button type="submit" disabled={isMining || status === "sending"} style={btnStyle}>
          {isMining || status === "sending" ? "Submitting..." : "Record processing"}
        </button>
        {status === "success" && (
          <span style={{ color: colors.greenDark, fontWeight: 600 }}>Processing recorded ✓</span>
        )}
        {status === "error" && <span style={{ color: "#a33", fontWeight: 600 }}>Error: {errorMsg}</span>}
      </div>
    </form>
  );
}
