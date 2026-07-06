import { clientApi, serverApi } from './apiService'

export const InfoApi = {

  getPageParams(
    path: string,
    local: string,
    regions: string,
    city: string,
    department: string,
    experience: string,
    params: Record<string, any> = {}
  ) {
    const basePath = `/${path}`;

    const queryParams: Record<string, any> = {
      ...params,
    };

    if (department) queryParams.department = department;
    if (regions) queryParams.region = regions;
    if (city) queryParams.city = city;
    if (experience) queryParams.experience = experience;

    return serverApi.get(basePath, {
      params: queryParams,
      headers: {
        'Accept-Language': local,
      },
    });
  },

  getPage(
    path: string,
    local: string,
    regions: string,
    city: string,
    department: string,
    experience: string,
    params: Record<string, any> = {}
  ) {
    const basePath = department || city || regions
      ? `/V2/vacancies`
      : `/V2/${path}`;

    const queryParams: Record<string, any> = {
      ...params,
    };

    if (department) queryParams.department = department;
    if (regions) queryParams.region = regions;
    if (city) queryParams.city = city;
    if (experience) queryParams.experience = experience;

    return serverApi.get(basePath, {
      params: queryParams,
      headers: {
        'Accept-Language': local,
      },
    });
  },

  getPageClient(
    path: string,
    local: string,
    regions: string,
    city: string,
    department: string,
    experience: string,
    params: Record<string, any> = {}
  ) {
    const basePath = department || city || regions
      ? `/V2/vacancies`
      : `/V2/${path}`;

    const queryParams: Record<string, any> = {
      ...params,
    };

    if (department) queryParams.department = department;
    if (regions) queryParams.region = regions;
    if (city) queryParams.city = city;
    if (experience) queryParams.experience = experience;

    return clientApi.get(basePath, {
      params: queryParams,
      headers: {
        'Accept-Language': local,
      },
    });
  },

  getVacancies(
    path: string,
    local: string,
    regions: any,
    page: string,
    page_size: string
  ) {
    return serverApi.get(
      `/${path}/region=${regions}&page=${page}&page_size=${page_size}`,
      {
        headers: {
          'Accept-Language': local,
        },
      }
    )
  },
  getVacancyDeteil(slug: string, local: string) {
    return serverApi.get(`/V2/vacancies/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  vacancyApplication(data: any) {
    return clientApi.post<number>('/V2/vacancy-application', data)
  },
  resumeSubmission(data: any) {
    return clientApi.post<any>('/resume_submission', data)
  },
  internshipResumeSubmission(data: any) {
    return clientApi.post<any>('/internship-application', data)
  },
}
