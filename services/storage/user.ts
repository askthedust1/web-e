export const RSK_USER = 'RKS_USER'
export const RSK_OPERATOR = 'RSK_OPERATOR'

export const UserStorage = {
  setUserToken(token: string) {
    return localStorage.setItem(RSK_USER, token)
  },
  getUserToken() {
    return typeof window !== 'undefined'
      ? window.localStorage.getItem(RSK_USER)
      : false
  },
  logoutUser() {
    return localStorage.removeItem(RSK_USER)
  },
  setUserTitle(title: string) {
    return localStorage.setItem(RSK_OPERATOR, title)
  },
  getUserTitle() {
    return typeof window !== 'undefined'
      ? window.localStorage.getItem(RSK_OPERATOR)
      : false
  },
  logoutTilte() {
    return localStorage.removeItem(RSK_OPERATOR)
  },
}
