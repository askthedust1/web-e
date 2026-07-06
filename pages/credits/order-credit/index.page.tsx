import { FC, useState } from 'react'
import style from './get-cards-form.module.scss'
import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'
import InputRadio from 'components/Input/InputRadio'
import { useForm, SubmitHandler, useWatch, Controller } from 'react-hook-form'
import { CreditOrderProps } from 'models/creditOrder'
import { CreditOrderApi } from 'services/api/CreditsApi'
import { InputPhone } from 'components/Input/InputPhone'
import { RscInput } from 'components/ui/Input'
import { RskSelect } from 'components/ui/Select'
import Container from 'components/Container'
import { EMAIL_SINX } from 'helpers/email-sinx'
import PopUp from 'components/PopUp'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import { CreditOrderPropsInfo, IBankBranchList } from 'services/api/CreditsApiModule'
import { store } from 'store'
import Loader from 'components/Loader'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'

const KG_PHONE_MAX_LENGTH = 13
const FOR_WHO = [
  {
    name: 'Физ.лицо',
    id: 1,
    label: 'individual',
  },
  {
    name: 'Юр.лицо',
    id: 2,
    label: 'legal',
  },
]
const _individualID = 1
const legalID = 2

export interface RegionListProps {
  id?: string
  name?: string
}

export interface FormValuesOrder {
  for_who: string | number
  credit: number
  sum: number
  full_name?: string
  suggestion?: string
  currency: number | string
  city: string
  fio: string
  phone: string
  email: string
  recaptcha?: string
  last_name?: string
  bank_branch?: string
  first_name?: string
  patronymic?: string
  message?: string
  postal_address?: string
  file?: any
}

