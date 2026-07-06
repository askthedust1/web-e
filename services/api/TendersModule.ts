import {
  RequestTenderPost,
} from 'pages/tenders/[slug]/index.page'
import { clientApi, serverApi } from './apiService'
import { ComplaintProps } from 'pages/tenders/components/complaint'

export interface TenderList {
  id: number
  slug: string
  title: string
  num: string
  plan_sum: string
  address: string
  status: string
  procurement_method: string
  started_at: string
  opened_at: string
  caption: string
  applicationId: number
  result_docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
}

export interface TenderDetailProps {
  id: number
  slug: string
  title: string
  desc: string
  num: string
  plan_sum: string
  address: string
  status: string
  procurement_method: string
  started_at: string
  opened_at: string
  caption: string
  result_docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
  docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
}
export interface TenderAppliction {
  id: number
  docs: {
    id: number
    file: string
  }[]
  tender: {
    id: 1
    slug: string
    title: string
    num: string
    plan_sum: string
    address: string
    status: string
    procurement_method: string
    started_at: string
    opened_at: string
    caption: string
    result_docs: {
      id: 1
      title: string
      ext: string
      file: string
    }[]
  }
  message: string
  fio: string
  phone: string
  email: string
  inn: string
  company: string
  created_at: string
  updated_at: string
  solution?: string
}

export interface RequestComplaintPost {
  tender: number
  message: string
}

export const TendersApi = {
  getTenderListApplications(token: string) {
    return clientApi.get('/tenders_application', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  getTenderList(local: string) {
    return serverApi.get('/tenders', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getTenderListSEO(local: string) {
    return serverApi.get('/tenders_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getTenderDetail(slug: string, locale: string) {
    return serverApi.get(`/tenders/${slug}`, {
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getTenderDetailToken(slug: string, locale: string, token: string) {
    return clientApi.get(`/tenders/${slug}`, {
      headers: {
        'Accept-Language': locale,
        Authorization: `Token ${token}`,
      },
    })
  },
  postTenderAplication(token: string, data: RequestTenderPost) {
    return clientApi.post(`/tenders_application`, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },

  postTenderFilesAplication(token: string, data: FormData) {
    return clientApi.post(`/tenders_application_doc`, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  postTenderFilesComplaints(data: FormData, token: string) {
    return clientApi.post(`/tenders_claim_doc`, data, {
      headers: { Authorization: `Token ${token}` },
    })
  },
  deleteDocument(id: number, token: string) {
    return clientApi.delete(`/tenders_application_doc/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  resetTender(id: number, token: string) {
    return clientApi.delete(`/tenders_application/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  updateTender(id: number, token: string) {
    return clientApi.patch(`/tenders_application/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  putTender(id: number, token: string, data: RequestTenderPost) {
    return clientApi.put(`/tenders_application/${id}`, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  getTenderAoolicationDeteil(id: number, token: string) {
    return serverApi.get(`/tenders_application/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  getTenderComplaints(locale: string, id: number, token?: string) {
      const headers: Record<string, string> = { 'Accept-Language': locale }
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      return clientApi.get(`/tenders_claim_list/${id}`, { headers })
  },
  getUserTenderComplaints(token: string) {
    return clientApi.get(`/tenders_claim`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  postTenderComplaints(data: ComplaintProps, token?: string) {
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    return clientApi.post(`/tenders_claim`, data, {
      headers,
    });
  },
}
