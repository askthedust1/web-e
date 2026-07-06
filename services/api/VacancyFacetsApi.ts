import { clientApi, serverApi } from './apiService'
import { VacancyFacets, VacancyFilters } from './VacancyFacetsApi.models'

const buildParams = (filters: VacancyFilters) => {
  const params: Record<string, any> = {}
  if (filters.search) params.search = filters.search
  if (filters.region) params.region = filters.region
  if (filters.city) params.city = filters.city
  if (filters.department.length) params.department = filters.department
  return params
}

// axios v1: serialize array params as repeated keys (department=1&department=2),
// not department[]=1 — Django reads request.query_params.getlist('department').
const serializer = { indexes: null as null }

export const VacancyFacetsApi = {
  getFacets(local: string, filters: VacancyFilters, client = false) {
    const api = client ? clientApi : serverApi
    return api.get<VacancyFacets>('/V2/vacancies/facets', {
      params: buildParams(filters),
      paramsSerializer: serializer,
      headers: { 'Accept-Language': local },
    })
  },

  getVacancies(
    local: string,
    filters: VacancyFilters,
    page: string,
    page_size: string,
    for_who: string | null,
    client = false
  ) {
    const api = client ? clientApi : serverApi
    const params: Record<string, any> = { ...buildParams(filters), page, page_size }
    if (for_who) params.for_who = for_who
    return api.get('/V2/vacancies', {
      params,
      paramsSerializer: serializer,
      headers: { 'Accept-Language': local },
    })
  },
}
