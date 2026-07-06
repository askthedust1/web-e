import { clientApi, serverApi } from './apiService'

export interface RecaptchaData {
  recaptcha_v2_site_key: string,
  recaptcha_v3_site_key: string
}

export const RecaptchaApi = {
  getRecaptcha() {
    return serverApi.get<RecaptchaData>(`/recaptcha-config`)
  },
  getRecaptchaClient() {
    return clientApi.get<RecaptchaData>(`/recaptcha-config`)
  },
}