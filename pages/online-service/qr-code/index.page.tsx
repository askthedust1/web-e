import { useState, useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import Image from 'next/image'

import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import Container from 'components/Container'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { RscInput } from 'components/ui/Input'
import PopUp from 'components/PopUp'
import Loader from 'components/Loader'

import { store } from 'store'
import { InternetAcquiringModule } from 'services/api/InternetAcquiringModule'
import { RecaptchaApi } from 'services/api/RecaptchaApi'

import ReCAPTCHA from 'react-google-recaptcha'

import style from './order-qr.module.scss'
import { RECAPCHA_KEY_V2 } from 'constants/capthca-key'

export interface FormQR {
  company: string
  phone: string
  company_address: string
  recaptcha_v2?: string
}

interface Props {
  recaptchaKey?: string
}

const OrderQrCode: NextPage<Props> = ({ recaptchaKey }) => {
  const { i18n, t } = useTranslation()
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('')
  const [popUp, setPopUp] = useState(false)
  const [loader, setLoader] = useState(false)
  const { modals } = store

  // При смене языка reCAPTCHA-компонент ремаунтится (key={i18n.language}),
  // поэтому сбрасываем сохранённый токен, иначе старый токен останется в state
  useEffect(() => {
    setReCaptchaToken('')
  }, [i18n.language])

  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormQR>({
    mode: 'onChange',
  })

  const onSubmitDetails = async (data: FormQR) => {
    setLoader(true)
    try {
      await InternetAcquiringModule.createQRApplication(data)
      setPopUp(true)
    } catch (error) {
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setLoader(false)
    }
  }

  const onSubmit: SubmitHandler<FormQR> = (formData) => {
    if (!reCaptchaToken) {
      modals.openModal({
        body: (
          <PopUp
            isWarning
            text={t('recaptcha_required') || 'Подтвердите, что вы не робот'}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      return
    }

    const data = { ...formData, recaptcha_v2: reCaptchaToken }
    onSubmitDetails(data)
  }

  return (
    <>
      {loader && <Loader />}
      <Container>
        {popUp && <PopUp href="/" />}
        <div className={style.container}>
          {/* Форма слева */}
          <div className={style.part}>
            <Heading title={t('acquiring_page.qr_form_title')} />
            <div className={style.block}>
              <form className={style.form}>
                <RscInput
                  error={errors.company}
                  label={t('name_of_organ')}
                  {...register('company', {
                    required: t('name_of_organ'),
                  })}
                />
                <RscInput
                  error={errors.company}
                  label={t('place_of_company')}
                  {...register('company_address', {
                    required: t('place_of_company'),
                  })}
                />
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: t('forms.credit.phone'),
                    minLength: {
                      value: KG_PHONE_MAX_LENGTH,
                      message: t('forms.credit.phone_error'),
                    },
                  }}
                  render={({ field: { value } }) => (
                    <InputPhone
                      placeholder={t('forms.credit.phone')}
                      label={t('forms.credit.phone')}
                      error={errors.phone}
                      value={value}
                      onChangePhone={(event) => {
                        setValue('phone', event.formattedPhone)
                        setError('phone', { message: '' })
                      }}
                    />
                  )}
                />

                <div className={style.recaptchaBlock}>
                  <ReCAPTCHA
                    key={i18n.language}
                    sitekey={recaptchaKey || RECAPCHA_KEY_V2}
                    hl={i18n.language}
                    onChange={(token) => setReCaptchaToken(token || '')}
                  />
                </div>

                <div className={style.info}>
                  <div className={style.button}>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      value={t('setting.button_request')}
                      isLarge
                      isLong
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Изображение справа */}
          <div className={style.imageSection}>
            <Image
              src="/images/ph3.png"
              alt="Internet Acquiring"
              width={400}
              height={450}
              priority
            />
          </div>
        </div>
      </Container>
    </>
  )
}

export default OrderQrCode

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const lang = locale || 'ru'

  let recaptchaKey = null
  try {
    const { data: recaptchaData } = await RecaptchaApi.getRecaptcha()
    recaptchaKey = recaptchaData?.recaptcha_v2_site_key || null
  } catch (error) {
    console.error('Failed to fetch recaptcha key:', error)
  }

  return {
    props: {
      recaptchaKey,
      ...(await getTranslations(lang)),
    },
  }
}
