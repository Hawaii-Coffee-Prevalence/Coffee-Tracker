import { useMemo } from "react";

export type Stat = { value: string; unit: string; label: string };

export type StepType = {
  step: number;
  title: string;
  color: string;
  borderColor: string;
  header: string;
  content: string;
  stat1: Stat;
  stat2: Stat;
  stat3: Stat;
};

export const CONTENT = [
  {
    step: 1,
    title: "Harvest",
    color: "text-stage-harvest!",
    borderColor: "border-stage-harvest",
    header: "Where Every\nJourney Begins",
    content:
      "Hawaiian coffee cherries are hand-picked at peak ripeness by farmers across the islands. Each harvest is logged on-chain with the farm name, elevation, location, and weight, creating a tamper-proof foundation that every step after this one is built on.",
  },
  {
    step: 2,
    title: "Process",
    color: "text-stage-process!",
    borderColor: "border-stage-process",
    header: "Cherry to\nGreen Bean",
    content:
      "After harvest, cherries go through washing, drying, or fermentation to separate the seed from the fruit. The method chosen here shapes everything about the final cup. Moisture content, SCA score, processing dates, and weight are all captured, preserving the decisions that turn a raw cherry into a green bean ready for the next step.",
  },
  {
    step: 3,
    title: "Roast",
    color: "text-stage-roast!",
    borderColor: "border-stage-roast",
    header: "Unlocking\nthe Flavor",
    content:
      "Green beans are then roasted to unlock the aromas and flavors inside. The roast level, cupping notes, method, and yield are recorded, tying the character of your cup to a specific moment in the roastery.",
  },
  {
    step: 4,
    title: "Distribute",
    color: "text-stage-distribute!",
    borderColor: "border-stage-distribute",
    header: "From Island\nto Your Cup",
    content:
      "Finally, the coffee travels to cafes, homes, and cups around the world. Every bag is tagged with a unique QR code, letting anyone trace it straight back to its island roots in a single scan.",
  },
];

export const useTimelineSteps = (stats: any) => {
  return useMemo<StepType[]>(() => {
    return CONTENT.map(stepItem => {
      if (!stats) {
        return {
          ...stepItem,
          stat1: { value: "—", unit: "", label: "" },
          stat2: { value: "—", unit: "", label: "" },
          stat3: { value: "—", unit: "", label: "" },
        };
      }

      switch (stepItem.step) {
        case 1:
          return {
            ...stepItem,
            stat1: { value: stats.averageElevation?.toLocaleString() ?? "—", unit: "ft", label: "Avg Elevation" },
            stat2: { value: stats.averageYield?.toLocaleString() ?? "—", unit: "kg", label: "Avg Yield" },
            stat3: { value: stats.varietyCount?.toString() ?? "—", unit: "", label: "Varieties" },
          };
        case 2:
          return {
            ...stepItem,
            stat1: { value: stats.averageMoisture?.toString() ?? "—", unit: "%", label: "Avg Moisture" },
            stat2: { value: stats.averageScaScore?.toString() ?? "—", unit: "", label: "Avg SCA Score" },
            stat3: { value: stats.processMethodCount?.toString() ?? "—", unit: "", label: "Methods" },
          };
        case 3:
          return {
            ...stepItem,
            stat1: { value: stats.averageTransportTime?.toString() ?? "—", unit: "hrs", label: "Avg Transport" },
            stat2: { value: stats.averageRoastWeightLoss?.toString() ?? "—", unit: "%", label: "Avg Weight Loss" },
            stat3: { value: stats.roastMethodCount?.toString() ?? "—", unit: "", label: "Methods" },
          };
        case 4:
          return {
            ...stepItem,
            stat1: { value: stats.islandCount?.toString() ?? "—", unit: "", label: "Islands" },
            stat2: { value: stats.verifiedCount?.toString() ?? "—", unit: "", label: "Batches Verified" },
            stat3: { value: "100", unit: "%", label: "On The Chain" },
          };
        default:
          return {
            ...stepItem,
            stat1: { value: "—", unit: "", label: "" },
            stat2: { value: "—", unit: "", label: "" },
            stat3: { value: "—", unit: "", label: "" },
          };
      }
    });
  }, [stats]);
};
