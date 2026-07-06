import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import HeadingWithNav from 'components/Heading/Heading'
import { RskSelect } from 'components/ui/Select'
import React, { useMemo } from 'react'
import { DeliveryCard } from 'services/api/CardsApModule'

interface Props {
  register: any
  errors: any
  delivery_cities: DeliveryCard[]
  watch: any
}

const DeliverCity = ({ register, errors, delivery_cities, watch }: Props) => {
  const { t } = useTranslation()

  const selectedCityId = watch('city')

  const cityOptions = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>()

    delivery_cities?.forEach(item => {
      map.set(item.city.id, {
        id: item.city.id,
        name: item.city.name,
      })
    })

    return Array.from(map.values())
  }, [delivery_cities])

  const _isBishkek = cityOptions.find(
    city => city.id === Number(selectedCityId)
  )?.name.includes('г. Бишкек')

  const deliveryTimeOptions = useMemo(
    () => [
      {
        id: '9:00-13:00',
        name: '9:00-13:00',
      },
      {
        id: '13:00-18:00',
        name: '13:00–18:00',
      },
      {
        id: '18:00-21:00',
        name: '18:00–21:00',
      },
      {
        id: 'anytime',
        name: 'В любое время',
      },
    ],
    []
  )

  return (
    <div>
      <HeadingWithNav title="Адрес доставки карты" />

      <RskSelect
        label={t('city')}
        error={errors?.city}
        optionsList={cityOptions}
        {...register('city', {
          required: t('required_field'),
          setValueAs: (value: any) => Number(value) || null,
        })}
      />

      <RskSelect
        label={t("forms.card.delivery.timeLabel")}
        error={errors?.delivery_time}
        optionsList={deliveryTimeOptions}
        {...register("delivery_time", {
          required: t("forms.card.delivery.timeRequired"),
        })}
      />

      <RscInput
        {...register('street', {
          required: t('street'),
        })}
        error={errors.street}
        label={t('street')}
      />

      <RscInput
        {...register('home_number', {
          required: false,
        })}
        error={errors.home_number}
        label={t('home_number')}
      />
    </div>
  )
}
export default DeliverCity
