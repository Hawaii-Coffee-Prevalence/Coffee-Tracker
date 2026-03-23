"use client";

import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { DistributeForm } from "~~/components/submit/DistributeForm";
import { HarvestForm } from "~~/components/submit/HarvestForm";
import { ProcessForm } from "~~/components/submit/ProcessForm";
import { RoastForm } from "~~/components/submit/RoastForm";
import { useSelectedNetwork } from "~~/hooks/scaffold-eth";
import { useUserRole } from "~~/hooks/useCoffeeTracker";

const SubmitPage: NextPage = () => {
  const [activeFormTab, setActiveFormTab] = useState<string>("Farmer");
  const { address, chain, isConnected } = useAccount();
  const { userRole } = useUserRole(address);
  const targetNetwork = useSelectedNetwork();

  const isCorrectNetwork = chain?.id === targetNetwork.id;

  const statusItems = useMemo(
    () => [
      {
        label: "Wallet",
        value: isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected",
        tone: isConnected ? "text-primary" : "text-accent",
      },
      {
        label: "Role",
        value: userRole ?? "Unknown",
        tone: userRole !== "User" && userRole !== "Unknown" ? "text-primary" : "text-accent",
      },
      {
        label: "Network",
        value: chain?.name ?? "Disconnected",
        tone: isCorrectNetwork ? "text-primary" : "text-accent",
      },
    ],
    [address, chain?.name, isConnected, isCorrectNetwork, userRole],
  );

  const getActiveForm = () => {
    const role = userRole === "Admin" ? activeFormTab : userRole;

    switch (role) {
      case "Farmer":
        return <HarvestForm />;
      case "Processor":
        return <ProcessForm />;
      case "Roaster":
        return <RoastForm />;
      case "Distributor":
        return <DistributeForm />;
      default:
        return (
          <div className="rounded-box border border-base-300 bg-base-100 px-6 py-10 shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Insufficient Permissions</h3>
            <p className="text-muted">You do not have a supply chain role assigned to submit batches.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[100vh] bg-base-200">
      <section className="max-w-7xl mx-auto section-padding py-14 lg:py-18">
        {/* Admin Role Selector */}
        {userRole === "Admin" && (
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-label text-base-content/60 text-sm">Role: </span>
              <select
                className="select select-sm appearance-none w-fit shrink-0"
                value={activeFormTab}
                onChange={e => setActiveFormTab(e.target.value)}
              >
                {["Farmer", "Processor", "Roaster", "Distributor"].map(tab => (
                  <option key={tab} value={tab}>
                    {tab}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Status Dashboard */}
        <div className="grid gap-4 lg:grid-cols-3">
          {statusItems.map(item => (
            <div key={item.label} className="rounded-box border border-base-300 bg-base-100 px-5 py-4 shadow-sm">
              <div className="text-label text-base-content/60">{item.label}</div>
              <div className={`mt-2 text-xl font-medium break-all ${item.tone}`}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="mt-10">{getActiveForm()}</div>
      </section>
    </div>
  );
};

export default SubmitPage;
