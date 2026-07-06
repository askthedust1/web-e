import { serverApi } from "./apiService";

export const PublicOfferApi = {
  getPublicOffer(local: string, params: any) {
    return serverApi.get(`/public_offers`, {
      params,
      headers: {
        "Accept-Language": local,
      },
    });
  },
};
