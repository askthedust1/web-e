import React, { FC } from 'react'
import style from './deteil-user.module.scss'
import Heading from 'components/Heading/Heading'
import Steps from 'components/Steps'

import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'

import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { IdentificationProps } from 'models/identification'
import { RskSelect } from 'components/ui/Select'
import { RscInput } from 'components/ui/Input'
import InputDataPicker from 'components/Input/InputDataPicker'
import CkSelectPhoto from 'components/CkSelectPhoto'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'

export interface FormDeteilUser {
  citizenship: number
  seria_version: number
  seria: string
  organ: number
  received_by: string
  received_date: Date
  end_date: Date
  inn: string
  passport_front: File
  passport_back: File
  passport_selfie: File
  purpose: number
  branch: number
  card: number
  currency: number
}

interface Props {
  steps: string[]
  current: number
  formInfo: IdentificationProps
  onSubmitHandler(data: FormDeteilUser): void
  message?: string
  goBack(): void
  personalData: {
    desc: string
    file?: string
    id: number
    slug: string
    title: string
  }
}
const DeteilUser: FC<Props> = ({
  steps,
  current,
  formInfo,
  onSubmitHandler,
  message,
  goBack,
  personalData,
}) => {
  const {
    control,
    register,
    setValue,
    setError: _setError,
    handleSubmit,
    reset: _reset,
    watch: _watch,
    formState: { errors },
  } = useForm<FormDeteilUser>({
    mode: 'onChange',
  })
  const loadFileFront = (file: File) => {
    setValue('passport_front', file)
  }
  const loadFileSelfie = (file: File) => {
    setValue('passport_selfie', file)
  }
  const loadFileBack = (file: File) => {
    setValue('passport_back', file)
  }
  const onSubmit: SubmitHandler<FormDeteilUser> = (data) => {
    onSubmitHandler(data)
  }
  const { t } = useTranslation()
  const watchСards = useWatch({ control, name: 'card' })
  const CITIZENSHIP = formInfo?.countries
  const SERIA_TYPES = formInfo?.seria_versions
  const ORGANS = formInfo?.organs
  const PURPOSES = formInfo?.purposes
  const BRANCHES = formInfo?.branches
  const CARDS = formInfo?.cards
  const CURRENCIES = CARDS?.filter((card) => card.id === watchСards)[0]
    ?.currencies
  const watcheResived = useWatch({ control, name: 'received_by' })
  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('forms.identification.main_title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={goBack} />
          <p className="medium-20">{t('forms.credit.personal_data')}</p>
          <form action="" className={style.form}>
            <RskSelect
              {...register('citizenship', {
                required: t('forms.card.choose_citizenship'),
                setValueAs: (citizenship) => parseInt(citizenship) || null,
              })}
              optionsList={CITIZENSHIP}
              error={errors.citizenship}
              label={t('forms.card.choose_citizenship')}
            />
            <div className={style.row}>
              <div className={style.short}>
                <RskSelect
                  {...register('seria_version', {
                    required: 'Выберите',
                    setValueAs: (seria_version) =>
                      parseInt(seria_version) || null,
                  })}
                  optionsList={SERIA_TYPES}
                  error={errors.seria_version}
                />
              </div>
              <div className={style.medium}>
                <RscInput
                  error={errors.seria}
                  label={t('forms.identification.seria')}
                  {...register('seria', {
                    required: t('forms.identification.seria'),
                  })}
                />
              </div>
            </div>
            <div className={style.row}>
              <div className={style.short}>
                <RskSelect
                  {...register('organ', {
                    required: 'Выберите',
                    setValueAs: (organ) => parseInt(organ) || null,
                  })}
                  optionsList={ORGANS}
                  error={errors.organ}
                />
              </div>
              <div className={style.medium}>
                <RscInput
                  dontShowLabel
                  error={errors.received_by}
                  label={t('forms.identification.issued')}
                  {...register('received_by', {
                    required: t('forms.identification.issued'),
                  })}
                  value={watcheResived?.toUpperCase()}
                />
              </div>
            </div>
            <div className={style.rowTime}>
              <Controller
                {...register('received_date', {
                  required: t('forms.identification.date_from'),
                  setValueAs: (country) => parseInt(country) || null,
                })}
                name="received_date"
                control={control}
                render={({ field }) => (
                  <InputDataPicker
                    placeholder={t('forms.identification.date_from')}
                    onChange={(date: Date) => field.onChange(date)}
                    selected={field.value}
                    error={errors.received_date}
                  />
                )}
              />
              <Controller
                {...register('end_date', {
                  required: t('forms.identification.date_till'),
                  setValueAs: (country) => parseInt(country) || null,
                })}
                name="end_date"
                control={control}
                render={({ field }) => (
                  <InputDataPicker
                    placeholder={t('forms.identification.date_till')}
                    onChange={(date: Date) => field.onChange(date)}
                    selected={field.value}
                    error={errors.end_date}
                  />
                )}
              />
            </div>
            <RscInput
            
              error={errors.inn}
              label={t('forms.card.inn')}
              {...register('inn', {
                minLength: {
                  value: MAX_INN_LENGTH,
                  message: t('forms.card.inn_error'),
                },
                required: t('forms.card.inn'),
              })}
              maxLength={MAX_INN_LENGTH}
              type="tel"
            />
            <div className={style.photoWrapper}>
              <Controller
                control={control}
                name="passport_front"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_front', {
                      required: t('forms.card.passport_front_image'),
                    })}
                    label={t('forms.card.passport_front_image')}
                    fileTypes={['JPG', 'PNG', "HEIC", "TIFF", "MOV", "JPEG"]}
                    onChangeFiles={loadFileFront}
                    error={errors?.passport_front}
                  />
                )}
              />
              <Controller
                control={control}
                name="passport_back"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_back', {
                      required: t('forms.card.image_loader'),
                    })}
                    label={t('forms.card.image_loader')}
                    fileTypes={['JPG', 'PNG', "HEIC", "TIFF", "MOV", "JPEG"]}
                    onChangeFiles={loadFileBack}
                    error={errors?.passport_back}
                  />
                )}
              />
            </div>
            <div className={style.passport_selfie}>
              <Controller
                control={control}
                name="passport_selfie"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_selfie', {
                      required: t('savingsMortgage.upload_yourself_passport'),
                    })}
                    label={t('savingsMortgage.upload_yourself_passport')}
                    fileTypes={['JPG', 'PNG', "HEIC", "TIFF", "MOV", "JPEG"]}
                    onChangeFiles={loadFileSelfie}
                    error={errors?.passport_selfie}
                  />
                )}
              />
            </div>
            <p className={clsx(style.subtitle, 'medium-20')}>
              {t('forms.card.payment_card')}
            </p>
            <RskSelect
              {...register('purpose', {
                required: 'Выберите',
                setValueAs: (purpose) => parseInt(purpose) || null,
              })}
              optionsList={PURPOSES}
              error={errors.purpose}
              label={t('forms.identification.perpose')}
              massage={t('forms.identification.purpose_caption')}
            />
            <RskSelect
              {...register('branch', {
                required: t('forms.identification.choose_branch'),
                setValueAs: (branch) => parseInt(branch) || null,
              })}
              optionsList={BRANCHES}
              error={errors.branch}
              label={t('forms.identification.choose_branch')}
            />

            <div className={style.row}>
              <div className={style.medium}>
                <RskSelect
                  {...register('card', {
                    required: t('forms.card.choose_card'),
                    setValueAs: (card) => parseInt(card) || null,
                  })}
                  optionsList={CARDS}
                  error={errors.card}
                  label={t('forms.card.question')}
                />
              </div>
              <div className={style.short}>
                <RskSelect
                  {...register('currency', {
                    required: t('forms.card.choose_currency'),
                    setValueAs: (currency) => parseInt(currency) || null,
                  })}
                  optionsList={CURRENCIES}
                  error={errors.currency}
                  label={t('forms.card.currency')}
                />
              </div>
            </div>
            <div className={style.info}>
              <p className={`${style.title} light-12  `}>
                {t('forms.personal_data.first')}{' '}
                <a
                  target="_blank"
                  href={personalData.file}
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
        <div>
          <CardInfoBig info={message} />
        </div>
      </div>
    </div>
  )
}

export default DeteilUser
