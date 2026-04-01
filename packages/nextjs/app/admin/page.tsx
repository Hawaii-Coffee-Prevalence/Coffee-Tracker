"use client";

import { useMemo } from "react";
import { AdminContractReadWidget } from "./_components/AdminContractReadWidget";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useDeployedContractInfo, useSelectedNetwork } from "~~/hooks/scaffold-eth";
import { useUserRole } from "~~/hooks/useCoffeeTracker";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

const AdminPage: NextPage = () => {
  const contractsData = useAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];
  const primaryContractName = contractNames[0];

  const { address } = useAccount();
  const { userRole, isLoading: isRoleLoading } = useUserRole(address);
  const targetNetwork = useSelectedNetwork();

  const { data: deployedContractInfo } = useDeployedContractInfo({ contractName: primaryContractName });

  const { data: balanceData } = useBalance({
    address: deployedContractInfo?.address,
    query: {
      enabled: !!deployedContractInfo?.address,
    },
  });

  const contractAddress = deployedContractInfo?.address ?? "Not Deployed";
  const formattedBalance = balanceData ? `${formatEther(balanceData.value)} ${balanceData.symbol}` : "0 ETH";

  const topWidgets = useMemo(
    () => [
      {
        label: primaryContractName || "Contract Name",
        value: contractAddress !== "Not Deployed" ? contractAddress : "Not Found",
        tone: deployedContractInfo ? "text-success" : "text-accent",
      },
      {
        label: "Balance",
        value: formattedBalance,
        tone: "text-primary",
      },
      {
        label: "Network",
        value: targetNetwork.name,
        tone: "text-primary",
      },
    ],
    [deployedContractInfo, contractAddress, formattedBalance, targetNetwork.name, primaryContractName],
  );

  if (isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (userRole !== "Admin") {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-base-200 flex items-center justify-center">
        <div className="rounded-xl border border-base-300 bg-base-100 px-6 py-10 shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-2">Insufficient Permissions</h3>
          <p className="text-muted">You must have the DEFAULT_ADMIN_ROLE to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-base-200">
      <section className="max-w-7xl mx-auto flex flex-col section-padding">
        {/* Top Widgets Dashboard */}
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          {topWidgets.map(item => (
            <div
              key={item.label}
              className="rounded-xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm flex flex-col min-w-0"
            >
              <div className="text-sm font-semibold text-muted mb-1">{item.label}</div>
              <div className={`text-xl font-medium break-all truncate ${item.tone}`}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* 2-Column Layout Below */}
        <div className="grid gap-4 lg:grid-cols-3 flex-1 min-h-[600px]">
          {/* Left Column (takes 1/3 width to match top-left widget of grid-cols-3) */}
          <div className="lg:col-span-1 h-full">
            {primaryContractName ? <AdminContractReadWidget contractName={primaryContractName} /> : null}
          </div>

          {/* Right Column (takes 2/3 width) - Empty Scrollable Div */}
          <div className="lg:col-span-2 h-full rounded-xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-muted">Additional Data (Placeholder)</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
