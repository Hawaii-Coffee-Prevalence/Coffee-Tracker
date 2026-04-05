import { STAGES, STAGE_COLORS } from "~~/utils/coffee";

const MapLegend = () => {
  const labels: Record<string, string> = {
    Harvested: "Coffee Farm",
    Processed: "Processing Station",
    Roasted: "Roasting Facility",
    Distributed: "Distribution Hub",
  };

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-base-100 border border-base-300 rounded-lg px-4 py-2 flex flex-col gap-2 shadow-sm pointer-events-none">
      {STAGES.map(stage => (
        <div key={stage} className="flex items-center gap-2 text-xs text-muted">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STAGE_COLORS[stage] }} />
          {labels[stage]}
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
