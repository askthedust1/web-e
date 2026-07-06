import { serverApi } from "./apiService";
import { Transfers } from "./TransfersApi.models";

export const TransfersApi = {
  getTransfers(local: string) {
    return serverApi.get<Transfers>("/transfers_page", {
      headers: {
        "Accept-Language": local,
      },
    });
  },
  getTransfersSystem(local: string) {
    return serverApi.get<Transfers>("/transfer_systems", {
      headers: {
        "Accept-Language": local,
      },
    });
  },
  getTransfersId(slug: string, local: string) {
    return serverApi.get(`/transfer_systems/${slug}`, {
      headers: {
        "Accept-Language": local,
      },
    });
  },
};
