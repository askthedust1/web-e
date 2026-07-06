import React from 'react'
import style from '../get-ower-drafr.module.scss'
import Button from 'components/Buttons/Button'
import { OverdraftInfo } from 'services/api/OtherApimodule'
import { NextPage } from 'next'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { RskSelect } from 'components/ui/Select'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { useTranslation } from 'next-i18next'

export interface OverdraftApplication {
  full_name: string
  workplace: string
  work_address: string
  work_type: string
  quantity: string
  branch: number
  phone: string
  email: string
  recaptcha?: string
}

interface Props {
  data: OverdraftInfo
  onSubmitOwerDraft(data: OverdraftApplication): void
}

const OverDraftType: NextPage<Props> = ({ data, onSubmitOwerDraft }) => {
  const { t } = useTranslation()
  const [owerdraftInfo, _setowerdraftInfo] =
    React.useState<OverdraftInfo | null>(data)
  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    reset: _reset,
    watch: _watch,
    formState: { errors },
  } = useForm<OverdraftApplication>({
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<OverdraftApplication> = (data) => {
    const currentData = { ...data }
    onSubmitOwerDraft(currentData)
  }

  return (
    <>
      <form action="">
        <RscInput
          error={errors.full_name}
          label={t('forms.card.fio')}
          {...register('full_name', {
            required: t('forms.card.fio'),
          })}
        />
        <RscInput
          error={errors.workplace}
          label={t('forms.identification.work_place')}
          {...register('workplace', {
            required: t('forms.identification.work_place'),
          })}
        />
        <RscInput
          error={errors.work_address}
          label={t('adress')}
          {...register('work_address', {
            required: t('adress'),
          })}
        />
        <RskSelect
          {...register('branch', {
            required: t('closed_branch'),
            setValueAs: (branch) => parseInt(branch) || null,
          })}
          optionsList={owerdraftInfo?.branches}
          error={errors.branch}
          label={t('closed_branch')}
        />
        <Controller
          control={control}
          name="phone"
          rules={{
            required: t('forms.card.phone'),
            minLength: {
              value: KG_PHONE_MAX_LENGTH,
              message: t('forms.card.phone_error'),
            },
          }}
          render={({ field: { value } }) => {
            return (
              <InputPhone
                placeholder={t('forms.card.phone')}
                label={t('forms.card.phone')}
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
        <RscInput
          error={errors.work_type}
          label={t('forms.identification.job_position')}
          {...register('work_type', {
            required: t('forms.identification.job_position'),
          })}
        />
        <RscInput
          error={errors.quantity}
          label={t('size_overdraft')}
          {...register('quantity', {
            required: t('size_overdraft'),
          })}
        />
      </form>
      <div className={style.info}>
        <p className={`${style.title} light-12  `}>
          {t('forms.personal_data.third')}{' '}
          <a
            target="_blank"
            href={owerdraftInfo?.page.personal_data_processing.file}
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
    </>
  )
}

export default OverDraftType
