export const CHAIN_ID = 4663;
export const CHAIN = {
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
} as any;

// One Million Degens — deployed on Robinhood Chain.
// v1 active (back to original setup, 20 Aug 2026). v2 relaunch attempt retired: 0x70FB502FFDc4a0e795FB34332bDeC29A248218FD.
export const OMD_ADDR = "0x0fE635f441829B7BfA5D2B3a44344caAe367d38F";

// $DEGEN token — deployed by owner.
export const DEGEN_ADDR = "0x9e76886e9e6BCc808472151Cb99F9919e237997f";

export const OMD_ABI = [
  { inputs: [], name: "mintPrice", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "tokenPrice", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "paymentToken", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "maxSupply", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "minted", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalBurned", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "perWalletLimit", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "account", type: "address" }], name: "mintedByWallet", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "paused", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "qty", type: "uint256" }], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ name: "qty", type: "uint256" }], name: "mintWithToken", outputs: [], stateMutability: "nonpayable", type: "function" },
] as const;

export const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], name: "allowance", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
] as const;

export const LIVE = true;
