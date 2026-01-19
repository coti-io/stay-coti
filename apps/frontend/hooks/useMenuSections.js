import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export function useMenuSections() {
  return useQuery({
    queryKey: ["menuSections"],
    queryFn: async () => {
      const { data } = await api.get("/v1/sections?limit=10");
      return data;
    },
    staleTime: Infinity, // Keep the data fresh forever
    cacheTime: Infinity, // Never remove from cache
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window focuses
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
}