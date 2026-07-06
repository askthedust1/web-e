import { serverApi } from './apiService'
import {
  IslamicProductDetail,
  IslamicProductList,
  IslamicWindowBranchesResponse,
  IslamicWindowPage,
} from './IslamicWindowModule'

export const IslamicWindowApi = {
  getPage(locale: string) {
    return serverApi.get<IslamicWindowPage>('/islamic_window_page', {
      headers: { 'Accept-Language': locale },
    })
  },
  getProductsList(locale: string) {
    return serverApi.get<IslamicProductList>('/islamic_products', {
      headers: { 'Accept-Language': locale },
    })
  },
  getProductDetail(slug: string, locale: string) {
    return serverApi.get<IslamicProductDetail>(`/islamic_products/${slug}`, {
      headers: { 'Accept-Language': locale },
    })
  },
  getBranches(locale: string) {
    return serverApi.get<IslamicWindowBranchesResponse>('/islamic_window_branches', {
      headers: { 'Accept-Language': locale },
    })
  },
}
