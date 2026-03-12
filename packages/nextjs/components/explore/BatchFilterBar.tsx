"use client";

import { BatchSearch } from "./BatchSearch";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { BatchFilterState, REGIONS, STAGES, SortOrder, StageFilter } from "~~/types/coffee";

type BatchFilterBarProps = BatchFilterState & {
  onChange: (next: BatchFilterState) => void;
  onClear?: () => void;
  onSearch?: (query: string) => void;
  onScanQr?: () => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
};

const STAGE_FILTERS: StageFilter[] = ["All", ...STAGES, "Verified"];

export const BatchFilterBar = ({
  stage,
  region,
  sort,
  onChange,
  onClear,
  onSearch,
  onScanQr,
  pageSize,
  onPageSizeChange,
}: BatchFilterBarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-label text-secondary mr-1">Stage</span>
        {STAGE_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => onChange({ stage: s, region, sort })}
            className={`btn btn-xs rounded-full border ${
              stage === s ? "btn-primary" : "btn-ghost border-base-300 text-secondary hover:border-primary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {onClear && (
          <button
            onClick={onClear}
            className="btn btn-xs rounded-full border btn-ghost border-base-300 text-secondary hover:border-error hover:text-error"
          >
            Clear
          </button>
        )}
        {onPageSizeChange && (
          <select
            className="select select-sm appearance-none w-fit shrink-0"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map(n => (
              <option key={n} value={n}>
                {n} results
              </option>
            ))}
          </select>
        )}
        <select
          className="select select-sm appearance-none w-fit shrink-0"
          value={region}
          onChange={e => onChange({ stage, region: e.target.value, sort })}
        >
          <option value="all">All Regions</option>
          {Object.entries(REGIONS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="select select-sm appearance-none w-fit shrink-0"
          value={sort}
          onChange={e => onChange({ stage, region, sort: e.target.value as SortOrder })}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {onScanQr && (
          <button
            onClick={onScanQr}
            className="btn btn-sm btn-ghost border border-base-300 rounded-lg px-2 text-secondary hover:border-primary hover:text-primary"
            title="Scan QR Code"
          >
            <QrCodeIcon className="w-4 h-4" />
          </button>
        )}

        {onSearch && (
          <div className="w-75">
            <BatchSearch onSearch={onSearch} />
          </div>
        )}
      </div>
    </div>
  );
};
