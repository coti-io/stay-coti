"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import Link from "next/link";
import { truncateAddress } from "@/utils/helpers";
import useAuth from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

export default function AccountModal() {
  const { address } = useAccount();
  const { logout } = useAuth();
  const getAvatar = (address) => {  return `https://cdn.stamp.fyi/avatar/eth:${address}?s=300`}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="purple">
          <div className="flex justify-between items-center gap-3">
            <div className="size-6 border overflow-hidden mx-auto md:mx-0 border-border rounded-full">
              <img src={getAvatar(address)} alt="user" />
            </div>
            {truncateAddress(address)}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]">
        <Link href="/profile">
          <DropdownMenuItem>
            <User /> Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
