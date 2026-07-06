import { Banking, BankingApplicataion } from "./BankingModule";
import { serverApi } from "./apiService";

export const MobilebankingApi = {
  getBanking(local: string, params: { for_who: string }) {
    return serverApi.get<Banking>("/mob_banking_page", {
      headers: {
        "Accept-Language": local,
      },
      params,
    });
  },
  getBankingApplication(local: string, params: { for_who: string }) {
    return serverApi.get<BankingApplicataion>("/internet_banking_page", {
      headers: {
        "Accept-Language": local,
      },
      params,
    });
  },
};
