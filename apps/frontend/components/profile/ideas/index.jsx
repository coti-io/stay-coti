import IdeasTable from "@/components/ideas-table";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Ideas() {
  const { getIdeas } = useProfile();
  const { isLoggedIn } = useAuth();

  const { data: ideas, isLoading } = useQuery({
    queryKey: ["ideas"],
    queryFn: getIdeas,
    enabled: isLoggedIn,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return (
    <div>
      <IdeasTable ideas={ideas?.allIdeas ?? []} isLoading={isLoading}/>
    </div>
  );
}
