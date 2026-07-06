import React, { FC } from 'react'
import style from './third-step.module.scss'
import Heading from 'components/Heading/Heading'
import Steps from 'components/Steps'
import Button from 'components/Buttons/Button'
import CardInfoBig, { DocumentProps } from 'components/Cards/CardInfoBig'
import CkSelectPhoto from 'components/CkSelectPhoto'
import InputDataPicker from 'components/Input/InputDataPicker'
import { RskSelect } from 'components/ui/Select'
import { RscInput } from 'components/ui/Input'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'

export interface FormThirdStep {
  country: number
  passport_seria?: string
  passport_received?: string
  passport_from: Date
  passport_till: Date
  inn?: string
  passport_front_image: File
  passport_back_image: File
  passport_additional_image: File
}

interface Props {
  steps: string[]
  current: number
  countries?: {
    id: number
    name: string
  }[]
  onSubmitHandler(data: FormThirdStep): void
  message?: string
  documents: DocumentProps[]
  goBack(): void
  personalData: {
    desc: string
    file?: string
    id: number
    slug: string
    title: string
  }
  cardSlug?: string | null
}
const DeteilCard: FC<Props> = ({
  steps,
  current,
  countries,
  onSubmitHandler,
  message,
  documents,
  goBack,
  personalData,
  cardSlug,
}) => {
  const ALWAYS_VISIBLE_DOC_IDS = [2, 3]
  const CARD_SLUG_TO_DOC_IDS: Record<string, number[]> = {
    'elkart-beskontakt': [5],
    'elkart-socialnye-vyplaty': [6],
    'elkart-karta-pensionera': [4],
    'visa-gold': [7],
    mastercardgold: [8],
  }
  const cardSpecificDocIds = cardSlug
    ? CARD_SLUG_TO_DOC_IDS[cardSlug] || []
    : []
  const filteredDocuments = documents?.filter((d) =>
    [...ALWAYS_VISIBLE_DOC_IDS, ...cardSpecificDocIds].includes(d.id)
  )
  const {
    control,
    register,
    setValue,
    handleSubmit,

    formState: { errors },
  } = useForm<FormThirdStep>({
    mode: 'onChange',
  })
  const { t } = useTranslation()
  const onSubmit: SubmitHandler<FormThirdStep> = (data) => {
    onSubmitHandler(data)
  }
  const loadFileFront = (file: File) => {
    setValue('passport_front_image', file)
  }
  const loadFileBack = (file: File) => {
    setValue('passport_back_image', file)
  }
  const watcheResived = useWatch({ control, name: 'passport_received' })

  const isElkartWithAdditionalPhoto =
    cardSlug === 'elkart-socialnye-vyplaty' ||
    cardSlug === 'elkart-karta-pensionera'

  const loadFileAdditional = (file: File) => {
    setValue('passport_additional_image', file)
  }

  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('forms.card.title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={goBack} />
          <p className={clsx(style.subtitle, 'medium-20')}>
            {t('forms.card.passport_data')}
          </p>
          <form action="" className={style.form}>
            <RskSelect
              {...register('country', {
                required: t('forms.card.choose_citizenship'),
                setValueAs: (country) => parseInt(country) || null,
              })}
              optionsList={countries}
              error={errors?.country}
              label={t('forms.card.choose_citizenship')}
            />
            <div className={style.row}>
              <RscInput
                error={errors.passport_seria}
                label={t('forms.card.seria_number')}
                {...register('passport_seria', {
                  required: false,
                })}
                isHalf
              />
              <RscInput
                error={errors.passport_received}
                label={t('forms.card.received')}
                {...register('passport_received', {
                  required: false,
                })}
                isHalf
                value={watcheResived?.toUpperCase()}
                dontShowLabel
              />
            </div>
            <div className={style.row}>
              <Controller
                {...register('passport_from', {
                  required: t('forms.card.passport_from'),
                })}
                name="passport_from"
                control={control}
                render={({ field }) => (
                  <InputDataPicker
                    error={errors?.passport_from}
                    placeholder={t('forms.card.passport_from')}
                    onChange={(date: Date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
              <Controller
                {...register('passport_till', {
                  required: t('forms.card.passport_till'),
                })}
                name="passport_till"
                control={control}
                render={({ field }) => (
                  <InputDataPicker
                    error={errors?.passport_till}
                    placeholder={t('forms.card.passport_till')}
                    onChange={(date: Date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </div>
            <RscInput
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              error={errors.inn}
              label={t('forms.card.inn')}
              {...register('inn', {
                required: t('forms.card.inn'),
                maxLength: {
                  value: 14,
                  message: t('forms.card.inn_error_max'),
                },
                minLength: {
                  value: 8,
                  message: t('forms.card.inn_error'),
                },
                validate: (value: any) =>
                  /^\d+$/.test(value) || t('forms.card.only_numbers'),
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 14)
              }}
            />

            <div className={style.photoWrapper}>
              <Controller
                control={control}
                name="passport_front_image"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_front_image', {
                      required: t('forms.card.passport_front_image'),
                    })}
                    label={t('forms.card.passport_front_image')}
                    fileTypes={['JPG', 'PNG']}
                    onChangeFiles={loadFileFront}
                    error={errors?.passport_front_image}
                  />
                )}
              />
              <Controller
                control={control}
                name="passport_back_image"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_back_image', {
                      required: t('forms.card.passport_front_image'),
                    })}
                    label={t('forms.card.passport_back_image')}
                    fileTypes={['JPG', 'PNG']}
                    onChangeFiles={loadFileBack}
                    error={errors?.passport_back_image}
                  />
                )}
              />
            </div>

            {isElkartWithAdditionalPhoto && (
              <div>
                <Controller
                  control={control}
                  name="passport_additional_image"
                  render={() => (
                    <CkSelectPhoto
                      {...register('passport_additional_image', {
                        required: t('forms.card.passport_additional_image'),
                      })}
                      label={t('forms.card.passport_additional_image')}
                      fileTypes={['JPG', 'PNG']}
                      onChangeFiles={loadFileAdditional}
                      error={errors?.passport_additional_image}
                    />
                  )}
                />
              </div>
            )}

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
        <CardInfoBig info={message} documents={filteredDocuments} isCardOrder />
      </div>
    </div>
  )
}

export default DeteilCard
