import { serverApi } from './apiService'
import {
  InvestorPage,
  InvestorSectionDetail,
} from './InvestorRelationsApi.models'

export const InvestorRelationsApi = {
  getInvestorRelations(local: string) {
    return serverApi.get<InvestorPage[]>('/investor_relations', {
      headers: { 'Accept-Language': local },
    })
  },
  getInvestorRelationsDetail(slug: string, local: string) {
    return serverApi.get<InvestorSectionDetail>(`/investor_relations/${slug}`, {
      headers: { 'Accept-Language': local },
    })
  },
}
