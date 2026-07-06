import { Banking } from './BankingModule'
import { clientApi, serverApi } from './apiService'
import { FormAcquiring } from 'pages/online-service/order-internet-acquiring/index.page'
import { FormQR } from 'pages/online-service/qr-code/index.page'

export interface IInternetAcquiringPage {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string | null
  og_description: string
  banner_title: string
  banner_title_hex: string
  banner_subtitle: string
  banner_subtitle_hex: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string | null
  banner_image_mob: string | null
  banner_bg: string | null
  banner_bg_mob: string | null
  id: number
  about: string
  support_phone: string
  support_email: string
  application_caption: string
  personal_data_processing: string | null
}

export const InternetAcquiringModule = {
  getInternetAcquiringInfo(local: string, _params: { for_who: string }) {
    return serverApi.get<Banking>('/internet_acquiring_page', {
      headers: {
        'Accept-Language': local,
      },
      params: {
        for_who: 'legal',
      },
    })
  },
  createInternetAcquiring(data: FormAcquiring) {
    return clientApi.post<number>('/internet_acquiring_application', data)
  },
  createQRApplication(data: FormQR) {
    return clientApi.post<number>('/qr-web-application', data)
  },
}
