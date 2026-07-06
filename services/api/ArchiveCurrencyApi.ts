import { clientApi, serverApi } from './apiService'
export const ArchiveCurrencyApi = {
  getExchange(local: string, params: any) {
    return serverApi.get('/exchanges', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  postFeedback(value: any) {
    return clientApi.post('/feedback', value)
  },
  getCustomerQuestions(lang: string) {
    return serverApi.get(`/customer-questions`, {
      headers: {
        'Accept-Language': lang,
      },
    })
  },
  postCustomerQuestions(value: any) {
    return clientApi.post('/customer-feedback', value)
  },
  getDetailBranches(value: string) {
    return clientApi.get(`/branches/${value}`)
  },
  getDetailBranchesByPublicId(publicId: string) {
    return clientApi.get(`/branches/resolve/${publicId}`)
  },
  getDetailQRBranchesByPublicId(publicId: string) {
    return serverApi.get(
      `/card_application_qr/branch_info?branch_id=${publicId}`
    )
  },
  getFeedbackDoc(local: string, params: any) {
    return serverApi.get(`/feedback-docs`, {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
}
