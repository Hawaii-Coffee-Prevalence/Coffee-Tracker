"use client";

import { DataRow } from "./DataRow";
import { zeroAddress } from "viem";
import { BlockieAddressLink } from "~~/components/explore/BlockieAddressLink";
import { PROCESSING_METHODS, REGIONS, ROASTING_METHODS, ROAST_LEVELS, VARIETIES } from "~~/types/coffee";

const TransactionJourney = ({ batch }: { batch: any }) => {
  if (!batch) return <div className="text-base-content/50">No batch data available</div>;

  const hasProcessed = batch?.processor && batch.processor !== zeroAddress;
  const hasRoasted = batch?.roaster && batch.roaster !== zeroAddress;
  const hasDistributed = batch?.distributor && batch.distributor !== zeroAddress;

  return (
    <div className="flex flex-col w-full text-base-content pb-6">
      <h3 className="text-label mb-3 mt-2 text-[var(--color-stage-harvest)]">Harvest</h3>
      <DataRow title="Farm Name" value={batch?.farmName ?? "—"} />
      <DataRow title="Region" value={batch?.region !== undefined ? REGIONS[batch.region] : "—"} />
      <DataRow title="Variety" value={batch?.variety !== undefined ? VARIETIES[batch.variety] : "—"} />
      <DataRow title="Elevation" value={batch?.elevation ? `${batch.elevation} ft` : "—"} />
      <DataRow title="Harvest Weight" value={batch?.harvestWeight ? `${Number(batch.harvestWeight)} kg` : "—"} />
      <DataRow
        title="Harvest Date"
        value={batch?.harvestDate ? new Date(Number(batch.harvestDate) * 1000).toLocaleDateString() : "—"}
      />

      {hasProcessed && (
        <>
          <h3 className="text-label mb-3 mt-8 text-[var(--color-stage-process)]">Process</h3>
          <DataRow
            title="Method"
            value={batch?.processingMethod !== undefined ? PROCESSING_METHODS[batch.processingMethod] : "—"}
          />
          <DataRow
            title="Weight In"
            value={batch?.processingBeforeWeight ? `${Number(batch.processingBeforeWeight)} kg` : "—"}
          />
          <DataRow
            title="Weight Out"
            value={batch?.processingAfterWeight ? `${Number(batch.processingAfterWeight)} kg` : "—"}
          />
          <DataRow title="SCA Score" value={batch?.scaScore ?? "—"} />
          <DataRow title="Moisture" value={batch?.moistureContent ? `${batch.moistureContent}%` : "—"} />
          <DataRow title="Dry Temp" value={batch?.dryTemperature ? `${batch.dryTemperature}°F` : "—"} />
        </>
      )}

      {hasRoasted && (
        <>
          <h3 className="text-label mb-3 mt-8 text-[var(--color-stage-roast)]">Roast</h3>
          <DataRow
            title="Method"
            value={batch?.roastingMethod !== undefined ? ROASTING_METHODS[batch.roastingMethod] : "—"}
          />
          <DataRow
            title="Weight In"
            value={batch?.roastingBeforeWeight ? `${Number(batch.roastingBeforeWeight)} kg` : "—"}
          />
          <DataRow
            title="Weight Out"
            value={batch?.roastingAfterWeight ? `${Number(batch.roastingAfterWeight)} kg` : "—"}
          />
          <DataRow title="Level" value={batch?.roastLevel !== undefined ? ROAST_LEVELS[batch.roastLevel] : "—"} />
          <DataRow title="Transport Time" value={batch?.transportTime ? `${batch.transportTime} hrs` : "—"} />
        </>
      )}

      {hasDistributed && (
        <>
          <h3 className="text-label mb-3 mt-8 text-[var(--color-stage-distribute)]">Distribute</h3>
          <DataRow title="Distributor" hasBorder={true}>
            {batch?.distributor && batch.distributor !== zeroAddress ? (
              <BlockieAddressLink address={batch.distributor} disableTruncation />
            ) : (
              <span className="text-base-content/50 font-medium text-md">Pending</span>
            )}
          </DataRow>
        </>
      )}
    </div>
  );
};

export default TransactionJourney;
