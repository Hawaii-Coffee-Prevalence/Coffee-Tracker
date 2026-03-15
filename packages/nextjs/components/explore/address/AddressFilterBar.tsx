"use client";

type SortOrder = "newest" | "oldest";

type AddressFilterBarProps = {
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
};

export const AddressFilterBar = ({ sort, onSortChange, pageSize, onPageSizeChange }: AddressFilterBarProps) => {
  return (
    <div className="flex items-center justify-end gap-3 mb-4 flex-wrap w-full">
      <div className="flex items-center gap-2">
        <select
          className="select select-sm appearance-none w-fit shrink-0 border-base-300"
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {[10, 20, 50, 100].map(n => (
            <option key={n} value={n}>
              {n} results
            </option>
          ))}
        </select>

        <select
          className="select select-sm appearance-none w-fit shrink-0 border-base-300"
          value={sort}
          onChange={e => onSortChange(e.target.value as SortOrder)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};
