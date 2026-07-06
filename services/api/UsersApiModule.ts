import { RegistrationProps } from 'pages/tenders/components/registration'
import { clientApi } from './apiService'
import { LoginProps } from 'pages/tenders/components/login'

export interface UserData {
  id: number
  username: string
  email: string
  phone: string
  inn: string
  company: string
  fio: string
  tender: {
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
    result_docs: {
      id: number
      title: string
      ext: string
      file: string
    }[]
  }
}

export const UserApi = {
  postUsers(data: RegistrationProps) {
    return clientApi.post('/users', data)
  },
  loginUser(data: LoginProps) {
    return clientApi.post('/token/login', data)
  },
  getUserDataByToken(token: string) {
    return clientApi.get('/users/me', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
  editUserPrifle(data: any, token: string) {
    return clientApi.put('/users/me', data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  },
}
