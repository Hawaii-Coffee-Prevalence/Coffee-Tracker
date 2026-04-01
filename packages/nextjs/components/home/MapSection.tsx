"use client";

import HomeMap from "./HomeMap";

const MapSection = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-label text-primary! mb-3 block">Grown on the Islands</span>
          <h2 className="heading-section">
            <span className="font-semibold">Hawaiian Coffee Belt</span>
          </h2>
        </div>
      </div>

      <HomeMap />
    </div>
  );
};

export default MapSection;
