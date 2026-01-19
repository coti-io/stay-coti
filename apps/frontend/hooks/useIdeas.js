import { useQuery } from "@tanstack/react-query";
import api  from "@/utils/api";

export function useIdeas({
  limit = 10,
  page = 0,
  search = "",
  categoryId = "",
  orderBy = "_publishedAt",
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  refetchOnConnect = false,
  address = null,
}) {
  return useQuery({
    queryKey: ["ideas", { limit, page, search, categoryId, orderBy, address }],
    queryFn: async () => {
      const { data } = await api.get(
        `/v1/ideas?limit=${limit}&search=${search}&categoryId=${categoryId}&page=${page}&orderByKey=${orderBy}&orderByValue=DESC`
      );
      return data;
    },
    enabled: true,
  });
}
