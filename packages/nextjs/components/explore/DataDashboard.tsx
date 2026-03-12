import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "~~/components/Skeleton";
import { useCoffeeTracker } from "~~/hooks/useCoffeeTracker";

type Trend = "up" | "down" | "neutral";

export const DataDashboard = () => {
  const { stats, transactionCount, farmCount, isLoading } = useCoffeeTracker();

  const statItems: { label: string; value?: string; sub: React.ReactNode; trend?: Trend }[] = [
    {
      label: "Total Transactions",
      value: transactionCount?.toString(),
      trend: stats?.batchesToday ? "up" : "neutral",
      sub: stats?.batchesToday ? (
        <span className="inline-flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          {stats.batchesToday} today
        </span>
      ) : (
        "None today"
      ),
    },
    {
      label: "Total Batches",
      value: stats?.totalBatches?.toString(),
      trend: stats?.batchesThisWeek ? "up" : "neutral",
      sub: stats?.batchesThisWeek ? (
        <span className="inline-flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          {stats.batchesThisWeek} this week
        </span>
      ) : (
        "No new batches"
      ),
    },
    {
      label: "Verified Batches",
      value: stats?.verifiedCount?.toString(),
      trend: (stats?.verifiedPercent ?? 0) >= 50 ? "up" : "neutral",
      sub: `${stats?.verifiedPercent ?? 0}% of total`,
    },
    {
      label: "Registered Farms",
      value: farmCount?.toString(),
      trend: "neutral",
      sub: `${stats?.islandCount ?? 0} islands`,
    },
    {
      label: "Avg SCA Score",
      value: stats?.averageScaScore?.toString(),
      trend: !stats?.averageScaScore ? "neutral" : Number(stats.averageScaScore) >= 85 ? "up" : "down",
      sub: stats?.scaLabel,
    },
    {
      label: "Total Harvest Weight",
      value: stats?.totalWeightDisplay,
      trend: "neutral",
      sub: "kg across all batches",
    },
  ];

  return (
    <div className="overflow-x-auto mb-6">
      <div className="grid grid-cols-6 min-w-[800px] gap-px bg-base-300 border border-base-300 rounded-xl overflow-hidden">
        {statItems.map(({ label, value, sub, trend }) => (
          <div key={label} className="ghost-surface p-7 transition-colors">
            <div className="text-muted uppercase tracking-[0.2em] mb-3">{label}</div>
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </>
            ) : (
              <>
                <div className="font-serif text-5xl font-light text-base-content leading-none mb-1">{value ?? "—"}</div>
                <p
                  className={`text-xs mt-1 ${trend === "up" ? "text-primary" : trend === "down" ? "text-accent" : "text-secondary"}`}
                >
                  {sub}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
