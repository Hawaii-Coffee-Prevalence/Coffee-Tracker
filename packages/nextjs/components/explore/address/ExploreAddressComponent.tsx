"use client";

import { AddressInfoCard } from "./AddressInfoCard";
import { ExploreContractTabs } from "./ExploreContractTabs";
import { Address as AddressType } from "viem";

export const ExploreAddressComponent = ({
  address,
  contractData,
}: {
  address: AddressType;
  contractData: { bytecode: string; assembly: string } | null;
}) => {
  return (
    <div className="container mx-auto px-4 md:px-0 m-10 mb-20">
      <AddressInfoCard address={address} />
      <ExploreContractTabs address={address} contractData={contractData} />
    </div>
  );
};
