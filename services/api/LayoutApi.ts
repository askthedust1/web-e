import { clientApi } from "./apiService";



export const LayoutApi = {
    getHeader(local: string, params: any) {
      return clientApi.get("/site_settings/with_footer_header", {
        headers: {
          'Accept-Language': local,
        },
        params
      },);
    },
  };
  