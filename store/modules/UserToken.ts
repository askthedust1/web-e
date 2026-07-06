import { makeAutoObservable } from 'mobx'
import { RSK_USER } from 'services/storage/user'

const _getToken = async () => {
  const TOKEN = ''
  return TOKEN
}
const _getUserToken = () => {
  return typeof window !== 'undefined'
    ? window.localStorage.getItem(RSK_USER)
    : false
}
export class UserTokenRsk {
  token: string = ''

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setUserToken(userToken: string) {
    this.token = userToken
  }
}
