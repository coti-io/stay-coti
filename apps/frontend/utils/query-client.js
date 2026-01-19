import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { deserialize, serialize } from "wagmi";
import { STORAGE_AUTH_KEY } from "./api";

const DAY_IN_MS = 1000 * 60 * 60 * 24 * 6;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      retry: false,
      refetchOnWindowFocus: false,
      gcTime: DAY_IN_MS,
      staleTime: DAY_IN_MS,
    },
  },
});

export const persister = createSyncStoragePersister({
  serialize,
  storage: typeof window !== "undefined" ? window.localStorage : null,
  deserialize,
});

if (typeof window !== "undefined") {
  persistQueryClient({
    queryClient: queryClient,
    persister,
    maxAge: DAY_IN_MS,
    dehydrateOptions: {
      shouldDehydrateQuery: ({ queryKey }) => {
        const WHITELISTED_KEYS = [STORAGE_AUTH_KEY, "faucetAddresses"];

        return WHITELISTED_KEYS.some((key) => queryKey.includes(key));
      },
      serializeData: (state) => {
        if (state?.timestamp < Date.now() - DAY_IN_MS) {
          return undefined;
        }
        return state;
      },
    },
  });
}
