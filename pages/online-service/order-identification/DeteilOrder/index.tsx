import Steps from 'components/Steps'
import React, { FC } from 'react'
import style from './deteil.module.scss'
import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'
import { IdentificationProps } from 'models/identification'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { RskSelect } from 'components/ui/Select'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { EMAIL_SINX } from 'helpers/email-sinx'
import clsx from 'clsx'
import { AddresIndendificationProps } from 'services/api/IdentificationModule'
import { EMPTY_SPACE } from 'helpers/space'
import { useTranslation } from 'next-i18next'

export interface FormAddress {
  fact_region: number
  fact_district: number
  fact_city: number
  fact_locality?: string
  fact_street: string
  fact_house: string
  fact_flat: string
  region: number
  district: number
  city: number
  locality: string
  street: string
  house: string
  flat: string
  phone: string
  whatsapp?: string
  email?: string
  workplace: string
  position: string
}
interface Props {
  steps: string[]
  current: number
  countries?: {
    id: number
    name: string
  }[]
  onSubmitHandler(data: AddresIndendificationProps): void
  formInfo: IdentificationProps
  message?: string
  goBack(): void
}

const AddressForm: FC<Props> = ({
  steps,
  current,
  onSubmitHandler,
  formInfo,
  message,
  goBack,
}) => {
  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAddress>({
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<FormAddress> = (data) => {
    onSubmitHandler(data)
  }
  const { t } = useTranslation()
  const watcheRegion = useWatch({ control, name: 'fact_region' })
  const watcheDist = useWatch({ control, name: 'fact_district' })
  const watcheRegionLeg = useWatch({ control, name: 'region' })
  const watcheDistLeg = useWatch({ control, name: 'district' })
  const REGIONS = formInfo?.regions
  const DISTRICTS =
    REGIONS.filter((item) => item.id === watcheRegion)[0]?.districts || []
  const CITIES =
    DISTRICTS.filter((item) => item.id === watcheDist)[0]?.cities || []
  const REGIONS_LEGAL = formInfo?.regions
  const DISTRICTS_LEGAL =
    REGIONS_LEGAL.filter((item) => item.id === watcheRegionLeg)[0]?.districts ||
    []
  const CITIES_LEGAL =
    DISTRICTS_LEGAL.filter((item) => item.id === watcheDistLeg)[0]?.cities || []
  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('forms.identification.main_title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={goBack} />
          <form action="" className={style.form}>
            <p className={clsx(style.subtitle, 'medium-20')}>
              {t('forms.identification.address_actual_address')}
            </p>
            {/* <div className={style.row}> */}
              <RskSelect
                className={style.selectWrapper}
                {...register('fact_region', {
                  required: t('forms.identification.region'),
                  setValueAs: (reg) => parseInt(reg) || null,
                })}
                optionsList={REGIONS?.map((item) => ({
                  name: item.name,
                  id: item.id,
                }))}
                error={errors.fact_region}
                label={t('forms.identification.region')}
                // isHalf
              />

              <RskSelect
                className={style.selectWrapper}
                {...register('fact_district', {
                  required: t('forms.identification.district'),
                  setValueAs: (value) => parseInt(value) || null,
                })}
                optionsList={DISTRICTS.map((item) => ({
                  name: item.name,
                  id: item.id,
                }))}
                error={errors.fact_district}
                label={t('forms.identification.district')}
                // isHalf
              />
            {/* </div> */}
            <RskSelect
              {...register('fact_city', {
                required: t('forms.card.choose_city'),
                setValueAs: (country) => parseInt(country) || null,
              })}
              optionsList={CITIES}
              error={errors.fact_city}
              label={t('forms.card.choose_city')}
            />
            <RscInput
              error={errors.fact_locality}
              label={t('forms.identification.vilage')}
              {...register('fact_locality', {
                required: false,
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('forms.identification.vilage'),
                },
              })}
            />
            <RscInput
              error={errors.fact_street}
              label={t('forms.identification.street')}
              {...register('fact_street', {
                required: false,
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('forms.identification.street'),
                },
              })}
            />
            <div className={style.row}>
              <RscInput
                error={errors.fact_house}
                label={t('forms.identification.home_number')}
                {...register('fact_house', {
                  required: false,
                  pattern: {
                    value: EMPTY_SPACE,
                    message: t('forms.identification.home_number'),
                  },
                })}
                isHalf
              />
              <RscInput
                error={errors.fact_flat}
                label={t('forms.identification.flat_number')}
                {...register('fact_flat', {
                  required: false,
                  pattern: {
                    value: EMPTY_SPACE,
                    message: t('forms.identification.flat_number'),
                  },
                })}
                isHalf
              />
            </div>
            <p className={clsx(style.subtitle, 'medium-20')}>
              {t('forms.identification.legal_address')}
            </p>
            <div className={style.row}>
              <RskSelect
                {...register('region', {
                  required: t('forms.identification.region'),
                  setValueAs: (reg) => parseInt(reg) || null,
                })}
                optionsList={REGIONS_LEGAL.map((item) => ({
                  name: item.name,
                  id: item.id,
                }))}
                error={errors.region}
                label={t('forms.identification.region')}
                isHalf
              />
              <RskSelect
                {...register('district', {
                  required: t('forms.identification.district'),
                  setValueAs: (country) => parseInt(country) || null,
                })}
                optionsList={DISTRICTS_LEGAL.map((item) => ({
                  name: item.name,
                  id: item.id,
                }))}
                error={errors.district}
                label={t('forms.identification.district')}
                isHalf
              />
            </div>
            <RskSelect
              {...register('city', {
                required: t('forms.card.choose_city'),
                setValueAs: (country) => parseInt(country) || null,
              })}
              optionsList={CITIES_LEGAL}
              error={errors.city}
              label={t('forms.card.choose_city')}
            />
            <RscInput
              error={errors.locality}
              label={t('forms.identification.vilage')}
              {...register('locality', {
                required: false,
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('forms.identification.vilage'),
                },
              })}
            />
            <RscInput
              error={errors.street}
              label={t('forms.identification.street')}
              {...register('street', {
                required: false,
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('forms.identification.street'),
                },
              })}
            />
            <div className={style.row}>
              <RscInput
                error={errors.house}
                label={t('forms.identification.home_number')}
                {...register('house', {
                  required: false,
                  pattern: {
                    value: EMPTY_SPACE,
                    message: t('forms.identification.home_number'),
                  },
                })}
                isHalf
              />
              <RscInput
                error={errors.flat}
                label={t('forms.identification.flat_number')}
                {...register('flat', {
                  required: false,
                })}
                isHalf
              />
            </div>

            <p className="medium-20">
              {t('forms.identification.contact_data')}
            </p>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: t('forms.card.input') + t('forms.card.phone'),
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
                    massage={t('forms.identification.phone_massage')}
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
            <div className={style.row}>
              <RscInput
                error={errors.whatsapp}
                label={t('contacts.whatsapp')}
                {...register('whatsapp', {
                  required: false,
                })}
                isHalf
                type="number"
              />
              <RscInput
                label={t('contacts.email')}
                placeholder={t('contacts.email')}
                {...register('email', {
                  required: false,
                  pattern: {
                    value: EMAIL_SINX,
                    message: t('forms.card.email_error'),
                  },
                })}
                error={errors.email}
                isHalf
              />
            </div>
            <RscInput
              error={errors.workplace}
              label={t('forms.identification.work_place')}
              {...register('workplace', {
                required: false,
              })}
            />
            <RscInput
              error={errors.position}
              label={t('forms.identification.job_position')}
              {...register('position', {
                required: false,
              })}
            />
            <div className={style.info}>
              <div className={style.button}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  value={t('forms.card.continue')}
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

export default AddressForm
