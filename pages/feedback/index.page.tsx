import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { ArchiveCurrencyApi } from 'services/api/ArchiveCurrencyApi'
import { format } from 'date-fns'

import { useTranslation } from 'next-i18next'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Head from 'next/head'
import s from './complaint.module.scss'
import Button from 'components/Buttons/Button'
import Icon from 'components/Icon'
import React, { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { FormValuesOrder } from 'pages/credits/order-credit/index.page'
import { RscInput } from 'components/ui/Input'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { Textarea } from 'components/ui/Textarea'
import { store } from 'store'
import PopUp from 'components/PopUp'
import { InputCheckBox } from 'components/Input/InputCheckBox'
import { useRouter } from 'next/router'
import Document from 'components/Document'
import CkDownloundFiles from 'components/CkDownloundFiles'
import { RecaptchaData } from 'services/api/RecaptchaApi'
import { useRecaptcha } from '../../helpers/useRecaptcha'
import style from 'pages/online-service/order-internet-acquiring/order-internet-acquiring.module.scss'
import ReCAPTCHA from 'react-google-recaptcha'
import { RECAPCHA_KEY_V2 } from 'constants/capthca-key'

interface Props {
  data: {
    id: number
    title: string
    file: string
  }[] | null
  recaptcha: RecaptchaData
}

const Feedback: NextPage<Props> = ({ data }) => {
  const { i18n, t } = useTranslation()
  const { recaptcha } = useRecaptcha()
  const [activeText, setActiveText] = useState("suggestion")
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const { modals } = store
  const [checkboxValue, setCheckoxValue] = useState("1")
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('')

  const {
    control,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState,
  } = useForm<FormValuesOrder>({
    mode: 'onChange',
    defaultValues: {
      for_who: 1,
      file: []
    },
  })

  const Router = useRouter()
  const handlerActiveText = (value: string) => {
    setActiveText(value)
  }

  const loadFiles = (file: File[]) => {
    setValue('file', file)
  }


  const blockNonLetters = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const k = e.key
    if (!isNaN(Number(k)) || /[0-9!@#$%^&*()_+={}[\]:;"'<>,.?/\\|`~]/.test(k)) e.preventDefault()
  }

  const onSubmit: SubmitHandler<FormValuesOrder> = async (data) => {
    setLoading(true)

    if (!reCaptchaToken) {
      setLoading(false)
      modals.openModal({
        body: (
          <PopUp text="Ошибка рекапчи" closeModal={() => modals?.resetData()} />
        ),
      })
      return null
    }

    const files = data?.file?.length && data?.file[0];

    try {
      const { file, ...rest } = data
      const obj: any = {
        ...rest,
        type: activeText,
        recaptcha_v2: reCaptchaToken
      }

      const formDate = new FormData();
      if (files) formDate.append("file", files)
      for (const value in obj) {
        formDate.append(value, obj[value])
      }
      await ArchiveCurrencyApi.postFeedback(formDate)
      await setLoading(false)
      await modals.openModal({
        body: (
          <PopUp
            text={t('successfullySent')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      await Router.push("/")
    } catch (e: any) {
      const message = e?.response?.data
      let errorText = t('error_popup')

      if (typeof message === 'string') {
        errorText = message
      } else if (typeof message === 'object' && message !== null) {
        const firstKey = Object.keys(message)[0]
        const firstValue = firstKey && message[firstKey]
        if (Array.isArray(firstValue)) {
          errorText = firstValue[0]
        } else if (typeof firstValue === 'string') {
          errorText = firstValue
        }
      }

      setLoading(false)
      modals.openModal({
        body: (
          <PopUp
            text={errorText}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    }
  }

  const renderInput = () => {
    switch (checkboxValue) {
      case "1":
        return <RscInput
          label={t('contacts.email')}
          placeholder={t('contacts.email')}
          {...register('email', {
            required: t('contacts.email'),
            pattern: {
              value: EMAIL_SINX,
              message: t('forms.card.email_error'),
            },
          })}
          error={formState?.errors.email}
        />
      case "2":
        return <Controller
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
                error={formState?.errors.phone}
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
      default:
        return <RscInput
          label="Почтовый адрес"
          error={formState?.errors.patronymic}
          {...register('postal_address', {
            required: "Отчество",
          })}
        />
    }
  }

  return (
    <>
      <Head>
        <title>
          {t("feedback.title")}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content={t("feedback.title")}
          key="og:title"
        />
        <meta
          property="og:description"
          content={t("feedback.title")}
          key="og:description"
        />
        <meta
          name="description"
          content={t("feedback.title")}
          key="description"
        />
        <meta
          name="keywords"
          content={t("feedback.title")}
          key="keywords"
        />
      </Head>

      <Section>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: t("feedback.title"),
              link: '/complaint',
            }}
          />
          <h3 className={s.title}>{t("feedback.title")}</h3>
          <p>{t("feedback.text_add")}</p>
          <p>{t("feedback.text_add3")}</p>
          <p style={{ marginTop: 20 }}>{t("feedback.select_type")}</p>
          <div className={s.groupBtn}>
            <Button value={t("feedback.offer")} className={activeText.includes("suggestion") ? s.activeBtn : ""}
              onClick={() => handlerActiveText("suggestion")} />
            <Button value={t("feedback.complaint")} className={activeText.includes("complaint") ? s.activeBtn : ""}
              onClick={() => handlerActiveText("complaint")}
            />
            <Button value={t("feedback.gratitude")} className={activeText.includes("commendation") ? s.activeBtn : ""}
              onClick={() => handlerActiveText("commendation")}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>


          <RscInput
            label={t("feedback.last_name")}
            error={formState?.errors.last_name}
            {...register('last_name', { required: t("feedback.last_name") })}
            onKeyDown={blockNonLetters}
          />

          <RscInput
            label={t("feedback.name")}
            error={formState?.errors.first_name}
            {...register('first_name', { required: t("feedback.name") })}
            onKeyDown={blockNonLetters}
          />

          <RscInput
            label={t("feedback.patronymic")}
            error={formState?.errors.patronymic}
            {...register('patronymic')}
            onKeyDown={blockNonLetters}
          />

            <p className={s.subtitle}>{t("feedback.get_answer")}</p>
            <InputCheckBox
              value={checkboxValue}
              name="services"
              labelArray={[
                {
                  name: t("feedback.by_email"),
                  id: 1
                },
                {
                  name: t("feedback.by_phone"),
                  id: 2
                },
                {
                  name: t("feedback.by_addres"),
                  id: 3
                },
              ]}
              onClick={(value) => setCheckoxValue(value.toString())}
            />
            {renderInput()}

            <Textarea
              label={t("feedback.your_message")}
              error={formState?.errors.message}
              {...register('message', {
                required: "Оставьте свое сообщение",
              })}
            />

            <Controller
              control={control}
              name="file"
              render={() => (
                <CkDownloundFiles
                  clearErrors={clearErrors}
                  setError={setError}
                  isEdit={false}
                  initValue={[]}
                  setFiles={loadFiles}
                  {...register('file')}
                  error={formState?.errors?.file}
                  customStyle={{ maxWidth: '100%', width: '100%' }}
                />
              )}
            />

            <div className={s.infoBox}>
              <p className={s.anonNote}>{t("feedback.text_description_0")}</p>
              <button
                type="button"
                className={s.infoToggle}
                onClick={() => setShowInfo(!showInfo)}
              >
                <span>{t("feedback.title_description")}</span>
                <Icon
                  id="arrow-down-thin"
                  width={16}
                  height={16}
                  className={`${s.infoArrow} ${showInfo ? s.infoArrowOpen : ''}`}
                />
              </button>
              {showInfo && (
                <div className={s.infoContent}>
                  <ul className={s.rulesList}>
                    <li>{t("feedback.text_description_2")}</li>
                    <li>{t("feedback.text_description_3")}</li>
                    <li>{t("feedback.text_description_7")}</li>
                    <li>{t("feedback.text_description_4")}</li>
                    <li>{t("feedback.related")}</li>
                  </ul>
                  <p className={s.infoThanks}>{t("feedback.text_description_5")}</p>
                  <p className={s.infoContactTitle}>{t("feedback.text_description_6")}</p>
                  <ul className={s.contactsList}>
                    <li>{t("feedback.text_description_8")}</li>
                    <li>{t("feedback.text_description_9")}</li>
                    <li>{t("feedback.text_description_10")}</li>
                    <li>{t("feedback.text_description_13")}</li>
                    <li>{t("feedback.text_description_12")}</li>
                  </ul>
                </div>
              )}
            </div>
           <div style={{marginLeft: -20, marginTop: -20, marginBottom: -20}}>
           <Document documents={data?.length ? data : []} />
           </div>
            <div className={style.recaptchaBlock} style={{marginBottom: '20px'}}>
              <ReCAPTCHA
                aria-required={true}
                key={i18n.language}
                sitekey={recaptcha?.recaptcha_v2_site_key || RECAPCHA_KEY_V2}
                hl={i18n.language}
                onChange={(token) => setReCaptchaToken(token || '')}
              />
              {!reCaptchaToken && (
                <p style={{ color: 'red', fontSize: 13, marginTop: 5 }}>
                  {t('captcha_required') || 'Пожалуйста, подтвердите, что вы не робот'}
                </p>
              )}
            </div>
            <Button
              value={t("feedback.send")}
              onClick={handleSubmit(onSubmit)}
              disabled={!reCaptchaToken || loading}
              isLarge
              isLoading={loading}
              isLong
            />
             
          </form>
        </Container>
      </Section>
    </>
  )
}

export default Feedback;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const type: any = query
  const lang: any = locale
  const date2 = (type.date || format(new Date(), 'yyyy-MM-dd')) as string
  const chech: any =
    type?.date?.length !== 0 ? { date: date2 } : { date: type.date }
  const { data } = await ArchiveCurrencyApi.getFeedbackDoc(lang || 'ru', chech)
  return {
    props: {
      data: data,
      chech,
      ...(await getTranslations(lang)),
    },
  }
}
