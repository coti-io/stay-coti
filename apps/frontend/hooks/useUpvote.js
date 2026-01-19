import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpvote() {
  const queryClient = useQueryClient();

  const { mutateAsync: upvote, isPending } = useMutation({
    mutationFn: async ({ ideaId, transactionHash }) => {
      const response = await api.post("/v1/ideas/upvote", {
        ideaId,
        transactionHash: transactionHash,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ideas"]);
    },
  });
  return { upvote, isPending };
}
