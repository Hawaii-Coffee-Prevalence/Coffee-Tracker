"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BatchSelect } from "./BatchSelect";
import { MediaUploader } from "./MediaUploader";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { BatchMetadata } from "~~/types/batchmetadata";
import { DistributeFormState, MediaFile } from "~~/types/form";
import { toUnixSeconds } from "~~/utils/coffee";
import { fetchMetadata, getOrCreateGroup, pinFile, pinJSON, pinQR } from "~~/utils/pinata";
import { notification } from "~~/utils/scaffold-eth";

const INITIAL_FORM: DistributeFormState = {
  batchNumber: "",
  distributionDate: "",
  bagCount: "",
  distributionWeight: "",
  destination: "",
  latitude: "",
  longitude: "",
};

export const DistributeForm = () => {
  const [form, setForm] = useState<DistributeFormState>(INITIAL_FORM);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { data: batchData } = useScaffoldReadContract({
    contractName: "CoffeeTracker",
    functionName: "getBatchByNumber",
    args: [form.batchNumber?.trim()],
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "CoffeeTracker" });

  const updateField = (field: keyof DistributeFormState, value: string) => {
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
      !form.distributionDate ||
      !form.bagCount ||
      !form.distributionWeight ||
      !form.destination ||
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

    const bagCount = Number(form.bagCount);
    const distributionWeight = Number(form.distributionWeight);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const distributionDate = toUnixSeconds(form.distributionDate);

    if ([bagCount, distributionWeight, latitude, longitude, distributionDate].some(value => Number.isNaN(value))) {
      notification.error("Check the numeric fields. One or more values are invalid.");
      return;
    }

    setIsUploading(true);
    const notificationId = notification.loading("Finalizing distribution data and pinning to IPFS...");
    let newMetadataCID = "";

    try {
      const groupId = await getOrCreateGroup("CoffeeTracker-local-batch");
      const mediaGroupId = await getOrCreateGroup("CoffeeTracker-local-media");

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

      // Merge distribution data
      metadata.attributes.push({ trait_type: "Stage", value: "Distributed" });

      metadata.properties.distribution = {
        distributionDate,
        bagCount,
        distributionWeight,
        destination: form.destination.trim(),
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
          functionName: "distributeBatch",
          args: [batchData.batchId, newMetadataCID],
        },
        {
          onBlockConfirmation: () => {
            notification.success(`Batch ${form.batchNumber.trim()} was distributed onchain.`);
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
        <h2 className="heading-card text-4xl mb-2">Distribute Batch</h2>
        <p className="text-muted text-sm m-0">Enter the distribution data to finalize the batch.</p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch auto-rows-fr md:auto-rows-auto">
          {/* Col 1 & 2 Combined Grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
            {/* Row 1 */}
            <div className="form-control w-full">
              <span className="text-label mb-2">Batch Number</span>
              <BatchSelect
                value={form.batchNumber}
                onSelect={val => updateField("batchNumber", val)}
                requiredStage="Roasted"
                isDisabled={isDisabled}
              />
            </div>

            <label className="form-control w-full">
              <span className="text-label mb-2">Destination</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                placeholder="Kailua-Kona Cafe"
                value={form.destination}
                onChange={e => updateField("destination", e.target.value)}
              />
            </label>

            {/* Row 2 */}
            <label className="form-control w-full">
              <span className="text-label mb-2">Total Distribute Weight (kg)</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="numeric"
                placeholder="210"
                min="0"
                type="number"
                value={form.distributionWeight}
                onChange={e => updateField("distributionWeight", e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="text-label mb-2">Distribution Date</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                type="date"
                value={form.distributionDate}
                onChange={e => updateField("distributionDate", e.target.value)}
              />
            </label>

            {/* Row 3 */}
            <label className="form-control w-full">
              <span className="text-label mb-2">Bag Count</span>
              <input
                className="input input-bordered w-full text-sm h-11"
                inputMode="numeric"
                placeholder="25"
                min="0"
                type="number"
                value={form.bagCount}
                onChange={e => updateField("bagCount", e.target.value)}
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

            {/* Row 4 (Ghost Row) to match HarvestForm 4-row height */}
            <div className="hidden md:block form-control w-full invisible pointer-events-none">
              <span className="text-label mb-2">&nbsp;</span>
              <div className="h-11"></div>
            </div>
            <div className="hidden md:block form-control w-full invisible pointer-events-none">
              <span className="text-label mb-2">&nbsp;</span>
              <div className="h-11"></div>
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
          The distribution metadata will be added to the batch via IPFS to complete the lifecycle.
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
            {isUploading ? "Uploading..." : isMining ? "Submitting..." : "Distribute Batch"}
          </button>
        </div>
      </div>
    </form>
  );
};
