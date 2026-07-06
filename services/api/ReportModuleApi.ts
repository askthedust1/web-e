import { serverApi } from './apiService'

export interface ReportsApiProps {
  count: number
  next: string
  previous: string
  page_count: number
  results: {
    id: number
    title: string
    ext: string
    file: string
  }[]
}

export const ReportsApi = {
  getReports(
    local: string,
    params: { type: string | string[]; page: string; page_size: string }
  ) {
    return serverApi.get(`/reports`, {
      params,
      headers: {
        'Accept-Language': local,
      },
    })
  },
}
