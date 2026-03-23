"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { MediaPreviewProps } from "~~/types/form";

/* eslint-disable @next/next/no-img-element */
export const MediaPreview = ({
  mediaFiles,
  onUpdateDescription,
  onRemoveFile,
  isDisabled = false,
}: MediaPreviewProps) => {
  if (mediaFiles.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-base-100">
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full items-center">
          {mediaFiles.map((item, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-36 aspect-[16/10] rounded-xl border border-base-300 bg-base-200 flex flex-col group overflow-hidden"
            >
              {/* Image */}
              <img src={item.mediapreview} alt={item.file.name} className="w-full h-full object-cover" />

              {/* Remove Button */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="btn btn-square btn-sm bg-base-100 border-none hover:scale-110"
                  onClick={() => onRemoveFile(index)}
                  disabled={isDisabled}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-white font-medium truncate mb-0.5">{item.file.name}</span>

                  <input
                    className="bg-transparent border-none text-sm text-white/90 placeholder:text-white/50 focus:outline-none focus:ring-0 p-0 h-auto leading-tight"
                    placeholder="Add caption..."
                    value={item.description}
                    onChange={e => onUpdateDescription(index, e.target.value)}
                    disabled={isDisabled}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
