import api, { setDisconnectWallet, STORAGE_AUTH_KEY } from "@/utils/api";
import { queryClient, persister } from "@/utils/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

const signIn = async ({ address }) => {
  const res = await api.post("/v1/users/sign-in", { walletAddress: address });
  return res.data;
};

const verifySignIn = async ({ signature, walletAddress }) => {
  const res = await api.post("/v1/users/sign-in/verify", {
    signature,
    walletAddress,
  });
  return res.data;
};

export default function useAuth() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  const { signMessage } = useSignMessage();

  const { data: isTokenAvailable } = useQuery({
    queryKey: ["authState"],
    queryFn: () => !!queryClient.getQueryData([STORAGE_AUTH_KEY]),
    initialData: () => !!queryClient.getQueryData([STORAGE_AUTH_KEY]),
    refetchInterval: 1000,
  });

  const isLoggedIn = useMemo(() => isTokenAvailable && isConnected, [isConnected, isTokenAvailable]);

  const logout = useCallback(() => {
    queryClient.removeQueries({ queryKey: STORAGE_AUTH_KEY, exact: true });
    queryClient.setQueryData([STORAGE_AUTH_KEY], null);
    persister.removeClient();
    disconnect();
  }, [disconnect]);

  const loginVerifyMutation = useMutation({
    mutationFn: verifySignIn,
    onSuccess: (res) => {
      setIsLoading(false);
      queryClient.setQueryData([STORAGE_AUTH_KEY], res.data);
    },
    onError: () => {
      setIsLoading(false);
      disconnect();
    },
  });

  const handleSignMessage = ({ message }) => {
    signMessage(
      { message },
      {
        onSuccess: (signature) => {
          if (!address) return;
          loginVerifyMutation.mutate({
            signature,
            walletAddress: address,
          });
        },
        onError: () => {
          setIsLoading(false);
          logout();
        },
      }
    );
  };

  const loginMutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (res) => {
      if (!res.data) return;
      setIsLoading(true);
      handleSignMessage({ message: res.data });
    },
    onError: () => {
      disconnect();
    },
  });

  const handleConnect = useCallback(async () => {
    const res = await connectAsync({
      connector: metaMask(),
    });
    if (!res || !res.accounts?.length) return;
    loginMutation.mutate({ address: res.accounts?.[0] });
  }, [connectAsync, loginMutation]);

  useEffect(() => {
    setDisconnectWallet(logout);
  }, [logout]);

  useEffect(() => {
    if (!isTokenAvailable) {
      const timer = setTimeout(() => disconnect(), 500);
      return () => clearTimeout(timer);
    }
  }, [isTokenAvailable, disconnect]);

  return {
    isLoggedIn,
    login: loginMutation.mutate,
    logout,
    onLogin: handleConnect,
    isLoading,
  };
}
