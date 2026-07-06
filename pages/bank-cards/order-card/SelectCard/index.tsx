import Steps from 'components/Steps'
import React, { FC } from 'react'
import Heading from 'components/Heading/Heading'
import Button from 'components/Buttons/Button'
import CardInfoBig, { DocumentProps } from 'components/Cards/CardInfoBig'
import clsx from 'clsx'
import { CardsList } from 'services/api/CardsApModule'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import InputRadio from 'components/Input/InputRadio'
import { InputCheckBox } from 'components/Input/InputCheckBox'
import style from './first-step.module.scss'
import { RskSelectImg } from 'components/ui/SelectImg'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { cloneDeep } from 'lodash'

export interface FormFirstStep {
  card: number | string[] | string
  currencies: number[] | number
  services?: number[] | number
  recaptcha?: string
}

interface SelectCardProps {
  allCard?: CardsList[]
  onSubmitHandler(data: FormFirstStep): void
  current: number
  steps: string[]
  message?: string
  documents: DocumentProps[]
  goBack(): void
}

export const deliveryZones = [
  {
    name: 'Зона А',
    price: '200 сом',
    color: '#00F2F3',
  },
  {
    name: 'Зона Б',
    price: '250 сом',
    color: '#F974F8',
  },
  {
    name: 'Зона В',
    price: '300 сом',
    color: '#7373F5',
  },
]

const SelectCard: FC<SelectCardProps> = ({
  allCard,
  onSubmitHandler,
  current,
  steps,
  message,
  documents,
  goBack,
}) => {
  const { t } = useTranslation()
  const Router = useRouter()
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFirstStep>({
    mode: 'onChange',
    defaultValues: {
      card: Router.query.type?.length
        ? parseInt(Router?.query?.type as string)
        : allCard?.[0]?.id,
      services: [],
    },
  })

  const onSubmit: SubmitHandler<FormFirstStep> = (data) => {
    onSubmitHandler(data)
  }

  const selectForWho = (id: number) => {
    setValue('currencies', id)
  }

  const watcheServices = useWatch({ control, name: 'services' })

  const chooseCard = (cardId: string) => {
    const currentOption = allCard?.filter(
      (item) => String(item?.id) === cardId
    )[0]?.id
    Router.push({
      pathname: `/bank-cards/order-card`,
      query: { ...Router.query, type: currentOption },
    })
    setValue('card', parseInt(cardId))
  }

  const typeCurrencyHandler = (id: number) => {
    const arrayCurrency: any = cloneDeep(watcheServices) || []
    const indexArray = arrayCurrency.indexOf(id)

    if (indexArray === -1) {
      arrayCurrency.push(id)

      setValue('services', arrayCurrency)
    } else {
      arrayCurrency.splice(indexArray, indexArray + 1)
      setValue('services', arrayCurrency)
    }
  }

  const watchCard = useWatch({ control, name: 'card' })
  const watcheCurrencies = useWatch({ control, name: 'currencies' })

  if (!allCard) return null

  const currencies =
    allCard?.filter((cards) => String(cards?.id) === String(watchCard))[0]
      ?.currencies || []

  const servicesList =
    allCard?.filter((cards) => String(cards.id) === String(watchCard))[0]
      ?.services || []

  const currentOption =
    allCard?.filter(
      (item) => String(item?.id) === String(Router?.query?.type)
    )[0]?.id || allCard[0]?.id

  const ALWAYS_VISIBLE_DOC_IDS = [2, 3]
  const CARD_SLUG_TO_DOC_IDS: Record<string, number[]> = {
    'elkart-beskontakt': [5],
    'elkart-socialnye-vyplaty': [6],
    'elkart-karta-pensionera': [4],
    'visa-gold': [7],
    mastercardgold: [8],
  }

  const selectedCardSlug =
    allCard?.find((c) => String(c.id) === String(watchCard))?.slug || ''

  const cardSpecificDocIds = CARD_SLUG_TO_DOC_IDS[selectedCardSlug] || []
  const allowedDocIds = [...ALWAYS_VISIBLE_DOC_IDS, ...cardSpecificDocIds]
  const filteredDocuments = documents?.filter((doc) =>
    allowedDocIds.includes(doc.id)
  )

  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('forms.card.title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={goBack} />
          <p className={clsx(style.title, 'medium-20')}>
            {t('forms.card.question')}
          </p>
          <form className={style.form}>
            <div className={style.cardSelectWrapper}>
              <p className={style.formElementTitle}>
                {t('forms.card.choose_card')}
              </p>
              <RskSelectImg
                error={errors?.card}
                label=""
                optionsList={allCard || null}
                {...register('card', {
                  required: t('forms.card.choose_card'),
                  setValueAs: (card) => parseInt(card) || null,
                })}
                selectedImg={watchCard}
                value={currentOption}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  chooseCard(e.target.value)
                }
              />
            </div>

            <div className={style.radioBlock}>
              <p className={style.formElementTitle}>
                {t('forms.card.currency')}
              </p>
              <Controller
                control={control}
                name="currencies"
                render={() => (
                  <InputRadio
                    {...register('currencies', {
                      required: t('forms.card.choose_currency'),
                      setValueAs: (branch) => parseInt(branch) || null,
                    })}
                    value={watcheCurrencies}
                    name="currencies"
                    onClick={selectForWho}
                    labelArray={currencies}
                    error={errors.currencies}
                  />
                )}
              />
            </div>

            <div className={style.checkboxWrapper}>
              <p className={style.formElementTitle}>
                {t('forms.card.extra_info')}
              </p>
              <div className={style.checkboxBlock}>
                <Controller
                  control={control}
                  name="services"
                  render={() => (
                    <InputCheckBox
                      {...register('services', {
                        required: false,
                      })}
                      error={errors.services}
                      value={watcheServices}
                      name="services"
                      labelArray={servicesList}
                      onClick={typeCurrencyHandler}
                    />
                  )}
                />
              </div>
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
          </form>
        </div>
      </div>
      <div className={style.part}>
        <CardInfoBig info={message} documents={filteredDocuments} isCardOrder />
      </div>
    </div>
  )
}

export default SelectCard
