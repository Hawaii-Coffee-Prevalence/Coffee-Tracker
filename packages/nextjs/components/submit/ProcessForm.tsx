"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BatchSelect } from "./BatchSelect";
import { MediaUploader } from "./MediaUploader";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { BatchMetadata } from "~~/types/batchmetadata";
import { MediaFile, ProcessFormState } from "~~/types/form";
import { toUnixSeconds } from "~~/utils/coffee";
import { PROCESSING_METHODS } from "~~/utils/coffee";
import { fetchMetadata, getOrCreateGroup, pinFile, pinJSON, pinQR } from "~~/utils/pinata";
import { notification } from "~~/utils/scaffold-eth";

const INITIAL_FORM: ProcessFormState = {
  batchNumber: "",
  processingMethod: "0",
  moistureContent: "",
  scaScore: "",
  humidity: "",
  dryTemperature: "",
  processingDate: "",
  beforeWeight: "",
  afterWeight: "",
  latitude: "",
  longitude: "",
};

export const ProcessForm = () => {
  const [form, setForm] = useState<ProcessFormState>(INITIAL_FORM);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { data: batchData } = useScaffoldReadContract({
    contractName: "CoffeeTracker",
    functionName: "getBatchByNumber",
    args: [form.batchNumber?.trim()],
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });

  const updateField = (field: keyof ProcessFormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setMediaFiles([]);
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;

    const accepted = Array.from(files).filter(f => f.type === "image/png" || f.type === "image/jpeg");

    if (accepted.length !== files.length) {
      notification.error("Only PNG and JPG files are accepted.");
    }

    const newMedia: MediaFile[] = accepted.map(file => ({
      file,
      description: "",
      mediapreview: URL.createObjectURL(file),
    }));

    setMediaFiles(prev => [...prev, ...newMedia]);
  };

  const updateDescription = (index: number, description: string) => {
    setMediaFiles(prev => prev.map((item, i) => (i === index ? { ...item, description } : item)));
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => {
      URL.revokeObjectURL(prev[index].mediapreview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.batchNumber ||
      !form.moistureContent ||
      !form.scaScore ||
      !form.humidity ||
      !form.dryTemperature ||
      !form.processingDate ||
      !form.beforeWeight ||
      !form.afterWeight ||
      !form.latitude ||
      !form.longitude
    ) {
      notification.error("Complete every field before submitting.");
      return;
    }

    if (!batchData || batchData.batchId === 0n) {
      notification.error("Batch not found on-chain. Check the batch number.");
      return;
    }

    if (batchData.processor !== "0x0000000000000000000000000000000000000000") {
      notification.warning("This batch already has a processor assigned!");
    }

    const moistureContent = Number(form.moistureContent);
    const scaScore = Number(form.scaScore);
    const humidity = Number(form.humidity);
    const dryTemperature = Number(form.dryTemperature);
    const beforeWeight = Number(form.beforeWeight);
    const afterWeight = Number(form.afterWeight);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const processingDate = toUnixSeconds(form.processingDate);

    if (
      [
        moistureContent,
        scaScore,
        humidity,
        dryTemperature,
        beforeWeight,
        afterWeight,
        latitude,
        longitude,
        processingDate,
      ].some(value => Number.isNaN(value))
    ) {
      notification.error("Check the numeric fields. One or more values are invalid.");
      return;
    }

    setIsUploading(true);
    const notificationId = notification.loading("Merging processing data and pinning to IPFS...");
    let newMetadataCID = "";

    try {
      const groupId = await getOrCreateGroup("CoffeeTracker-local-batch");
      const mediaGroupId = await getOrCreateGroup("CoffeeTracker-local-media");

      // Fetch existing metadata
      let metadata: BatchMetadata;
      try {
        metadata = await fetchMetadata(batchData.metadataCID);
      } catch {
        notification.error("Could not fetch existing metadata for this batch.");
        setIsUploading(false);
        notification.remove(notificationId);
        return;
      }

      const galleryCIDs = await Promise.all(
        mediaFiles.map(async ({ file, description }) => {
          const cid = await pinFile(file, `${form.batchNumber.trim()}-${file.name}`, mediaGroupId);
          return { cid, description };
        }),
      );

      if (!metadata.properties.images?.qrCode) {
        const qrGroupId = await getOrCreateGroup("CoffeeTracker-local-qr");
        const qrCID = await pinQR(batchData.batchNumber, qrGroupId);
        metadata.properties.images = metadata.properties.images || {};
        metadata.properties.images.qrCode = { cid: qrCID, description: "Batch QR Code" };
        metadata.image = `ipfs://${qrCID}`;
      }

      // Merge processing data
      metadata.attributes.push({ trait_type: "Stage", value: "Processed" });
      metadata.attributes.push({
        trait_type: "Processing Method",
        value: PROCESSING_METHODS[Number(form.processingMethod)],
      });
      metadata.attributes.push({ trait_type: "SCA Score", value: scaScore });

      metadata.properties.processing = {
        processingMethod: PROCESSING_METHODS[Number(form.processingMethod)],
        moistureContent,
        scaScore,
        humidity,
        dryTemperature,
        processingDate,
        beforeWeight,
        afterWeight,
        location: { latitude, longitude },
      };

      if (galleryCIDs.length > 0) {
        metadata.properties.images = metadata.properties.images || {};
        const existingGallery = metadata.properties.images.gallery || [];
        metadata.properties.images.gallery = [...existingGallery, ...galleryCIDs];
      }

      newMetadataCID = await pinJSON(metadata, `batch-${form.batchNumber.trim()}`, form.batchNumber.trim(), groupId);
    } catch (error) {
      console.error(error);
      notification.error("Failed to upload to Pinata. See console for details.");
      setIsUploading(false);
      notification.remove(notificationId);
      return;
    }

    notification.remove(notificationId);

    try {
      await writeContractAsync(
        {
          functionName: "processBatch",
          args: [batchData.batchId, Number(form.processingMethod), newMetadataCID],
        },
        {
          onBlockConfirmation: () => {
            notification.success(`Batch ${form.batchNumber.trim()} was processed onchain.`);
            resetForm();
            setTimeout(() => {
              router.push("/explore");
            }, 1000);
          },
        },
      );
    } catch {
      // scaffold hook handles error notification
    } finally {
      setIsUploading(false);
    }
  };

  const isDisabled = isMining || isUploading;

  return (
    <form onSubmit={handleSubmit} className="rounded-box border border-base-300 bg-base-100 shadow-sm">
      {/* Header */}
      <div className="px-6 py-6 sm:px-8 border-b border-base-300">
        <h2 className="heading-card text-4xl mb-2">Process Batch</h2>
        <p className="text-muted text-sm m-0">Enter the processing data to update the batch.</p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch auto-rows-fr md:auto-rows-auto">
          {/* Col 1 */}
          <div className="flex flex-col gap-4 h-full">
            <div className="form-control w-full">
              <span className="text-label mb-2">Batch Number</span>
              <BatchSelect
                value={form.batchNumber}
                onSelect={val => updateField("batchNumber", val)}
                requiredStage="Harvested"
                isDisabled={isDisabled}
              />
            </div>

            <label className="form-control w-full">
              <span className="text-label mb-2">SCA Score</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="decimal"
                placeholder="88"
                step="0.1"
                min="0"
                max="100"
                type="number"
                value={form.scaScore}
                onChange={e => updateField("scaScore", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Humidity (%)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="decimal"
                placeholder="60"
                step="0.1"
                type="number"
                value={form.humidity}
                onChange={e => updateField("humidity", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Before Weight (kg)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="numeric"
                min="0"
                placeholder="1480"
                type="number"
                value={form.beforeWeight}
                onChange={e => updateField("beforeWeight", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">After Weight (kg)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="numeric"
                min="0"
                placeholder="250"
                type="number"
                value={form.afterWeight}
                onChange={e => updateField("afterWeight", e.target.value)}
              />
            </label>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4 h-full">
            <label className="form-control w-full">
              <span className="text-label mb-2">Processing Method</span>
              <select
                className="select select-bordered w-full text-sm h-11"
                value={form.processingMethod}
                onChange={e => updateField("processingMethod", e.target.value)}
              >
                {Object.entries(PROCESSING_METHODS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Processing Date</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                type="date"
                value={form.processingDate}
                onChange={e => updateField("processingDate", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Dry Temperature (°C)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="decimal"
                placeholder="30"
                step="0.1"
                type="number"
                value={form.dryTemperature}
                onChange={e => updateField("dryTemperature", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Moisture Content (%)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="decimal"
                placeholder="11.5"
                step="0.1"
                type="number"
                value={form.moistureContent}
                onChange={e => updateField("moistureContent", e.target.value)}
              />
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-label">Location (Lat/Long)</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input input-bordered w-full text-sm h-11"
                  inputMode="decimal"
                  placeholder="Lat"
                  step="0.000001"
                  type="number"
                  value={form.latitude}
                  onChange={e => updateField("latitude", e.target.value)}
                />
                <input
                  className="input input-bordered w-full text-sm h-11"
                  inputMode="decimal"
                  placeholder="Long"
                  step="0.000001"
                  type="number"
                  value={form.longitude}
                  onChange={e => updateField("longitude", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col h-full">
            <span className="text-label mb-2">Media</span>
            <div className="flex-1 min-h-0">
              <MediaUploader
                mediaFiles={mediaFiles}
                onAddFiles={addFiles}
                onUpdateDescription={updateDescription}
                onRemoveFile={removeFile}
                isDisabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-t border-base-300 px-6 py-5 sm:px-8">
        <p className="text-hint text-xs leading-relaxed">
          The processing metadata will be merged with the existing IPFS metadata.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-80">
          <button
            type="button"
            className="btn btn-ghost border flex-1 text-base tracking-wide whitespace-nowrap"
            onClick={resetForm}
            disabled={isDisabled}
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn btn-primary flex-1 text-base tracking-wide whitespace-nowrap"
            disabled={isDisabled || !batchData || (batchData?.batchId ?? 0n) === 0n}
          >
            {isUploading ? "Uploading..." : isMining ? "Submitting..." : "Process Batch"}
          </button>
        </div>
      </div>
    </form>
  );
};
