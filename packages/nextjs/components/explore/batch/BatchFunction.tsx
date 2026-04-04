import type { DecodedTx } from "./BatchData";

const BatchFunction = ({ tx }: { tx: DecodedTx }) => {
  if (tx.functionName && tx.functionName !== "Unknown" && tx.functionName !== "0x") {
    return (
      <div className="flex flex-col overflow-hidden text-left">
        <div className="font-mono text-md mb-2 leading-relaxed">
          <span className="font-semibold text-primary">{tx.functionName}</span>
          <span className="text-base-content/50">(</span>
          <span className="text-info">{tx.functionArgTypes?.join(", ")}</span>
          <span className="text-base-content/50">)</span>
        </div>

        {tx.functionArgNames && tx.functionArgNames.length > 0 && (
          <div className="flex flex-col pl-4 border-l-2 border-base-300/50 overflow-x-auto gap-1">
            {tx.functionArgNames.map((name: string, i: number) => {
              const isString = tx.functionArgTypes?.[i]?.includes("string");
              return (
                <div
                  key={i}
                  className="flex flex-row items-center gap-2 whitespace-nowrap min-w-max font-mono text-sm md:text-md overflow-hidden"
                >
                  <span className="text-info">{tx.functionArgTypes?.[i]}</span>
                  <span className="text-base-content">{name}</span>
                  <span className="text-base-content/50">=</span>
                  <span className={isString ? "text-warning" : "text-success"}>{String(tx.functionArgs?.[i])}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-md text-base-content/50 items-center">
      {tx.input === "0x" ? "Transfer (No Data)" : "Unknown Function"}
    </div>
  );
};

export default BatchFunction;
