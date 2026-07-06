import React from 'react'
import { store } from 'store'
import style from './order-rko.module.scss'
import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'
import Container from 'components/Container'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { OtherCreateApi } from 'services/api/OtherApi'
import { GetServerSideProps, NextPage } from 'next'
import PopUp from 'components/PopUp'
import { OtherPageApi } from 'services/api/OtherApi'
import { RskSelect } from 'components/ui/Select'
import { RkoInfoProps } from 'services/api/OtherApimodule'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import Loader from 'components/Loader'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'

export interface FormRko {
  company: string
  company_address: string
  phone: string
  email: string
  currency: number
  recaptcha?: string
}
interface Props {
  data: RkoInfoProps
}
const OrderRko: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()
  const [rkoInfo, _setRkoInfo] = React.useState<RkoInfoProps | null>(data)
  const [popUp, setPopUp] = React.useState(false)
  const [loader, setLoader] = React.useState(false)
  const [reCaptchaToken, setReCaptchaToken] = React.useState<string>('')
  const { modals } = store
  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRko>({
    mode: 'onChange',
  })
  const onSubmitDetails = async (data: FormRko) => {
    setLoader(true)
    try {
      await OtherCreateApi.createRko(data)
      setLoader(false)
      setPopUp(true)
    } catch (error) {
      setLoader(false)
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
  const onSubmit: SubmitHandler<FormRko> = (data) => {
    const currentData = { ...data, recaptcha: reCaptchaToken }
    onSubmitDetails(currentData)
  }

  const getToken = async () => {
    const token = await getReCaptchaKey()

    if (!token) {
      getToken()
    }

    if (token) {
      setReCaptchaToken(token)
    }
  }

  React.useEffect(() => {
    getToken()
  }, [])

  return (
    <>
      {loader && <Loader />}
      <Container>
        {popUp && <PopUp href="/" />}
        <div className={style.container}>
          <div className={style.part}>
            <Heading title={t('rko_titile')} />
            <div className={style.block}>
              <form action="" className={style.form}>
                <RskSelect
                  {...register('currency', {
                    required: t('forms.card.choose_currency'),
                    setValueAs: (credit) => parseInt(credit) || null,
                  })}
                  optionsList={rkoInfo?.currencies}
                  error={errors.currency}
                  label={t('forms.card.choose_currency')}
                />
                <RscInput
                  error={errors.company}
                  label={t('name_of_organ')}
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
                <div className={style.info}>
                  <p className={`${style.title} light-12  `}>
                    {t('forms.personal_data.third')}{' '}
                    <a
                      target="_blank"
                      href={rkoInfo?.page?.personal_data_processing?.file}
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
          <div className={style.part}>
            <div className={style.infoBlock}>
              <CardInfoBig info={rkoInfo?.page?.application_caption} />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default OrderRko
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const type: any = query
  const lang: any = locale
  const _chech: any = type?.for_who?.length >= 1 ? type : { for_who: 'legal' }
  const { data } = await OtherPageApi.getRkoInfo(lang || 'ru')
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}
