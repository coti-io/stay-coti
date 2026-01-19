"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useAccount, useBalance } from "wagmi";
import { Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useProfile from "@/hooks/useProfile";
import Transactions from "@/components/profile/transactions";
import Ideas from "@/components/profile/ideas";
import toast from "react-hot-toast";
import { formatNumber, truncateAddress } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { address } = useAccount();
  const [tab, setTab] = useState("transactions");
  const { isLoggedIn } = useAuth();
  const { data: balance, isLoading } = useBalance({
    address: address,
    query: {
      refetchInterval: 3000,
      staleTime: 0,
    },
  });
  const { getProfile } = useProfile();
  const router = useRouter();

  const getAvatar = (address) => {
    return `https://cdn.stamp.fyi/avatar/eth:${address}?s=300`;
  };

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isLoggedIn,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const copy = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy to clipboard");
        console.error(err);
      });
  };

  if (!isLoggedIn) {
    router.push("/");
    return null;
  }
  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="p-4 md:p-10">
          <CardHeader className="p-0 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="size-28 border overflow-hidden mx-auto md:mx-0 border-border rounded-full">
                <img src={getAvatar(address)} alt="user" />
              </div>
              <div className="grid gap-2">
                <CardTitle className="text-sm md:text-lg break-words grid grid-cols-1 gap-1">
                  User ID: {profile && profile.userId}
                </CardTitle>
                <div className="flex items-center text-sm gap-2">
                  <span className="hidden md:block">{address}</span>
                  <span className="block md:hidden">{truncateAddress(address, 10)}</span>
                  <Copy className="size-4 cursor-pointer" onClick={copy} />
                </div>
                <CardDescription className="text-sm text-black flex font-medium items-center gap-2">
                  {isLoading ? (
                    <div className="h-5 rounded bg-gray-200 w-14 animate-pulse"></div>
                  ) : balance ? (
                    formatNumber(balance.formatted)
                  ) : (
                    "--"
                  )}
                  <div className="size-5">
                    <img src="/icons/coti-token.png" alt="token" />
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-6">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setTab("transactions")}
                  className={`px-4 py-2 relative ${tab === "transactions" ? "text-black" : "text-gray-500"}`}
                >
                  Transactions
                  {tab === "transactions" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                </button>
                <button
                  onClick={() => setTab("ideas")}
                  className={`px-4 py-2 relative ${tab === "ideas" ? "text-black" : "text-gray-500"}`}
                >
                  Ideas
                  {tab === "ideas" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                </button>
              </div>
            </div>

            <div className="mt-4">
              {tab === "transactions" && <Transactions />}
              {tab === "ideas" && <Ideas />}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
