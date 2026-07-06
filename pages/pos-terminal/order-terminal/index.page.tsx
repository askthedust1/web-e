import React, { useState } from 'react'
import style from './get-post-terminal.module.scss'
import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import { GetServerSideProps, NextPage } from 'next'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { EMAIL_SINX } from 'helpers/email-sinx'
import Container from 'components/Container'
import { OtherCreateApi } from 'services/api/OtherApi'
import PopUp from 'components/PopUp'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import Loader from 'components/Loader'
import { store } from 'store'
import { RscInput } from 'components/ui/Input'
import AppImage from 'components/ui/AppImage'
import { RecaptchaApi } from 'services/api/RecaptchaApi'
import ReCAPTCHA from 'react-google-recaptcha'
import { RECAPCHA_KEY_V2 } from 'constants/capthca-key'

export interface FormPostTerminal {
  company: string
  company_address: string
  phone: string
  email: string
  recaptcha_v2?: string
}

interface Props {
  recaptchaKey?: string
}
const GetPostTerminal: NextPage<Props> = ({ recaptchaKey }) => {
  const [popUp, setPopUp] = useState(false)
  const [loader, setLoader] = useState(false)
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('')
  const { modals } = store
  const { i18n, t } = useTranslation()

  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormPostTerminal>({
    mode: 'onChange',
  })

  const onSubmitDetails = async (data: FormPostTerminal) => {
    setLoader(true)
    try {
      await OtherCreateApi.createPostTerminal(data)
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

  const onSubmit: SubmitHandler<FormPostTerminal> = (formData) => {
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
          <div className={style.formSection}>
            <Heading title={t('forms.pos_terminal.title')} />
            <form className={style.form}>
              <RscInput
                error={errors.company}
                label={t('tender_page.name_of_organ')}
                {...register('company', {
                  required: t('name_of_organ'),
                })}
              />
              <RscInput
                error={errors.company_address}
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
                render={({ field: { value } }) => {
                  return (
                    <InputPhone
                      placeholder={t('forms.credit.phone')}
                      label={t('forms.credit.phone')}
                      error={errors.phone}
                      value={value}
                      onChangePhone={(event) => {
                        setValue('phone', event.formattedPhone)
                        setError('phone', {
                          message: '',
                        })
                      }}
                    />
                  )
                }}
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
                  <a target="_blank" className={style.link} rel="noreferrer">
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

          <div className={style.imageSection}>
            <AppImage
              src="/images/ph3.png"
              alt="POS Terminal"
              width={500}
              height={550}
            />
          </div>
        </div>
      </Container>
    </>
  )
}

export default GetPostTerminal
export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale: any = context.locale
  const { data: recaptchaData } = await RecaptchaApi.getRecaptcha()

  return {
    props: {
      recaptchaKey: recaptchaData?.recaptcha_v2_site_key || null,
      ...(await getTranslations(locale)),
    },
  }
}
