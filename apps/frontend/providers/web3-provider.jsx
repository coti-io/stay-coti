"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { CHAIN_SUPPORTED } from "@/config/chain";
import React from "react";
import { queryClient } from "@/utils/query-client";

export const config = createConfig(
  getDefaultConfig({
    chains: [CHAIN_SUPPORTED],
    transports: {
      [CHAIN_SUPPORTED.id]: http(),
    },
    ssr: true,
    walletConnectProjectId: process.env.NEXT_PUCLIC_WALLET_CONNECT_PROJECT_ID || "",

    appName: "COTI Community",
    appDescription: "COTI Community",
    appUrl: "https://beta-stay.appscyclone.com/",
    appIcon: "https://beta-stay.appscyclone.com/favicon.png",
  })
);

const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
