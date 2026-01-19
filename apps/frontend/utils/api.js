import axios from "axios";
import { queryClient } from "./query-client";
import { toast } from "sonner";

export const STORAGE_AUTH_KEY = "aai:auth";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY || 'fB7ohctLt5QsJIQYIyn7nhe5K75m6dVd'
  },
});

let disconnectWallet;

export const setDisconnectWallet = (disconnectFn) => {
  disconnectWallet = disconnectFn;
};

api.interceptors.request.use(
  (config) => {
    const token = queryClient.getQueryData([STORAGE_AUTH_KEY]);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      queryClient.setQueryData([STORAGE_AUTH_KEY], null);
      if (disconnectWallet) disconnectWallet();
      if (!error.response?.error?.code) return;
      if (error.response?.error?.code === "error.AuthorizedExpired") {
        return toast.error("Session expired. Please login again.");
      }
      toast.error(error.response?.error?.message || "");
    }
    return Promise.reject(error);
  }
);

export default api;
