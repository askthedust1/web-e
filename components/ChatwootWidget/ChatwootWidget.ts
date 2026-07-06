import { useEffect } from 'react'

declare global {
  interface Window {
    kulpunaiSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void
    }
  }
}

export default function ChatwootWidget() {
  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_KULPUNAI_API_URL
    const WEBSITE_TOKEN = process.env.NEXT_PUBLIC_KULPUNAI_API_KEY

    if (!BASE_URL) {
      console.error(
        '[KulpunaiWidget] NEXT_KULPUNAI_API_URL не задан. Виджет не будет загружен.'
      )
      return
    }

    if (!WEBSITE_TOKEN) {
      console.error(
        '[KulpunaiWidget] NEXT_KULPUNAI_API_KEY не задан. Виджет не будет загружен.'
      )
      return
    }

    const script = document.createElement('script')
    script.src = `${BASE_URL}/packs/js/sdk.js`
    script.async = true

    script.onload = () => {
      if (!window.kulpunaiSDK?.run) {
        console.error(
          '[KulpunaiWidget] SDK загружен, но kulpunaiSDK.run не найден.'
        )
        return
      }

      window.kulpunaiSDK.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      })
    }

    script.onerror = () => {
      console.error(`[KulpunaiWidget] Не удалось загрузить SDK: ${script.src}`)
    }

    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
