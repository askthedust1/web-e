import { serverApi } from "./apiService";
import { Credits } from "./CreditsApiModule";

export const DepozitsApi = {
    getDepozits(local: string, params: any) {
      return serverApi.get<Credits>("/deposits_page", {
        headers: {
          'Accept-Language': local,
        },
        params
      });
    },
    getDepozitsId(slug: string, local: string) {
        return serverApi.get(`/deposits/${slug}` ,{
          headers: {
            'Accept-Language': local,
          },
        });
      },
    getDepozitsBanner(local: string){
        return serverApi.get("/deposits", {
          headers: {
            'Accept-Language': local,
          },
        });
    }
  };
  