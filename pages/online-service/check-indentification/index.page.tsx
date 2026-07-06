import { useState } from 'react'
import { GetServerSideProps } from 'next'
import s from './check-indentification.module.scss'
import { getTranslations } from 'helpers/serverTranslations'
import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import { useForm, useWatch } from 'react-hook-form'
import Container from 'components/Container'
import Button from 'components/Buttons/Button'
import { IdentificationApi } from 'services/api/Identification'
import PopUp from 'components/PopUp'
import clsx from 'clsx'
import HeadingWithNav from 'components/Heading/Heading'
import Loader from 'components/Loader'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import { store } from 'store'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'

export interface OnlineIndetification {
  inn: string
  code: string
  recaptcha: string
}

const ChckIndentification = () => {
  const { modals } = store
  const { t } = useTranslation()
  const [loader, setLoader] = useState(false)
  const [popUp, setPopUp] = useState<{
    text: string
    state: boolean
    unic_key: string | any
  }>({
    text: '',
    state: false,
    unic_key: '',
  })

  const onSubmit = async (data: OnlineIndetification) => {
    setLoader(true)
    const token = await getReCaptchaKey()
    if (!token) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp text="Ошибка рекапчи" closeModal={() => modals?.resetData()} />
        ),
      })
      return null
    }

    const currentData = {
      ...data,
      // recaptcha: token
    }
    try {
      await IdentificationApi.IdentificationCheckStatus(currentData).then(
        (res) => {
          setLoader(false)
          setPopUp({
            text: `
              <div> 
    <p style="font-size: 24px; text-align: center; margin-bottom: 20px; font-weight: 600; color: #2c3e50;"> 
        ${res?.data?.message  || "Ошибка на сервере"} 
    </p> 
    <div style="font-size: 18px; line-height: 1.6; color: #34495e; margin-bottom: 15px;"> 
        ${t("notification.title")} 
        <br> 
        ${t("notification.step")} 
        <a href="https://zoom.us/download" style="color: #2980b9; text-decoration: none; font-weight: bold;" target="_blank">Zoom</a>  
        ${t("notification.mobile_text")} 
    </div> 
     
    <div style="font-size: 18px; line-height: 1.6; color: #34495e; margin-bottom: 20px;"> 
        ${t("notification.step_2")} 
        <a href="https://api.whatsapp.com/send?phone=996706911111" style="color: #2980b9; text-decoration: none; font-weight: bold;" target="_blank">WhatsApp-канал</a> 
        ${t("notification.mobile_text_step_2")} 
    </div> 
</div>
            `,
            state: true,
            unic_key: statusCase(res.data.status),
          })

        }
      )
    } catch (error) {
      setLoader(false)
      setPopUp({
        text: t('not_found'),
        state: true,
        unic_key: '',
      })
    }
  }
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnlineIndetification>({
    mode: 'onChange',
  })

  const watcheCode = useWatch({ control, name: 'code' })
  const watcheINN = useWatch({ control, name: 'inn' })

  const statusCase = (status: string) => {
    switch (status) {
      case 'NEW':
        return <p className={clsx(s.status, s.green)}>{t('status.new')}</p>
      case 'CONSIDERATION':
        return (
          <p className={clsx(s.status, s.yellow)}>
            {t('status.consideration')}
          </p>
        )
      case 'ACCEPTED':
        return <p className={clsx(s.status, s.blue)}> {t('status.accepted')}</p>
      case 'DECLINED':
        return <p className={clsx(s.status, s.red)}>{t('status.declined')}</p>
    }
  }

  return (
    <>
      {loader && <Loader />}
      <Container>
        {popUp.state && (
          <PopUp
            href="/online-service/check-indentification"
            closeModal={() => setPopUp((prev) => ({ ...prev, state: false }))}
            text={popUp.text}
            unicKey={popUp.unic_key}
          />
        )}
        <HeadingWithNav title={t('check_auth_title')} />
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <RscInput
            maxLength={MAX_INN_LENGTH}
            type="tel"
            error={errors.inn}
            value={watcheINN}
            label={t('forms.card.inn')}
            {...register('inn', {
              minLength: {
                value: MAX_INN_LENGTH,
                message: t('forms.card.inn_error'),
              },
              required: t('forms.card.inn'),
            })}
          />
          <RscInput
            error={errors.code}
            label={t('input_key')}
            {...register('code', {
              required: t('input_key'),
            })}
            value={watcheCode?.toUpperCase()}
          />
          <div>
            <Button
              isLong
              onClick={handleSubmit(onSubmit)}
              value={t('forms.card.button_send')}
            />
          </div>
        </form>
      </Container>
    </>
  )
}

export default ChckIndentification
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getTranslations(locale as string)),
    },
  }
}
