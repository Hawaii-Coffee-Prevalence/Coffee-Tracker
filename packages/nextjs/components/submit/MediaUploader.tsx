"use client";

import { useRef, useState } from "react";
import { MediaPreview } from "./MediaPreview";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { MediaUploaderProps } from "~~/types/form";

export const MediaUploader = ({
  mediaFiles,
  onAddFiles,
  onUpdateDescription,
  onRemoveFile,
  isDisabled = false,
}: MediaUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onAddFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col rounded-xl border border-base-300 bg-base-100 overflow-hidden h-full shadow-sm">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple
        className="hidden"
        onChange={e => onAddFiles(e.target.files)}
      />

      <div
        className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors ${mediaFiles.length > 0 ? "border-b border-base-300" : ""} 
          ${isDragging ? "bg-base-200" : "ghost-surface"} 
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !isDisabled && fileInputRef.current?.click()}
        onDragOver={e => {
          if (isDisabled) return;
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <ArrowUpTrayIcon className="w-8 h-8" />
          <div className="text-center">
            <p className="text-hint !text-base font-semibold m-0">Drop images here</p>
            <p className="text-muted text-sm m-0">or click to browse</p>
          </div>
        </div>
      </div>

      {/* Media Preview */}
      <MediaPreview
        mediaFiles={mediaFiles}
        onRemoveFile={onRemoveFile}
        onUpdateDescription={onUpdateDescription}
        isDisabled={isDisabled}
      />
    </div>
  );
};
