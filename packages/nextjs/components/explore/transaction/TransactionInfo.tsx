"use client";

import { useState } from "react";
import TransactionData from "./TransactionData";
import TransactionJourney from "./TransactionJourney";
import TransactionOverview from "./TransactionOverview";
import TransactionTabs from "./TransactionTabs";
import { Hash } from "viem";
import { REGION_TO_ISLAND, STAGE_STYLES, getStage } from "~~/types/coffee";

const TransactionInfo = ({ batch, txHash }: { batch: any; txHash: Hash }) => {
  const stage = getStage(batch);
  const [activeTab, setActiveTab] = useState<"Overview" | "Journey" | "On Chain">("Overview");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col gap-8 px-10 pt-10 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="heading-hero text-base-content">{batch.batchNumber}</h1>
            <span className="text-base-content font-medium">
              {batch.farmName} · {REGION_TO_ISLAND[batch.region] ?? "Unknown"}
            </span>
          </div>

          <div className="flex flex-row items-center gap-2 flex-shrink-0">
            <span className={`text-sm font-medium ${batch.verified ? "text-primary" : "text-accent"}`}>
              {batch.verified ? "Verified" : "Pending"}
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${STAGE_STYLES[stage]}`}
            >
              {stage}
            </span>
          </div>
        </div>

        <div>
          <div className="text-label mb-2">Cupping Notes</div>
          <p className="font-serif text-2xl font-light italic text-base-content leading-snug">
            {batch.cuppingNotes && batch.cuppingNotes.length > 0
              ? `“${batch.cuppingNotes}”`
              : `"To Be Processed & roasted..."`}
          </p>
        </div>

        <TransactionTabs tabs={["Overview", "Journey", "On Chain"]} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 w-full relative overflow-y-auto px-10 pb-10" style={{ scrollbarWidth: "none" }}>
        <div className={`flex flex-col gap-8 animate-fadeIn mt-4 ${activeTab === "Overview" ? "block" : "hidden"}`}>
          <TransactionOverview batch={batch} />
        </div>

        <div className={`animate-fadeIn mt-4 ${activeTab === "Journey" ? "block" : "hidden"}`}>
          <TransactionJourney batch={batch} />
        </div>

        <div className={`animate-fadeIn mt-4 ${activeTab === "On Chain" ? "block" : "hidden"}`}>
          <TransactionData txHash={txHash} />
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
