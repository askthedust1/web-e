import { useState } from 'react'
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

import { EMAIL_SINX } from 'helpers/email-sinx'
import { store } from 'store'
import { InternetAcquiringModule } from 'services/api/InternetAcquiringModule'
import { RecaptchaApi } from 'services/api/RecaptchaApi'

import ReCAPTCHA from 'react-google-recaptcha'

import style from './order-internet-acquiring.module.scss'
import { RECAPCHA_KEY_V2 } from 'constants/capthca-key'

export interface FormAcquiring {
  company: string
  phone: string
  email: string
  full_name: string
  recaptcha_v2?: string
}

interface Props {
  data?: any
  recaptchaKey?: string
}

const OrderInternetAcquiring: NextPage<Props> = ({ data, recaptchaKey }) => {
  const { i18n, t } = useTranslation()
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('')
  const [popUp, setPopUp] = useState(false)
  const [loader, setLoader] = useState(false)
  const { modals } = store

  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAcquiring>({
    mode: 'onChange',
  })

  const onSubmitDetails = async (data: FormAcquiring) => {
    setLoader(true)
    try {
      await InternetAcquiringModule.createInternetAcquiring(data)
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

  const onSubmit: SubmitHandler<FormAcquiring> = (formData) => {
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
            <Heading title={t('internet_acquiring')} />
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
                  error={errors.full_name}
                  label={t('forms.card.fio')}
                  {...register('full_name', {
                    required: 'Введите ФИО',
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
                <RscInput
                  label={t('contacts.email')}
                  placeholder={t('contacts.email')}
                  {...register('email', {
                    required: t('contacts.email'),
                    pattern: {
                      value: EMAIL_SINX,
                      message: t('forms.card.email_error'),
                    },
                  })}
                  error={errors.email}
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
                  <p className={`${style.title} light-12`}>
                    {t('forms.personal_data.first')}{' '}
                    <a
                      target="_blank"
                      href={data?.personal_data_processing?.file}
                      className={style.link}
                      rel="noreferrer"
                    >
                      {t('forms.personal_data.second')}
                    </a>
                  </p>
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

export default OrderInternetAcquiring

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const type: any = query
  const lang = locale || 'ru'

  const { data } = await InternetAcquiringModule.getInternetAcquiringInfo(
    lang,
    type || 'legal'
  )
  const { data: recaptchaData } = await RecaptchaApi.getRecaptcha()

  return {
    props: {
      data,
      recaptchaKey: recaptchaData?.recaptcha_v2_site_key || null,
      ...(await getTranslations(lang)),
    },
  }
}
