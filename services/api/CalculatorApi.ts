import { CurrentDataProps } from "pages/calculator/index.page";
import {
  CalculatorCreditProps,
} from "./CalculatorModuleApi";
import { clientApi, serverApi } from "./apiService";

export const CalculatorDataApi = {
  getCalculatorDepozit(local: string) {
    return serverApi.get<CalculatorCreditProps>("/deposits_calculator", {
      headers: {
        "Accept-Language": local,
      },
    });
  },
  getCalculatorCredit(local: string) {
    return serverApi.get<CalculatorCreditProps>("/credits_calculator", {
      headers: {
        "Accept-Language": local,
      },
    });
  },
  getCalculatorIslamic(local: string, params?: Record<string, any>) {
    return clientApi.get<CalculatorCreditProps>("/credits_calculator", {
      headers: {
        "Accept-Language": local,
      },
      params
    });
  },
  calculateCredit(data: CurrentDataProps) {
    return clientApi.post<number>("/credits_calculator/calculate", data);
  },
};