interface Props {
  data: CreditOrderPropsInfo
  bankBranchList: IBankBranchList[]
  initialType: string | null
}
const GetCredit: FC<Props> = ({ data, bankBranchList, initialType }) => {
  const isApplicationEnabled = data ? (data.is_application_enabled ?? true) : false

  const { t } = useTranslation()

  const { modals } = store
  const [popUp, setPopUp] = useState(false)
  const [loader, setLoader] = useState(false)
  const Router = useRouter()

  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesOrder>({
    mode: 'onChange',
    defaultValues: {
      for_who: 1,
    },
  })

  const forWhoValue = Router.query.for_who === 'legal' ? 2 : 1

  const categoryCredits =
    legalID === forWhoValue
      ? data?.legal_credits || []
      : data?.individual_credits || []

  const onSubmitDetails = async (data: CreditOrderProps) => {
    const currentData = {
      ...data,
      for_who: SELECTED_FOR_WHO,
    }

    try {
      await CreditOrderApi.orderCredit(currentData)
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

  const onSubmit: SubmitHandler<FormValuesOrder> = async (data) => {
    setLoader(true)
    const token = await getReCaptchaKey();
    if (!token) {
      modals.openModal({
        body: (
          <PopUp
            text="Ошибка рекапчи"
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      return null
    }
    
    const currentData = {
      ...data,
      credit: currentOption,
      recaptcha: token,
    }
    onSubmitDetails(currentData)
  }

  const selectForWho = (id: string) => {
    const typeOfUse = String(id) === '2' ? 'legal' : 'individual'
    Router.push(typeOfUse === 'legal' ? '/credits/order-credit?for_who=legal' : '/credits/order-credit')
    setValue('for_who', id)
  }

  const _watchCredit = useWatch({ control, name: 'credit' })

  const currencies = categoryCredits?.filter(
    (credit: { id: number }) => String(credit.id) === String(initialType || categoryCredits[0].id)
  )[0]?.currencies || []

  const SELECTED_FOR_WHO = FOR_WHO.filter(
    (forWho) => forWho.id === forWhoValue
  )[0]?.label

  const onChangeSelect = (cardId: string) => {
    Router.push(
      `/credits/order-credit${Router.query.for_who === 'legal' ? '?for_who=legal&' : '?'}type=${cardId}`
    )
    setValue('credit', parseInt(cardId))
    setValue('currency', "")
  }
  const currentOption =
    categoryCredits?.filter(
      (item: { id: number }) => String(item?.id) === String(Router?.query?.type)
    )[0]?.id || categoryCredits[0]?.id

    const bankBranchOptions = bankBranchList?.map((item) => {
      return {
        id: item?.id,
        name: `${item?.name} ${item?.address}`
      }
    })
    
  if (!isApplicationEnabled) {
    return (
      <Container>
        <div className={style.container}>
          <div className={style.part}>
            <Heading title={t('forms.credit.credit')} />
            <div className={style.block}>
              <p className={clsx(style.subtitle, 'medium-20')}>
                {t('credit_application_disabled')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <>
      {loader && <Loader />}
      <Container>
        {popUp && <PopUp href="/" />}
        <div className={style.container}>
          <div className={style.part}>
            <Heading title={t('forms.credit.credit')} />
            <div className={style.block}>
              <p className={clsx(style.subtitle, 'medium-20')}>
                {t('forms.credit.personal_data')}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
                <div className={style.checkboxBlock}>
                  <Controller
                    control={control}
                    name="for_who"
                    render={() => (
                      <InputRadio
                        {...register('for_who', {
                          required: t('forms.credit.choose_perpose'),
                          setValueAs: (v) => parseInt(v) || null,
                        })}
                        value={forWhoValue}
                        name="for_who"
                        onClick={selectForWho}
                        labelArray={FOR_WHO}
                        error={errors.for_who}
                      />
                    )}
                  />
                </div>

                <RskSelect
                  error={errors.credit}
                  label={t('forms.credit.choose_credit')}
                  optionsList={categoryCredits}
                  value={currentOption}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onChangeSelect(e.target.value)
                  }
                />
                <RscInput
                  error={errors.sum}
                  label={t('forms.credit.credit_amount')}
                  {...register('sum', {
                    required: t('forms.credit.credit_amount'),
                    setValueAs: (summa) => parseInt(summa) || null,
                  })}
                  type="number"
                />
                <RskSelect
                  label={t('forms.card.currency')}
                  error={errors.currency}
                  optionsList={currencies}
                  {...register('currency', {
                    required: t('forms.card.choose_currency'),
                    setValueAs: (currencies) => parseInt(currencies) || null,
                  })}
                />
                {/* city */}
                  <RskSelect
                  label={t('forms.credit.city_credit')}
                  error={errors.city}
                  optionsList={bankBranchOptions}
                  {...register('bank_branch', {
                    required: t('forms.credit.city_credit'),
                    setValueAs: (currencies) => parseInt(currencies) || null,
                  })}
                />
                {/* <RscInput
                  label={t('forms.credit.city_credit')}
                  error={errors.city}
                  {...register('city', {
                    required: t('forms.credit.city_credit'),
                  })}
                /> */}
                <RscInput
                  label={t('forms.card.fio')}
                  {...register('fio', {
                    required: t('forms.card.fio'),
                    pattern: {
                      value: /^[а-яА-Яa-zA-ZёЁ\s-]+$/,
                      message: t('forms.credit.text_error'),
                    },
                  })}
                  error={errors.fio}
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
                      href={data?.page.personal_data_processing.file}
                      className={style.link}
                      rel="noreferrer"
                    >
                      {t('forms.personal_data.second')}
                    </a>
                  </p>
                  <div className={style.button}>
                    <Button
                      value={t('setting.button_request')}
                      onClick={handleSubmit(onSubmit)}
                      isLarge
                      isLong
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className={style.part}>
            <div>
              <CardInfoBig info={data?.page?.application_caption} />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default GetCredit

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const lang: any = locale
  const { data } = await CreditOrderApi.getCreditOrderInfo(locale || 'ru')
  const resp = await CreditOrderApi.getCreditBankBranchList(locale || "ru")

  return {
    props: {
      data,
      initialType: query.type || null,
      ...(await getTranslations(lang)),
      bankBranchList: resp?.data
    },
  }
}
