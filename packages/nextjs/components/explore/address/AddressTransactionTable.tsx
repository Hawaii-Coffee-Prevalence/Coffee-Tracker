"use client";

import { useMemo, useState } from "react";
import { AddressFilterBar } from "./AddressFilterBar";
import { AddressPagination } from "./AddressPagination";
import { formatEther } from "viem";
import { BlockieAddressLink } from "~~/components/explore/BlockieAddressLink";
import { TxHashLink } from "~~/components/explore/TxHashLink";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { TransactionWithFunction } from "~~/utils/scaffold-eth";

type AddressTransactionTableProps = {
  blocks: any[];
  transactionReceipts: { [key: string]: any };
  currentPage: number;
  totalBlocks: number;
  setCurrentPage: (page: number) => void;
};

export const AddressTransactionTable = ({ blocks, transactionReceipts }: AddressTransactionTableProps) => {
  const { targetNetwork } = useTargetNetwork();

  const [localPageSize, setLocalPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [localPage, setLocalPage] = useState(1);

  const allTxs = useMemo(() => {
    const flat = blocks.flatMap(block =>
      (block.transactions as TransactionWithFunction[]).map(tx => ({
        tx,
        block,
        receipt: transactionReceipts[tx.hash],
      })),
    );

    if (sortOrder === "newest") {
      flat.sort((a, b) => Number(b.block.timestamp) - Number(a.block.timestamp));
    } else {
      flat.sort((a, b) => Number(a.block.timestamp) - Number(b.block.timestamp));
    }

    return flat;
  }, [blocks, transactionReceipts, sortOrder]);

  const totalPages = Math.ceil(allTxs.length / localPageSize);

  const paginatedTxs = useMemo(() => {
    const start = (localPage - 1) * localPageSize;
    return allTxs.slice(start, start + localPageSize);
  }, [allTxs, localPage, localPageSize]);

  return (
    <div className="w-full">
      <AddressFilterBar
        sort={sortOrder}
        onSortChange={val => setSortOrder(val)}
        pageSize={localPageSize}
        onPageSizeChange={sz => setLocalPageSize(sz)}
      />

      <div className="bg-base-100 border border-base-300 rounded-xl overflow-x-auto">
        <table className="table text-left w-full">
          <thead>
            <tr>
              {[
                "TX Hash",
                "Function",
                "Block",
                "Time Mined",
                "From",
                "To",
                `Value (${targetNetwork.nativeCurrency.symbol})`,
              ].map((col, idx) => (
                <th key={idx} className="px-5 py-3 text-left text-col-header text-sm whitespace-nowrap bg-primary">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTxs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm font-medium opacity-50">
                  No transactions found in this range
                </td>
              </tr>
            ) : (
              paginatedTxs.map(({ tx, block, receipt }) => {
                const timeMined = new Date(Number(block.timestamp) * 1000).toLocaleString();
                const functionCalled = tx.input.substring(0, 10);

                return (
                  <tr
                    key={tx.hash}
                    className="hover text-sm hover:bg-base-200/50 transition-colors border-b border-base-300 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <TxHashLink txHash={tx.hash} />
                    </td>

                    <td className="px-5 py-4 overflow-hidden">
                      <div className="flex flex-col gap-1 items-start w-full">
                        {tx.functionName !== "0x" && tx.functionName && (
                          <span className="text-sm font-medium truncate max-w-full" title={tx.functionName}>
                            {tx.functionName}
                          </span>
                        )}
                        {functionCalled !== "0x" && (
                          <span className="badge badge-primary rounded-full font-mono text-[10px] py-1 px-3 h-auto truncate max-w-full border-none">
                            {functionCalled}
                          </span>
                        )}
                        {tx.functionName === "0x" && functionCalled === "0x" && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm">{block.number?.toString()}</span>
                    </td>

                    <td className="px-5 py-4 truncate">
                      <span className="text-sm">{timeMined}</span>
                    </td>

                    <td className="px-5 py-4 truncate">
                      <BlockieAddressLink address={tx.from} />
                    </td>

                    <td className="px-5 py-4 truncate">
                      {!receipt?.contractAddress ? (
                        tx.to ? (
                          <BlockieAddressLink address={tx.to} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <div className="flex flex-col gap-1">
                          <BlockieAddressLink address={receipt.contractAddress} />
                          <span className="text-xs italic opacity-60">(Contract Creation)</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-mono">{Number(formatEther(tx.value)).toFixed(4)}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {totalPages > 0 && (
            <AddressPagination
              currentPage={localPage}
              totalPages={totalPages}
              totalItems={allTxs.length}
              pageSize={localPageSize}
              goToPage={(p: number) => setLocalPage(p)}
            />
          )}
        </table>
      </div>
    </div>
  );
};
