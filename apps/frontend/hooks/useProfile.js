import { EXPLORER_URL } from "@/config/common";
import api from "@/utils/api";
import axios from "axios";

export default function useProfile() {
  const getProfile = async () => {
    const res = await api.get("/v1/users/profile");
    return res.data.data;
  };

  const getTransactions = async (address, currentPage, itemsPerPage) => {
    const res = await axios.get(
      `${address}/transactions?firebaseUserId=4SLyFFkgeJeePC39HgcRLLfy1qp1&workspace=Coti+Testnet&page=${currentPage}&itemsPerPage=${itemsPerPage}&orderBy=timestamp&order=desc`,
      {
        baseURL: EXPLORER_URL,
      }
    );
    return res.data
      ? res.data
      : {
          items: [],
          total: 0,
        };
  };

  const getIdeas = async () => {
    const res = await api.get("/v1/users/ideas");
    return res.data.data;
  };

  return { getProfile, getTransactions, getIdeas };
}
