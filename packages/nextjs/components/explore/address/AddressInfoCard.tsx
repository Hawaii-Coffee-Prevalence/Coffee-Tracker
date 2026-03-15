"use client";

import { Balance } from "@scaffold-ui/components";
import { Address as AddressType } from "viem";
import { useBytecode } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useUserRole } from "~~/hooks/useCoffeeTracker";

export const AddressInfoCard = ({ address }: { address: AddressType }) => {
  const { userRole } = useUserRole(address);
  const { data: bytecode } = useBytecode({ address });
  const isContract = bytecode && bytecode !== "0x";

  return (
    <div className="w-full mb-8">
      <div className="bg-base-100 border border-base-300 rounded-xl p-6 lg:p-8 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <BlockieAvatar address={address} size={40} />
          <span className="text-lg break-all">{address}</span>
        </div>

        <div className="flex gap-6 items-center flex-wrap mt-4">
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold tracking-wide uppercase text-base-content">Balance:</span>
            <div className="font-medium text-md text-base-content/80 text-left [&_*]:!text-base-content/80">
              <Balance address={address} />
            </div>
          </div>

          <div className="w-px h-6 bg-base-300 hidden sm:block"></div>

          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold tracking-wide uppercase text-base-content">Role:</span>
            <div className="font-medium text-md text-base-content/80 text-left capitalize">
              {isContract ? (
                "Contract"
              ) : !userRole ? (
                <span className="opacity-50 text-sm loading loading-dots loading-sm"></span>
              ) : userRole === "User" ? (
                "User"
              ) : (
                userRole
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
