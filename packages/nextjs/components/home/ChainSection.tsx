"use client";

import { useRef, useState } from "react";
import TimelineLeftSection from "./timeline/TimelineLeftSection";
import TimelineRightSection from "./timeline/TimelineRightSection";
import TimelineSpine from "./timeline/TimelineSpine";
import { useTimelineSteps } from "./timeline/index";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useCoffeeTracker } from "~~/hooks/useCoffeeTracker";

const ChainSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProgress, setActiveProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { stats } = useCoffeeTracker();
  const STEPS = useTimelineSteps(stats);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const headerMaxHeight = useTransform(scrollYProgress, [0, 0.08], ["250px", "0px"]);
  const headerMargin = useTransform(scrollYProgress, [0, 0.08], ["2.5rem", "0rem"]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [0, -30]);

  const mappedProgress = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  const smoothProgress = useSpring(mappedProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothProgress, "change", latest => {
    setActiveProgress(latest);
  });

  const fillHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Calculate active step index
  let activeIndex = 0;
  for (let i = 0; i < STEPS.length; i++) {
    const threshold = i / (STEPS.length - 1);

    if (activeProgress >= threshold - 0.05) {
      activeIndex = i;
    }
  }
  const activeItem = STEPS[activeIndex];

  return (
    <div ref={containerRef} className="h-[400vh] relative w-full">
      <div className="sticky top-[4rem] h-[calc(100vh-4rem)] w-full main-page-section-padding flex flex-col items-center justify-start overflow-hidden">
        <motion.div
          className="w-full max-w-7xl mx-auto flex-shrink-0 origin-top"
          style={{
            opacity: headerOpacity,
            maxHeight: headerMaxHeight,
            marginBottom: headerMargin,
            y: headerY,
          }}
        >
          <div className="flex items-end justify-between">
            <div>
              <span className="text-label text-primary! mb-3 block">How It Works</span>
              <h2 className="heading-section m-0">
                <span className="flex items-center gap-4">
                  <span className="font-semibold">The Supply Chain</span>
                  <span className="w-12 h-0.5 bg-base-content mt-1 flex-shrink-0 opacity-20" />
                </span>
                <span className="italic text-accent block">Every Step Recorded</span>
              </h2>
            </div>
          </div>
        </motion.div>

        <div className="flex w-full max-w-7xl mx-auto flex-grow items-stretch justify-center relative gap-x-10 md:gap-x-20">
          <TimelineLeftSection activeItem={activeItem} activeIndex={activeIndex} />

          <TimelineSpine stepsLength={STEPS.length} activeProgress={activeProgress} fillHeight={fillHeight} />

          <TimelineRightSection activeItem={activeItem} activeIndex={activeIndex} />
        </div>
      </div>
    </div>
  );
};

export default ChainSection;
