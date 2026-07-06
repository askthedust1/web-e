import { CreditOrderProps } from "models/creditOrder";
import { clientApi, serverApi } from "./apiService";
import { Credits } from "./CreditsApiModule";

export interface typeFaceParams {
  for_who: string
}
export const CreditsApi = {
  getCredits(local: string, params: typeFaceParams ) {
    return serverApi.get<Credits>("/credits_page", {
      headers: {
        'Accept-Language': local,
      },
      params
    });
  },
  getCreditsList(local: string, params: typeFaceParams) {
    return serverApi.get("/credits", {
      headers: {
        'Accept-Language': local,
      },
      params
    });
  },
  getCreditsId(slug: string, local: string) {
    return serverApi.get(`/credits/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    });
  },
};

export const CreditOrderApi = {
  orderCredit(data: CreditOrderProps) {
    return clientApi.post<number>("/credit_application", data);
  },
  getCreditOrderInfo(local: string) {
    return serverApi.get(`/credit_application_info`, {
      headers: {
        'Accept-Language': local,
      },
    });
  },
  getCreditBankBranchList(local: string) {
    return serverApi.get(`/bank_branch`, {
      headers: {
        'Accept-Language': local,
      },
    });
  },
};
