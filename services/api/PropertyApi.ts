import { serverApi } from "./apiService";
import { PropertyApiProps } from "./PropertyApiModule";

interface Params {
  page: string;
  page_size: string;
}
export const PropertyApi = {
  getProperty(params: Params, local: string) {
    return serverApi.get<PropertyApiProps>("/ownerships", {
      params,
      headers: {
        "Accept-Language": local,
      },
    });
  },
  getNewsDeteil(slug: string, locale: string) {
    return serverApi.get(`/ownerships/${slug}`, {
      headers: {
        "Accept-Language": locale,
      },
    });
  },
};
