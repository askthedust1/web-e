import React, { useState, useEffect } from 'react'
import Heading from 'components/Heading/Heading'
import { store } from 'store'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'
import Container from 'components/Container'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { isKgPhoneValid } from 'helpers/kg-phone'
import { OtherCreateApi } from 'services/api/OtherApi'
import { MobilebankingApi } from 'services/api/BankingApi'
import { GetServerSideProps, NextPage } from 'next'
import { BankingApplicataion } from 'services/api/BankingModule'
import PopUp from 'components/PopUp'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import Loader from 'components/Loader'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import style from './get-internet-banking.module.scss'
import { RskSelect } from 'components/ui/Select'
import { CardsApi } from 'services/api/CardsApi'
import { OrderCardInfoProps } from 'services/api/CardsApModule'
import { ServicePoints } from 'services/api/BranchesApi'
import { Branches, Cities } from 'services/api/BranchesApimodule'

export interface FormBanking {
  company: string
  branch: number | undefined
  phone: string
  email: string
  region: string
  full_name: string
  work?: string
  inn?: string
  fact_address?: string
  recaptcha?: string
}
interface Props {
  data: BankingApplicataion
  info: Cities[]
  points: Branches[]
}
const GetInternetBanking: NextPage<Props> = ({ data, info, points }) => {
  const { t } = useTranslation()
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('')
  const [bankingInfo, _setBankingInfo] = useState<BankingApplicataion | null>(
    data
  )
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
  } = useForm<FormBanking>({
    mode: 'onChange',
  })

  const watchedRegion = useWatch({ control, name: 'region' })

  const filteredBranches = points
    ?.filter((item: any) => {
      const isCorrectRegion = item?.region?.id === Number(watchedRegion)

      const name = item?.name?.toLowerCase() || ''
      const isNotSavingsCash =
        !name.includes('сберегательная') &&
        !name.includes('касса') &&
        !name.includes('цок') &&
        !name.includes('обслуживания') &&
        !name.includes('ск ') &&
        !name.includes('вк ') &&
        !name.includes('гуобдд') &&
        !name.includes('выездная')

      return isCorrectRegion && isNotSavingsCash
    })
    .map((item: any) => ({
      id: item?.id,
      name: item?.name,
    }))

  const regionsOptions = info?.map((region) => ({
    id: region.id,
    name: region.name,
  }))

  const onSubmitDetails = async (data: FormBanking) => {
    setLoader(true)
    try {
      await OtherCreateApi.createIntenetBanking(data)
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
  const onSubmit: SubmitHandler<FormBanking> = (data) => {
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

  useEffect(() => {
    getToken()
  }, [])
  return (
    <>
      {loader && <Loader />}
      <Container>
        {popUp && <PopUp href="/" />}
        <div className={style.container}>
          <div className={style.part}>
            <Heading title={t('internet_banking')} />
            <div className={style.block}>
              <form action="" className={style.form}>
                <RscInput
                  error={errors.company}
                  label={t('name_of_organ')}
                  {...register('company', {
                    required: t('name_of_organ'),
                  })}
                />
                <RscInput
                  error={errors.company}
                  label={t('forms.card.fio')}
                  {...register('full_name', {
                    required: t('forms.card.fio'),
                  })}
                />
                <RskSelect
                  label={t('job.region')}
                  error={errors?.region}
                  optionsList={regionsOptions}
                  {...register('region', {
                    required: t('required_field'),
                    setValueAs: (value) => Number(value) || null,
                    onChange: () => setValue('branch', undefined),
                  })}
                />

                <RskSelect
                  label={t('forms.card.branch')}
                  error={errors?.branch}
                  optionsList={filteredBranches}
                  {...register('branch', {
                    required: t('forms.card.branch'),
                    setValueAs: (value) => Number(value) || null,
                  })}
                  disabled={!watchedRegion}
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
                    validate: (v) =>
                      isKgPhoneValid(v) || t('forms.credit.phone_prefix_error'),
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
                  placeholder="example@mail.com"
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
                    {t('forms.personal_data.first')}{' '}
                    <a
                      target="_blank"
                      href={bankingInfo?.personal_data_processing.file}
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
              <CardInfoBig info={bankingInfo?.application_caption} />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default GetInternetBanking
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const type: any = query
  const lang: any = locale

  const { data: info } = await ServicePoints.getRegions(locale || 'ru')

  const { data: points } = await ServicePoints.getAllPoints(
    locale || 'ru',
    'branches',
    {
      city: query?.city,
      mode: query?.mode,
      branch_type: query?.branch_type,
    }
  )

  const { data } = await MobilebankingApi.getBankingApplication(
    lang || 'ru',
    type || ''
  )
  return {
    props: {
      points,
      data,
      info,
      ...(await getTranslations(lang)),
    },
  }
}
