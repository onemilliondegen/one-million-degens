"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http, useAccount, useDisconnect, useReadContract, useBalance } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit, useAppKit } from "@reown/appkit/react";
import { CHAIN, OMD_ADDR, OMD_ABI } from "./omd";

const PROJECT_ID = "dccbd7d753206338c619079a1143434f";
const RPC = "https://rpc.mainnet.chain.robinhood.com";

const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId: PROJECT_ID,
  networks: [CHAIN as any],
  transports: { [CHAIN.id]: http(RPC, { timeout: 8000 }) },
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [CHAIN as any],
  projectId: PROJECT_ID,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as any}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export function useOmd() {
  const { address } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { data: bal } = useBalance({ address });

  const { data: minted } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "minted", query: { enabled: true, refetchInterval: 8000 } });
  const { data: burned } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "totalBurned", query: { enabled: true, refetchInterval: 8000 } });
  const { data: mintPrice } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "mintPrice", query: { enabled: true } });
  const { data: perWalletLimit } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "perWalletLimit", query: { enabled: true } });
  const { data: walletMinted } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "mintedByWallet", args: [address ?? "0x0"], query: { enabled: !!address, refetchInterval: 8000 } });

  return { address, open, disconnect, bal, minted, burned, mintPrice, perWalletLimit, walletMinted };
}
