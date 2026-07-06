import { serverApi } from './apiService'
import { typeFaceParams } from './CreditsApi'
import { MainPage } from './MainModule'

export const MainApi = {
  getMain() {
    return serverApi.get<MainPage>('/main_page')
  },

  getMainPage(local: string, params: typeFaceParams) {
    return serverApi
      .get('/main_page', {
        params,
        headers: {
          'Accept-Language': local,
        },
      })
      .catch((e) => {
        throw e
      })
  },
}
