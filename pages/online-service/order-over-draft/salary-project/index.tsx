import React from 'react'
import style from '../get-ower-drafr.module.scss'
import Button from 'components/Buttons/Button'
import { OtherPageApi } from 'services/api/OtherApi'
import { OverdraftInfo, SalaryProjectPage } from 'services/api/OtherApimodule'
import { GetServerSideProps, NextPage } from 'next'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { RskSelect } from 'components/ui/Select'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { useTranslation } from 'next-i18next'
import { ServicePoints } from 'services/api/BranchesApi'
import { MobilebankingApi } from 'services/api/BankingApi'
import { getTranslations } from 'helpers/serverTranslations'
import { Branches, Cities } from 'services/api/BranchesApimodule'

export interface SalaryProjectApplication {
  full_name: string
  company: string
  company_address: string
  branch: number | undefined
  phone: string
  email: string
  region: string
  recaptcha?: string
}

interface Props {
  data?: OverdraftInfo
  overdraftInfoData?: OverdraftInfo
  onSubmitSalary(data: SalaryProjectApplication): void
  info: Cities[]
  points: Branches[]
}

const SalaryProjectForm: NextPage<Props> = ({
  data,
  overdraftInfoData,
  onSubmitSalary,
  info,
  points,
}) => {
  const { t } = useTranslation()
  const [overdraftInfo, _setoverdraftInfo] = React.useState<any>(
    data || overdraftInfoData
  )
  const [_type, _setType] = React.useState()
  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryProjectApplication>({
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

  const onSubmit: SubmitHandler<SalaryProjectApplication> = (
    data: SalaryProjectApplication
  ) => {
    const currentData = { ...data }
    onSubmitSalary(currentData)
  }
  return (
    <>
      <form>
        <RscInput
          error={errors.full_name}
          label={t('forms.card.fio')}
          {...register('full_name', {
            required: t('forms.card.fio'),
          })}
        />
        <RscInput
          error={errors.company}
          label={t('legal_name__company')}
          {...register('company', {
            required: t('legal_name__company'),
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
              href={overdraftInfo?.page?.personal_data_processing.file}
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
    </>
  )
}

export default SalaryProjectForm

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, locale } = context
  const lang: any = locale

  const { data } = await OtherPageApi.getOwerDraft(context.locale || 'ru')

  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}
