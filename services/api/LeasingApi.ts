import { serverApi } from "./apiService";

export interface LeasingParams {
  for_who?: string
}

export const LeasingApi = {
  getLeasing(local: string, params?: LeasingParams) {
    return serverApi.get("leasing", {
      headers: {
        'Accept-Language': local,
      },
      params,
    });
  },
  getLeasingId(slug: string, local: string) {
    return serverApi.get(`leasing/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    });
  },
};
