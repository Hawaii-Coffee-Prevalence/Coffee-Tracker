"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaUploader } from "./MediaUploader";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { BatchMetadata } from "~~/types/batchmetadata";
import { HarvestFormState, MediaFile } from "~~/types/form";
import { REGIONS, VARIETIES } from "~~/utils/coffee";
import { toUnixSeconds } from "~~/utils/coffee";
import { getOrCreateGroup, pinFile, pinJSON, pinQR } from "~~/utils/pinata";
import { notification } from "~~/utils/scaffold-eth";

const INITIAL_FORM: HarvestFormState = {
  batchNumber: "",
  farmName: "",
  region: "0",
  variety: "0",
  elevation: "",
  harvestDate: "",
  harvestWeight: "",
  latitude: "",
  longitude: "",
};

export const HarvestForm = () => {
  const [form, setForm] = useState<HarvestFormState>(INITIAL_FORM);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });

  const updateField = (field: keyof HarvestFormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setMediaFiles([]);
  };

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

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
      !form.farmName ||
      !form.elevation ||
      !form.harvestDate ||
      !form.harvestWeight ||
      !form.latitude ||
      !form.longitude
    ) {
      notification.error("Complete every field before submitting.");
      return;
    }

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const elevation = Number(form.elevation);
    const harvestWeight = Number(form.harvestWeight);
    const harvestDate = toUnixSeconds(form.harvestDate);

    if ([latitude, longitude, elevation, harvestWeight, harvestDate].some(value => Number.isNaN(value))) {
      notification.error("Check the numeric fields. One or more values are invalid.");
      return;
    }

    setIsUploading(true);
    const notificationId = notification.loading("Uploading batch data and media to IPFS...");
    let metadataCID = "";

    try {
      const groupId = await getOrCreateGroup("CoffeeTracker-local-batch");
      const qrGroupId = await getOrCreateGroup("CoffeeTracker-local-qr");
      const mediaGroupId = await getOrCreateGroup("CoffeeTracker-local-media");
      const qrCID = await pinQR(form.batchNumber.trim(), qrGroupId);

      const galleryCIDs = await Promise.all(
        mediaFiles.map(async ({ file, description }) => {
          const cid = await pinFile(file, `${form.batchNumber.trim()}-${file.name}`, mediaGroupId);

          return { cid, description };
        }),
      );

      const metadata: BatchMetadata = {
        name: `${REGIONS[Number(form.region)]} ${VARIETIES[Number(form.variety)]} - ${form.batchNumber.trim()}`,
        description: `Single origin ${VARIETIES[Number(form.variety)]} harvested at ${form.elevation}m. Farm: ${form.farmName.trim()}.`,
        image: `ipfs://${qrCID}`,
        external_url: `${APP_URL}/explore/batch/${form.batchNumber.trim()}`,

        attributes: [
          { trait_type: "Stage", value: "Harvested" },
          { trait_type: "Region", value: REGIONS[Number(form.region)] },
          { trait_type: "Variety", value: VARIETIES[Number(form.variety)] },
          { trait_type: "Elevation (m)", value: form.elevation },
          { trait_type: "Harvest Weight (kg)", value: form.harvestWeight },
        ],

        properties: {
          batchNumber: form.batchNumber.trim(),
          harvest: {
            farmName: form.farmName.trim(),
            region: REGIONS[Number(form.region)],
            variety: VARIETIES[Number(form.variety)],
            elevation,
            harvestDate,
            harvestWeight,
            location: { latitude, longitude },
          },
          images: {
            qrCode: { cid: qrCID, description: "Batch QR Code" },
            ...(galleryCIDs.length > 0 && { gallery: galleryCIDs }),
          },
        },
      };

      metadataCID = await pinJSON(metadata, `batch-${form.batchNumber.trim()}`, form.batchNumber.trim(), groupId);
    } catch (error) {
      console.error(error);
      notification.error(`Batch ${form.batchNumber.trim()} failed to harvest on-chain.`);
      setIsUploading(false);
      notification.remove(notificationId);
      return;
    }

    notification.remove(notificationId);

    try {
      await writeContractAsync(
        {
          functionName: "harvestBatch",
          args: [form.batchNumber.trim(), Number(form.region), Number(form.variety), metadataCID],
        },
        {
          onBlockConfirmation: () => {
            notification.success(`Batch ${form.batchNumber.trim()} was harvested onchain.`);
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
        <h2 className="heading-card text-4xl mb-2">Harvest Batch</h2>
        <p className="text-muted text-sm m-0">Enter the initial coffee batch data.</p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch auto-rows-fr md:auto-rows-auto">
          {/* Col 1 */}
          <div className="flex flex-col gap-4 h-full">
            <label className="form-control w-full">
              <span className="text-label mb-2">Batch Number</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                placeholder="KONA-2026-201"
                value={form.batchNumber}
                onChange={e => updateField("batchNumber", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Variety</span>
              <select
                className="select select-bordered w-full text-sm h-11"
                value={form.variety}
                onChange={e => updateField("variety", e.target.value)}
              >
                {Object.entries(VARIETIES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Harvest Date</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                type="date"
                value={form.harvestDate}
                onChange={e => updateField("harvestDate", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Elevation (m)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="numeric"
                min="0"
                placeholder="792"
                type="number"
                value={form.elevation}
                onChange={e => updateField("elevation", e.target.value)}
              />
            </label>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4 h-full">
            <label className="form-control w-full">
              <span className="text-label mb-2">Farm Name</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                placeholder="Holualoa Kona Coffee Co"
                value={form.farmName}
                onChange={e => updateField("farmName", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Region</span>
              <select
                className="select select-bordered w-full text-sm h-11"
                value={form.region}
                onChange={e => updateField("region", e.target.value)}
              >
                {Object.entries(REGIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Harvest Weight (kg)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="numeric"
                min="0"
                placeholder="1480"
                type="number"
                value={form.harvestWeight}
                onChange={e => updateField("harvestWeight", e.target.value)}
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
          Batch data and media are pinned to IPFS and linked to this batch on-chain for permanent transparency.
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
            disabled={isDisabled}
          >
            {isUploading ? "Uploading..." : isMining ? "Submitting..." : "Submit Batch"}
          </button>
        </div>
      </div>
    </form>
  );
};
