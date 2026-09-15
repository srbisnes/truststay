"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "3fbb6bba6f1de962d911bb5b5c9dba48";

export const config = getDefaultConfig({
  appName: "TrustStay",
  projectId,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  ssr: true,
});
