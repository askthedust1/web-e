import { serverApi } from "./apiService";

export const TarifssApi = {
  getTarifs(local: string, params: any) {
    return serverApi.get(`/tariffs`, {
      params,
      headers: {
        "Accept-Language": local,
      },
    });
  },
  getTarifsSEO(local: string) {
    return serverApi.get(`/tariffs_page`, {
      headers: {
        "Accept-Language": local,
      },
    });
  },
};
