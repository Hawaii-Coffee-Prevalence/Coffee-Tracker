export type BatchMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  properties: {
    batchNumber: string;
    harvest?: {
      farmName: string;
      region: string;
      variety: string;
      elevation: number;
      harvestDate: number;
      harvestWeight: number;
      location: { latitude: number; longitude: number };
    };
    processing?: {
      processingMethod: string;
      moistureContent: number;
      scaScore: number;
      humidity: number;
      dryTemperature: number;
      processingDate: number;
      beforeWeight: number;
      afterWeight: number;
      location: { latitude: number; longitude: number };
    };
    roasting?: {
      roastingMethod: string;
      roastLevel: string;
      cuppingNotes: string;
      roastingDate: number;
      transportTime: number;
      beforeWeight: number;
      afterWeight: number;
      location: { latitude: number; longitude: number };
    };
    distribution?: {
      distributionDate: number;
      bagCount: number;
      distributionWeight: number;
      destination: string;
      location: { latitude: number; longitude: number };
    };
    images: {
      nft?: { cid: string; description: string };
      qrCode?: { cid: string; description: string };
      gallery?: Array<{ cid: string; description: string }>;
    };
  };
};
