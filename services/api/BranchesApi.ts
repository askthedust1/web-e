import { clientApi, serverApi } from 'services/api/apiService'
import { Bankomats, Branches, BranchesResponse, Cities } from './BranchesApimodule'

export const ServicePoints = {
  getAllPoints(local: string, service: string, params?: any) {
    return serverApi.get<BranchesResponse>(`/${service}`, {
      headers: {
        'Accept-Language': local,
      },
      params: params
    })
  },
  getAllPointsClient(local: string, service: string, params?: any) {
    return clientApi.get<BranchesResponse>(`/${service}`, {
      headers: {
        'Accept-Language': local,
      },
      params: params
    })
  },
  getBranchesPage(local: string) {
    return serverApi.get<BranchesResponse>('/branches_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getBranches(local: string) {
    return serverApi.get<Branches>('/branches', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getCities(local: string, params?: any) {
    return serverApi.get<Cities>('/cities', {
      headers: {
        'Accept-Language': local,
      },
      params: params
    })
  },
  getRegions(local: string) {
    return serverApi.get('/regions', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getBankomats(local: string) {
    return serverApi.get<Bankomats>('/bankomats', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getFilterData(
    key: string,
    city: string,
    search: string,
    day: string,
    local: string
  ) {
    return serverApi.get(
      `${key}?city=${city || ''}&search=${search || ''}&${
        day && 'day_n_night'
      }=${day || ''}`,
      {
        headers: {
          'Accept-Language': local,
        },
      }
    )
  },
  getDetailInfo(slug: string, service: string, local: string) {
    return clientApi.get(`/${service}/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSearch(service: string, search: string, local: string) {
    return clientApi.get(`/${service}?search=${search + ' '}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
}
