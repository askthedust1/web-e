import axios from 'axios'

const clientApi = axios.create({
  baseURL: '/api/',
})

const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function retryRequest(instance: typeof clientApi) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config
      const method = config?.method

      if (['get'].includes(method) && !config.__retried) {
        config.__retried = true
        try {
          return await instance.request(config)
        } catch {
          return { data: null }
        }
      }

      if (['get'].includes(method)) {
        return { data: null }
      }

      return Promise.reject(error)
    }
  )
}

retryRequest(clientApi)
retryRequest(serverApi)

export { clientApi, serverApi }
