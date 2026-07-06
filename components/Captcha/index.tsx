import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'
import React, { useEffect } from 'react'
import { RECAPCHA_KEY } from 'constants/capthca-key'


const CaptchaButton = ({ onVerifyCaptcha, dep }: any) => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const clickHandler = async () => {
    try {
      if (!executeRecaptcha) {
        return
      }

      const token = await executeRecaptcha('login')
      if (token) {
        onVerifyCaptcha(token)
      } else {
        return
      }
    } catch (e) {}
  }
  clickHandler()

  useEffect(() => {
    clickHandler()
  }, [dep])
  return <></>
}

export const ReCaptcha = ({ onVerifyCaptcha, dep }: any) => (
  <GoogleReCaptchaProvider reCaptchaKey={RECAPCHA_KEY}>
    <CaptchaButton onVerifyCaptcha={onVerifyCaptcha} dep={dep} />
  </GoogleReCaptchaProvider>
)
