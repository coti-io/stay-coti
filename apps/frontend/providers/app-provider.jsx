"use client";

import React from "react";
import useAuth from "@/hooks/useAuth";
import { useModal } from "connectkit";

export default function AppProvider({ children }) {
  const { login, logout } = useAuth();

  useModal({
    onConnect: ({ address }) => {
      if (address) login({ address });
    },
    onDisconnect: () => {
      logout();
    },
  });

  return <>{children}</>;
}
