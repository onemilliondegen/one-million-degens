"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect, useReadContract, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { CHAIN, OMD_ADDR, DEGEN_ADDR, OMD_ABI, ERC20_ABI } from "./omd";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [CHAIN],
  connectors: [injected()],
  transports: { [CHAIN.id]: http("https://rpc.mainnet.chain.robinhood.com", { timeout: 8000 }) },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export function useOmd() {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: bal } = useBalance({ address });

  const { data: minted } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "minted", query: { enabled: true, refetchInterval: 8000 } });
  const { data: burned } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "totalBurned", query: { enabled: true, refetchInterval: 8000 } });
  const { data: mintPrice } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "mintPrice", query: { enabled: true } });
  const { data: tokenPrice } = useReadContract({ address: OMD_ADDR as `0x${string}`, abi: OMD_ABI, functionName: "tokenPrice", query: { enabled: true } });
  const { data: allow } = useReadContract({ address: DEGEN_ADDR as `0x${string}`, abi: ERC20_ABI, functionName: "allowance", args: [address ?? "0x0", OMD_ADDR as `0x${string}`], query: { enabled: !!address } });

  return { address, connect, connectors, disconnect, bal, minted, burned, mintPrice, tokenPrice, allow };
}
