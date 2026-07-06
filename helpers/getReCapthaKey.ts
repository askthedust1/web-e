import { RECAPCHA_KEY } from 'constants/capthca-key'
import { load } from 'recaptcha-v3'

export const getReCaptchaKey = async (key?: string) => {
  const recaptchaFn = await load(key || RECAPCHA_KEY, { autoHideBadge: false })

  if (recaptchaFn) {
    const captchaKey = await recaptchaFn.execute('login')
    return captchaKey.length ? captchaKey : null
  }
}
