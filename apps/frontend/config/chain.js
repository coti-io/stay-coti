const cotiTestnet = {
  id: 7082400,
  name: "COTI Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "COTI Testnet",
    symbol: "COTI",
  },
  rpcUrls: {
    default: { http: ["https://testnet.coti.io/rpc"] },
    public: { http: ["https://testnet.coti.io/rpc"] },
  },
  blockExplorers: {
    default: { name: "COTI Testnet", url: "https://testnet.cotiscan.io" },
  },
};

const cotiMainnet = {
  id: 2632500,
  name: "COTI Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "COTI Mainnet",
    symbol: "COTI",
  },
  rpcUrls: {
    default: { http: ["https://mainnet.coti.io/rpc"] },
    public: { http: ["https://mainnet.coti.io/rpc"] },
  },
  blockExplorers: {
    default: { name: "COTI Mainnet", url: "https://mainnet.cotiscan.io" },
  },
};

export const _CHAIN_SUPPORTED = {
  7082400: cotiTestnet,
  2632500: cotiMainnet,
};

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 7082400;

export const CHAIN_SUPPORTED = _CHAIN_SUPPORTED[CHAIN_ID];
