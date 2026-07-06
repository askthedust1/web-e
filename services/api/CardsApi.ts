import { FormSecondStep } from 'pages/bank-cards/order-card/DeliverCard'
import { CurrentDataFirstStep } from 'pages/bank-cards/order-card/index.page'
import {
  BankCards,
  BankCardsTypeOne,
  OrderCardInfoProps,
} from './CardsApModule'
import { clientApi, serverApi } from './apiService'

interface CardsParams {
  type?: string
  category?: string
  payment_system?: string
}
export const CardsApi = {
  getCards(local: string) {
    return serverApi.get<BankCards>('/cards_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getBankCard(local: string) {
    return serverApi.get<BankCards>('/cards_page/bank', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getPaymentCards(local: string) {
    return serverApi.get<BankCards>('/cards_page/payment', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getAllCards(local: string) {
    return serverApi.get<BankCards>('/cards', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getAllCardsBanks(id: number, local: string) {
    return serverApi.get<BankCards>(`/cards?type=BANK&category=${id}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getAllCardsPayment(id: number, local: string) {
    return serverApi.get<BankCards>(`/cards?type=PAYMENT&category=${id}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getCardSlug(slug: string, local: string) {
    return serverApi.get<BankCards>(`/cards/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getCardSlugClient(slug: string, local: string) {
    return clientApi.get<BankCardsTypeOne>(`/cards/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getCardCategories(local: string) {
    return serverApi.get<BankCards>('​/card_categories​', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getOrderCardInfo(local: string) {
    return serverApi.get<OrderCardInfoProps>('/card_order_info', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getAllCardsFilter(params: CardsParams, local: string) {
    return serverApi.get<BankCards>('/cards', {
      params,
      headers: {
        'Accept-Language': local,
      },
    })
  },
  createCardOrderQR(data: any) {
    return clientApi.post<number>('/card_application_qr', data)
  },
}
export const CardOrderApi = {
  createCardOrderFirsStep(data: CurrentDataFirstStep) {
    return clientApi.post<number>('/card_application_1', data)
  },
  updateDeliver(id: number | null, data: FormSecondStep) {
    clientApi.put<number>(`/card_application_2/${id}`, data)
  },
  updateDeteil(id: number | string, data: FormData) {
    return clientApi.put<number>(`/card_application_3/${id}`, data)
  },
}
