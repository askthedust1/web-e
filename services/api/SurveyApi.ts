import { serverApi, clientApi } from './apiService'
import { SurveyData, SurveySubmitPayload } from './SurveyApi.models'

export const SurveyApi = {
  getSurvey(slug: string, locale: string) {
    return serverApi.get<SurveyData>(`/survey/${slug}/`, {
      headers: { 'Accept-Language': locale },
    })
  },

  submitSurvey(slug: string, data: SurveySubmitPayload) {
    return clientApi.post(`/survey/${slug}/submit/`, data)
  },
}
