"use client";

import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RegionData } from "~~/types/coffee";

export const RegionChart = ({ data }: { data: RegionData }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const barHeight = 8;
  const rowHeight = 36;
  const height = Math.max(data.length * rowHeight, 120);

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0].payload as { name: string; count: number };

    return (
      <div className="bg-base-100 border border-base-300 rounded-lg px-3 py-1 text-xs whitespace-nowrap">
        <span className="font-semibold text-base-content">{entry.name}</span>
        <span className="text-secondary ml-2">{entry.count} batches</span>
      </div>
    );
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" barSize={barHeight} margin={{ top: 0, bottom: 0, left: 0, right: 28 }}>
          <XAxis type="number" hide domain={[0, max]} />
          <Tooltip content={renderTooltip} cursor={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={64}
            tick={{ fontSize: 12, fontFamily: "Outfit", fill: "#1A0F05", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
            onMouseEnter={(d: { name?: string }) => setHoveredKey(d.name ?? null)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill="#4A6741"
                opacity={hoveredKey && hoveredKey !== entry.name ? 0.3 : 1 - i * 0.08}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="absolute top-0 right-0 flex flex-col pointer-events-none" style={{ height }}>
        {data.map((entry, i) => (
          <div
            key={entry.name}
            className="flex items-center"
            style={{
              height: rowHeight,
              marginTop: i === 0 ? (rowHeight - barHeight) / 2 : 0,
              opacity: hoveredKey && hoveredKey !== entry.name ? 0.3 : 1,
              transition: "opacity 0.15s",
              fontSize: 11,
              fontFamily: "Outfit",
              color: "#7A5C3A",
            }}
          >
            {entry.count}
          </div>
        ))}
      </div>
    </div>
  );
};
