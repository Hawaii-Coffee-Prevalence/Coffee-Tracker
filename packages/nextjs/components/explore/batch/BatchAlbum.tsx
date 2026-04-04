"use client";

import { useState } from "react";
import { ipfsToHTTP } from "~~/utils/pinata";

type MediaItem = {
  url: string;
  label: string;
};

const BatchAlbum = ({ batch }: { batch: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items: MediaItem[] = [];

  if (batch?.images?.nft?.cid) {
    items.push({ url: ipfsToHTTP(batch.images.nft.cid), label: batch.images.nft.description || "NFT Certificate" });
  }

  if (batch?.images?.qrCode?.cid) {
    items.push({ url: ipfsToHTTP(batch.images.qrCode.cid), label: batch.images.qrCode.description || "Batch QR Code" });
  }

  if (Array.isArray(batch?.images?.gallery)) {
    batch.images.gallery.forEach((img: any, i: number) => {
      if (img?.cid) {
        items.push({ url: ipfsToHTTP(img.cid), label: img.description || `Gallery Image ${i + 1}` });
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full gap-4 items-center justify-center text-hint">
        <span className="text-sm">No media available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
        <span className="text-hint text-xs text-center">{items[currentIndex]?.label || ""}</span>

        <div className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden">
          {items.map((item, i) => (
            <div
              key={i}
              className={`absolute inset-0 ${i === currentIndex ? "flex" : "hidden"} items-center justify-center`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.label} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 shrink-0 flex-wrap">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`btn btn-xs ${currentIndex === i ? "btn-primary" : "btn-ghost border border-base-300"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BatchAlbum;
