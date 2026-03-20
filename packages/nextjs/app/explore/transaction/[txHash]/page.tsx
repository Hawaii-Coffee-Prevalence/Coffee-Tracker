import type { NextPage } from "next";
import { Hash } from "viem";
import TransactionPageClient from "~~/components/explore/transaction/TransactionPageClient";
import { isZeroAddress } from "~~/utils/scaffold-eth/common";

type PageProps = {
  params: Promise<{ txHash?: Hash }>;
};

export function generateStaticParams() {
  // An workaround to enable static exports in Next.js, generating single dummy page.
  return [{ txHash: "0x0000000000000000000000000000000000000000" }];
}
const TransactionPage: NextPage<PageProps> = async (props: PageProps) => {
  const params = await props.params;
  const txHash = params?.txHash as Hash;

  if (isZeroAddress(txHash)) return null;

  return <TransactionPageClient txHash={txHash} />;
};

export default TransactionPage;
