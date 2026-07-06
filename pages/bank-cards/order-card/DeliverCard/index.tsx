import React, { FC } from 'react'
import style from './second.module.scss'
import Heading from 'components/Heading/Heading'
import Steps from 'components/Steps'
import clsx from 'clsx'
import Button from 'components/Buttons/Button'
import CardInfoBig, { DocumentProps } from 'components/Cards/CardInfoBig'
import { useTranslation } from 'next-i18next'
import { UserInfoResponse } from 'services/api/GeneralApi'
import {
  DeliverCardProps,
  DeliveryCard,
  DeliveryMethods,
  RegionDelivery,
  Root2,
} from 'services/api/CardsApModule'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RskSelect } from 'components/ui/Select'
import InputRadio from 'components/Input/InputRadio'
import { DELIVERY_METHODS } from 'constants/delivery-methods'
import DeliverCity from './components/Delivery'
import { RscInput } from 'components/ui/Input'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import { deliveryZones } from 'pages/bank-cards/order-card/SelectCard'
import AppImage from 'components/ui/AppImage'

export interface FormSecondStep {
  city?: number | string
  branch: number | string
  delivery: number | string
  address: string
  fact_address: string
  email: string
  fio: string
  work: string
  phone: string
  code_word: string
  region?: string
  fact_district?: string
  street?: string
  home_number?: string
  delivery_time?: string
}

interface Delivery {
  city: string
  branch?: number
  delivery: number | string
  address: string
  fact_address: string
  email: string
  fio: string
  work: string
  phone: string
  code_word: string
  region?: string
  fact_district?: string
  street?: string
  home_number?: string
  delivery_time?: string
}

interface Props {
  current: number
  cities?: DeliverCardProps[]
  onSubmitHandler(data: FormSecondStep): void
  user?: UserInfoResponse | null
  steps: string[]
  message?: string
  documents: DocumentProps[]
  goBack(): void
  delivery_methods: DeliveryMethods[]
  delivery_branches: Root2[]
  regions: RegionDelivery[]
  delivery_cities: DeliveryCard[]
  cardSlug?: string | null
}

const DeliverCard: FC<Props> = ({
  current,
  cities,
  onSubmitHandler,
  steps,
  message,
  documents,
  goBack,
  delivery_methods,
  delivery_branches,
  regions,
  delivery_cities,
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
    watch,
    setValue,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Delivery>({
    mode: 'onChange',
  })
  const watcheDeliveryMetod = useWatch({ control, name: 'delivery' })

  const { t } = useTranslation()

  const _brancehs = delivery_branches?.map((item) => item.branch)

  const regionsOptions = regions?.map((region) => ({
    id: region.id,
    name: region.name,
  }))

  const onSubmit: SubmitHandler<Delivery> = (data) => {
    const currentData: FormSecondStep = {
      region: data.region || '',
      delivery_time: data.delivery_time || undefined,
      city: data.city || '',
      branch: data.branch || '',
      address: `${data.region || ''} ${data.city || ''} ${data?.fact_district || ''} ${data?.street || ''} ${data?.home_number || ''} `,
      delivery: data.delivery || '',
      fact_address: data.fact_address || '',
      email: data.email || '',
      fio: data.fio || '',
      work: data.work || '',
      phone: data.phone || '',
      code_word: data.code_word || '',
    }
    onSubmitHandler(currentData)
  }

  const watcheCity = useWatch({ control, name: 'city' })
  const watchedRegion = useWatch({ control, name: 'region' })

  const _captions = cities?.filter(
    (city) => city?.city?.id === parseInt(watcheCity)
  )[0]

  const _listBranches = cities?.filter(
    (listCity) => listCity.city.id === parseInt(watcheCity)
  )[0]?.city

  const _listCity = cities?.map((item) => ({
    name: item.city.name,
    id: item.city.id,
  }))

  const selectDeliveryMethod = (id: number) => {
    reset()
    setValue('delivery', id)
  }

  const delivery_method = () => {
    const filter =
      delivery_methods?.filter((item) => item.id === watcheDeliveryMetod)[0] ||
      []
    const filteredBranches = delivery_branches
      ?.filter((item) => item.region_id === Number(watchedRegion))
      .map((item) => item.branch)
    switch (filter?.delivery_type) {
      case DELIVERY_METHODS.DELIVERY:
        return (
          <DeliverCity
            watch={watch}
            register={register}
            errors={errors}
            delivery_cities={delivery_cities}
          />
        )
      case DELIVERY_METHODS.NO_DELIVERY:
        return (
          <>
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
          </>
        )
      default:
        return (
          <DeliverCity
            watch={watch}
            register={register}
            errors={errors}
            delivery_cities={delivery_cities}
          />
        )
    }
  }

  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('forms.card.title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={goBack} />
          <form className={style.form}>
            <p className={clsx(style.subtitle, 'medium-20')}>
              {t('forms.card.choose_delivery')}
            </p>
            <div className={style.radioBlock}>
              <Controller
                control={control}
                name="delivery"
                render={() => (
                  <InputRadio
                    {...register('delivery', {
                      required: t('required_field'),
                      setValueAs: (branch) => parseInt(branch) || null,
                    })}
                    value={watcheDeliveryMetod}
                    name="delivery"
                    onClick={selectDeliveryMethod}
                    labelArray={delivery_methods}
                    error={errors.delivery}
                  />
                )}
              />
            </div>

            {watcheDeliveryMetod && (
              <>
                <div className={style.section}>{delivery_method()}</div>

                <div>
                  <RscInput
                    {...register('fact_address', {
                      required: t(
                        'forms.identification.address_actual_address'
                      ),
                    })}
                    error={errors.fact_address}
                    label={t('forms.identification.address_actual_address')}
                  />
                  <RscInput
                    label={t('contacts.email')}
                    placeholder={t('forms.contacts.email')}
                    {...register('email', {
                      required: t('forms.card.input') + t('contacts.email'),
                      pattern: {
                        value: EMAIL_SINX,
                        message: t('forms.card.email_error'),
                      },
                    })}
                    error={errors.email}
                  />
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
                  <RscInput
                    error={errors.work}
                    label={t('forms.identification.job_position')}
                    {...register('work', {
                      required: t('forms.identification.job_position'),
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
                    error={errors.code_word}
                    label={t('code_word')}
                    {...register('code_word', {
                      required: t('code_word'),
                    })}
                  />
                </div>

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
              </>
            )}
          </form>
        </div>
      </div>
      <div className={style.part}>
        <CardInfoBig info={message} documents={filteredDocuments} isCardOrder />

        <div className={style.deliveryContainer}>
          <AppImage
            src="/images/zone.png"
            alt="Бишкек"
            className={style.image}
            width={600}
            height={600}
            sizes="(max-width: 768px) 100vw, 400px"
          />

          <div className={style.deliveryZones}>
            <h3 className={style.deliveryTitle}>
              {t('forms.card.delivery.deliveryZones')}
            </h3>
            <div className={style.zonesList}>
              {deliveryZones.map((zone, index) => (
                <div key={index} className={style.zoneItem}>
                  <div
                    className={style.zoneColor}
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className={style.zoneName}>{zone.name}</span>
                  <span className={style.zonePrice}>– {zone.price}</span>
                </div>
              ))}
            </div>
            <p className={style.deliveryNote}>
              {t('forms.card.cardDelivery.deliveryNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliverCard
