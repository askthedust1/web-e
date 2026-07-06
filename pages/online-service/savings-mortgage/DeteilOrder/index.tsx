import Steps from 'components/Steps'
import React, { FC, useEffect } from 'react'
import style from './deteil.module.scss'
import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'
import { IdentificationProps } from 'models/identification'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { RskSelect } from 'components/ui/Select'
import clsx from 'clsx'
import { EMPTY_SPACE } from 'helpers/space'
import { useTranslation } from 'next-i18next'
export interface FormAddress {
  fact_region_name: string;
  fact_district_name: string;
  fact_city_name: string;
  fact_locality: string;
  fact_street: string;
  fact_house: string;
  fact_flat?: string | null;
  region: number;
  district: number;
  city: string;
  locality: string;
  street: string;
  house: string;
  flat?: string | null;
  workplace: string;
  position: string;
  fact_country_name: string
}
interface Props {
  steps: string[]
  current: number
  value: FormAddress
  countries?: {
    id: number
    name: string
  }[]
  onSubmitHandler(data: FormAddress): void
  formInfo: IdentificationProps
  message?: string
  goBack(): void
  setValueState: (value:any) => void
}

const AddressForm: FC<Props> = ({
  steps,
  current,
  onSubmitHandler,
  formInfo,
  message: _message,
  goBack,
  value,
  setValueState
}) => {
  const {
    control,
    register,
    setValue,
    setError: _setError,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormAddress>({
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<FormAddress> = (data) => {
    onSubmitHandler(data)
  }
  const { t } = useTranslation()
  const watcheRegionLeg = useWatch({ control, name: 'region' })
  const watcheDistLeg = useWatch({ control, name: 'district' })
  const watcheDistCity = useWatch({ control, name: 'city' })


  const REGIONS_LEGAL = formInfo?.regions
  const DISTRICTS_LEGAL =
    REGIONS_LEGAL.filter((item) => item.id === watcheRegionLeg)[0]?.districts ||
    []
  const CITIES_LEGAL =
    DISTRICTS_LEGAL.filter((item) => item.id === watcheDistLeg)[0]?.cities || []

  useEffect(() => {
    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => {
        setValue(key as keyof FormAddress, val);
      });
    }
  }, [value, setValue]);


  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('savingsMortgage.title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={() => {
            setValueState(getValues())
            goBack()
          }} />
          <form action="" className={style.form}>
            <p className={clsx(style.subtitle, 'medium-20')}>
              {t('forms.identification.address_actual_address')}
            </p>
            {/* <div className={style.row}> */}
            <RscInput
              error={errors.fact_country_name}
              label={t('savingsMortgage.country')}
              {...register('fact_country_name', {
                required: t('savingsMortgage.country'),
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('savingsMortgage.country'),
                },
              })}
            />
            <RscInput
              error={errors.fact_region_name}
              label={t('savingsMortgage.region')}
              {...register('fact_region_name', {
                required: t('savingsMortgage.region'),
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('savingsMortgage.region'),
                },
              })}
            />
            <RscInput
              error={errors.fact_district_name}
              label={t('savingsMortgage.district')}
              {...register('fact_district_name', {
                required: t('savingsMortgage.district'),
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('savingsMortgage.district'),
                },
              })}
            />
             <RscInput
              error={errors.fact_city_name}
              label={t('savingsMortgage.city')}
              {...register('fact_city_name', {
                // required: t('savingsMortgage.city'),
                // pattern: {
                //   value: EMPTY_SPACE,
                //   message: t('savingsMortgage.city'),
                // },
              })}
            />
            <RscInput
              error={errors.fact_locality}
              label={t('savingsMortgage.settlement')}
              {...register('fact_locality', {
                required: false,
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('savingsMortgage.settlement'),
                },
              })}
            />
            <RscInput
              error={errors.fact_street}
              label={t('savingsMortgage.street')}
              {...register('fact_street', {
                required: false,
                pattern: {
                  value: EMPTY_SPACE,
                  message: t('savingsMortgage.street'),
                },
              })}
            />
            <div className={style.row}>
              <RscInput
                error={errors.fact_house}
                label={t('Номер дома (по факту)')}
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
                label={t('Номер квартиры (по факту)')}
                {...register('fact_flat', {
                  required: false,
                  pattern: {
                    value: EMPTY_SPACE,
                    message: t('Номер квартиры (по факту)'),
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
                value={watcheRegionLeg}
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
                value={watcheDistLeg}
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
                // required: t('forms.card.choose_city'),
                setValueAs: (country) => parseInt(country) || null,
              })}
              optionsList={CITIES_LEGAL}
              value={watcheDistCity}
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
              <div className={style.button} style={{marginRight: 10}}>
                <Button
                  onClick={() => {
                    setValueState(getValues())
                    goBack()
                  }}
                  value={t("savingsMortgage.back")}
                  isLarge
                  isLong
                />
              </div>
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
        <CardInfoBig info='<section>
  <h4 style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 15px;">Накопительная ипотека — ваш удобный путь к жилью мечты</h4>
  <p style="line-height: 1.6; margin-bottom: 20px;">Наш продукт "Накопительная ипотека" предназначен для того, чтобы помочь вам накопить средства на первоначальный взнос для покупки жилья. С его помощью вы сможете накапливать постепенно, выплачивая удобные фиксированные взносы.</p>
  
  <h2 style="font-size: 1.5rem; margin-top: 20px; margin-bottom: 10px; color: #000;">Как это работает:</h2>
  <ul>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Оценочная стоимость жилья:</strong> Вы выбираете стоимость жилья, например 4 000 000 сом.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Цель накоплений:</strong> Вам нужно накопить 30% от стоимости жилья, что в данном случае составляет 1 200 000 сом.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Первоначальный взнос:</strong> Сначала вносится минимальный платеж, например 10 000 сом.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Ежемесячные накопления:</strong> Оставшаяся сумма будет выплачиваться в течение 24 месяцев, что составит около 49 583 сом в месяц.</li>
  </ul>

  <p style="line-height: 1.6; margin-bottom: 20px;">Это удобный и планомерный способ накопить средства на первоначальный взнос, чтобы вы могли начать движение к своей мечте о собственном жилье.</p>
</section>
'/>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
