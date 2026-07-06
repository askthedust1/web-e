import { useEffect, useState } from 'react'
import { RecaptchaApi, RecaptchaData } from 'services/api/RecaptchaApi'

export function useRecaptcha() {
  const [recaptcha, setRecaptcha] = useState<RecaptchaData | null>(null)

  useEffect(() => {
    const fetchRecaptcha = async () => {
      try {
        const cached = localStorage.getItem('recaptcha')
        if (cached) {
          const parsed = JSON.parse(cached)
          setRecaptcha(parsed)
          return
        }

        const { data } = await RecaptchaApi.getRecaptchaClient()
        setRecaptcha(data)
        localStorage.setItem('recaptcha', JSON.stringify(data))
      } catch (e) {}
    }

    fetchRecaptcha()
  }, [])

  return { recaptcha }
}
