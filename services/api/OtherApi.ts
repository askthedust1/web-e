import { FormBanking } from 'pages/mobile-banking/order-internet-banking/index.page'
import { OverdraftApplication } from 'pages/online-service/order-over-draft/overdraft'
import { SalaryProjectApplication } from 'pages/online-service/order-over-draft/salary-project'
import { FormPostTerminal } from 'pages/pos-terminal/order-terminal/index.page'
import { FormRko } from 'pages/rko/order-rko/index.page'
import { clientApi, serverApi } from './apiService'
import {
  DiscountPage,
  GoldBars,
  OwerDraft,
  PostTerminalPage,
  RkoInfoProps,
  RkoProps,
  Securities,
  Shipping,
} from './OtherApimodule'
import { ResumeFormData } from 'models/resume'

export const OtherPageApi = {
  getOnlineServiceList(local: string, params: { for_who: string | string[] }) {
    return serverApi.get('/online_services_page', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  getOhersList(local: string, params: any) {
    return serverApi.get('/others_page', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  getDiscount(local: string) {
    return serverApi.get<DiscountPage>('/discount_club_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSecurities(local: string, params: any) {
    return serverApi.get<Securities>('/securities_page', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  getShipping(local: string, params: any) {
    return serverApi.get<Shipping>('/shipping_page', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  getGoldBars(local: string) {
    return serverApi.get<GoldBars>('/gold_bars_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getOwerDraft(local: string) {
    return serverApi.get<OwerDraft>('/overdraft_application_info', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getPostTerminalPage(local: string) {
    return serverApi.get<PostTerminalPage>('/pos_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getRko(local: string, params: any) {
    return serverApi.get<RkoProps>('/rko_page', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  getDocOperation(local: string, params: any) {
    return serverApi.get<RkoProps>('/doc_operations_page', {
      headers: {
        'Accept-Language': local,
      },
      params,
    })
  },
  getRkoInfo(local: string) {
    return serverApi.get<RkoInfoProps>('/rko_application_info', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getRegions(local: string) {
    return serverApi.get('/regions', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getDepartments(local: string) {
    return serverApi.get('/departments', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getDepartmentsClient(local: string) {
    return clientApi.get('/departments', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getOverDraftPage(local: string) {
    return serverApi.get('/overdraft_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSafeBoxes(local: string) {
    return serverApi.get('/safeboxes_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSalaryProject(local: string) {
    return serverApi.get('/salary_projects_page', {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getRskBasicPage(local: string, slug: string) {
    return serverApi.get(`/basic_page/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSustainable(local: string) {
    return serverApi.get(`/sustainable_development`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSustainableDetail(slug: string, local: string) {
    return serverApi.get(`/sustainable_development/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getSustainableDetailClient(slug: string, local: string) {
    return clientApi.get(`/sustainable_development/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getHrStuff(local: string) {
    return serverApi.get(`/hr_page`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getCorporateLifePage(local: string) {
    return serverApi.get(`/corporate-life`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
  getHrStuffStories(
    locale: string,
    params: {
      page: string | number
      page_size: string | number
      for_who?: string | null | undefined | string[]
    }
  ) {
    return serverApi.get(`hr_page/success-stories`, {
      params,
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getHrStuffStoriesClient(
    locale: string,
    params: {
      page: string | number
      page_size: string | number
      for_who?: string | null | undefined | string[]
    }
  ) {
    return clientApi.get(`hr_page/success-stories`, {
      params,
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getInternshipsClient(
    locale: string,
    params: {
      page: string | number
      page_size: string | number
      direction?: string
      for_who?: string | null | undefined | string[]
    }
  ) {
    return clientApi.get(`/internships`, {
      params,
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getInternshipDetails(slug: string, locale: string) {
    return clientApi.get(`/internships/${slug}`, {
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getInternshipsServer(
    locale: string,
    params: {
      page: string | number
      page_size: string | number
      for_who?: string | null | undefined | string[]
    }
  ) {
    return serverApi.get(`/internships`, {
      params,
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getInternshipsDepartments(locale: string) {
    return serverApi.get(`/internship-directions`, {
      headers: {
        'Accept-Language': locale,
      },
    })
  },
  getHrStuffDetail(slug: string, local: string) {
    return serverApi.get(`/hr_page/success-story/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },

  getBankCards(slug: string, local: string) {
    return serverApi.get(`/bank-cards/order-card/${slug}`, {
      headers: {
        'Accept-Language': local,
      },
    })
  },
}

export const OtherCreateApi = {
  createPostTerminal(data: FormPostTerminal) {
    return clientApi.post<number>('/pos_application', data)
  },
  createOwerDraft(data: OverdraftApplication) {
    return clientApi.post<number>('/overdraft_application', data)
  },
  createSalaryProject(data: SalaryProjectApplication) {
    return clientApi.post<number>('/salary_project_application', data)
  },
  createIntenetBanking(data: FormBanking) {
    return clientApi.post<number>('/banking_application', data)
  },
  createRko(data: FormRko) {
    return clientApi.post<number>('/rko_application', data)
  },
  createResume(data: ResumeFormData) {
    return clientApi.post('/resume-form', data)
  },
}
