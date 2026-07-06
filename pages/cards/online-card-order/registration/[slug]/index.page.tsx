import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { Controller, useForm, useWatch } from 'react-hook-form'

import Container from 'components/Container'
import { RscInput } from 'components/ui/Input'
import Button from 'components/Buttons/Button'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'

import { getTranslations } from '../../../../../helpers/serverTranslations'
import { EMAIL_SINX } from '../../../../../helpers/email-sinx'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'

import style from './registration.module.scss'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useRouter } from 'next/router'
import { ArchiveCurrencyApi } from 'services/api/ArchiveCurrencyApi'
import { BranchData } from 'pages/cards/online-card-order/[slug]/index.page'
import { useTranslation } from 'next-i18next'
import { OrderCardInfoProps } from 'services/api/CardsApModule'
import { CardsApi } from 'services/api/CardsApi'

/* ─── Interfaces ─── */

interface CurrencyItem {
  id: number
  name: string
  code: string
  icon: string
}

interface ServiceItem {
  id: number
  name: string
}

interface CardItem {
  id: number
  slug: string
  name: string
  image: string
  image_mob: string
  currencies: CurrencyItem[]
  services: ServiceItem[]
}

interface DeliveryMethod {
  id: number
  name: string
  caption: string | null
  delivery_type: 'with_delivery' | 'without_delivery'
  is_active: boolean
}

interface OnlineCardOrderForm {
  full_name: string
  inn: string
  work: string
  phone: string
  email?: string
  card?: number
  currencies?: number[]
  services?: number[]
  delivery?: number
  address?: string
  fact_address: string
}

interface Props {
  branch?: BranchData & { is_delivery_available?: boolean }
  info: OrderCardInfoProps & { delivery_methods?: DeliveryMethod[] }
}

/* ─── Toast notification ─── */

type ToastType = 'success' | 'error'

interface ToastData {
  id: number
  type: ToastType
  title: string
  message: string
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  if (type === 'success') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="11"
          stroke="#16a34a"
          strokeWidth="2"
          fill="#f0fdf4"
        />
        <path
          d="M7.5 12.5l3 3 6-7"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke="#dc2626"
        strokeWidth="2"
        fill="#fef2f2"
      />
      <path
        d="M12 8v4.5M12 15.5v.5"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const Toast = ({
  toast,
  onClose,
}: {
  toast: ToastData
  onClose: (id: number) => void
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  return (
    <div
      className={`${style.toast} ${
        toast.type === 'success' ? style.toastSuccess : style.toastError
      }`}
      role="alert"
    >
      <div className={style.toastIconWrap}>
        <ToastIcon type={toast.type} />
      </div>
      <div className={style.toastBody}>
        <span className={style.toastTitle}>{toast.title}</span>
        <span className={style.toastMessage}>{toast.message}</span>
      </div>
      <button
        type="button"
        className={style.toastClose}
        onClick={() => onClose(toast.id)}
        aria-label="Закрыть"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={`${style.toastProgress} ${
          toast.type === 'success'
            ? style.toastProgressSuccess
            : style.toastProgressError
        }`}
      />
    </div>
  )
}

/* ─── Main component ─── */

const Registration: NextPage<Props> = ({ branch, info }) => {
  const router = useRouter()
  const { t } = useTranslation()

  // ── Delivery methods из info (динамические ID!) ──
  const deliveryMethods = useMemo(() => {
    return (info?.delivery_methods || []).filter((m) => m.is_active)
  }, [info])

  const pickupMethod = useMemo(
    () => deliveryMethods.find((m) => m.delivery_type === 'without_delivery'),
    [deliveryMethods]
  )

  const addressMethod = useMemo(
    () => deliveryMethods.find((m) => m.delivery_type === 'with_delivery'),
    [deliveryMethods]
  )

  const isDeliveryAvailable = branch?.is_delivery_available ?? false

  // Дефолтный метод доставки — самовывоз (или первый доступный)
  const defaultDeliveryId = pickupMethod?.id || deliveryMethods[0]?.id

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OnlineCardOrderForm>({
    mode: 'onChange',
    defaultValues: {
      delivery: defaultDeliveryId,
      services: [],
    },
  })

  const watchINN = useWatch({ control, name: 'inn' })
  const watchEmail = watch('email')
  const watchCard = useWatch({ control, name: 'card' })
  const watchCurrencies = useWatch({ control, name: 'currencies' })
  const watchDelivery = useWatch({ control, name: 'delivery' })
  const watchServices = useWatch({ control, name: 'services' })

  const [cardInfo, _setCardInfo] = useState<OrderCardInfoProps | null>(
    info || null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastData[]>([])

  let toastCounter = 0
  const addToast = useCallback(
    (type: ToastType, title: string, message: string) => {
      const id = Date.now() + ++toastCounter
      setToasts((prev) => [...prev, { id, type, title, message }])
    },
    []
  )
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Текущий выбранный метод доставки (объект)
  const selectedDeliveryMethod = useMemo(() => {
    if (!watchDelivery) return null
    return deliveryMethods.find((m) => m.id === watchDelivery) || null
  }, [watchDelivery, deliveryMethods])

  const isAddressDelivery =
    selectedDeliveryMethod?.delivery_type === 'with_delivery'

  // Если доставка недоступна — принудительно самовывоз
  useEffect(() => {
    if (!isDeliveryAvailable && pickupMethod) {
      setValue('delivery', pickupMethod.id)
    }
  }, [isDeliveryAvailable, pickupMethod])

  // Сбрасываем адрес при переключении на самовывоз
  useEffect(() => {
    if (!isAddressDelivery) {
      setValue('address', '', { shouldValidate: false })
    }
  }, [isAddressDelivery])

  // Текущая выбранная карта
  const selectedCardData = useMemo(() => {
    if (!watchCard || !cardInfo?.cards) return null
    return (
      cardInfo.cards.find((c) => String(c.id) === String(watchCard)) || null
    )
  }, [watchCard, cardInfo])

  // Предзаполнение из query
  useEffect(() => {
    if (!cardInfo?.cards) return
    const cardFromQuery = router?.query?.type || router?.query?.card
    if (cardFromQuery) {
      const matched = cardInfo.cards.find(
        (c) => String(c.id) === String(cardFromQuery)
      )
      if (matched) {
        setValue('card', matched.id, { shouldValidate: true })
        const currencyFromQuery = router?.query?.payment_system
        if (currencyFromQuery) {
          const matchedCurrency = matched.currencies?.find(
            (cur) => String(cur.id) === String(currencyFromQuery)
          )
          if (matchedCurrency) {
            setValue('currencies', [matchedCurrency.id], {
              shouldValidate: true,
            })
          }
        } else if (matched.currencies?.length === 1) {
          setValue('currencies', [matched.currencies[0].id], {
            shouldValidate: true,
          })
        }
      }
    }
  }, [router?.query, cardInfo])

  // Синхронизация валют/услуг при смене карты
  useEffect(() => {
    if (!selectedCardData) {
      setValue('currencies', [])
      setValue('services', [])
      return
    }
    if (selectedCardData.currencies?.length === 1) {
      setValue('currencies', [selectedCardData.currencies[0].id], {
        shouldValidate: true,
      })
    } else {
      const currentIds = watchCurrencies || []
      const validIds = currentIds.filter((id) =>
        selectedCardData.currencies?.some((c) => c.id === id)
      )
      setValue('currencies', validIds)
    }
    const currentServiceIds = watchServices || []
    const validServiceIds = currentServiceIds.filter((id) =>
      selectedCardData.services?.some((s) => s.id === id)
    )
    setValue('services', validServiceIds)
  }, [selectedCardData])

  /* ─── Submit ─── */

  const onSubmit = async (data: OnlineCardOrderForm) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const branchPublicId = Array.isArray(router.query.slug)
      ? router.query.slug[0]
      : router.query.slug

    const obj: Record<string, any> = {
      branch_public_id: branchPublicId?.replace('?', ''),
      card: data.card,
      currencies: data.currencies || [],
      delivery: data.delivery,
      fio: data.full_name,
      inn: data.inn,
      work: data.work,
      phone: data.phone,
      email: data.email || undefined,
      fact_address: data.fact_address,
      consent: true,
    }

    // services — только если выбраны
    if (data.services && data.services.length > 0) {
      obj.services = data.services
    }

    // address — только при адресной доставке
    const deliveryObj = deliveryMethods.find((m) => m.id === data.delivery)
    if (deliveryObj?.delivery_type === 'with_delivery' && data.address) {
      obj.address = data.address
    }

    // Убираем undefined
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) delete obj[key]
    })

    try {
      const resp = await CardsApi.createCardOrderQR(obj)
      addToast(
        'success',
        'Заявка отправлена!',
        'Сотрудник банка свяжется с вами в ближайшее время по указанному номеру телефона.'
      )
      reset({
        full_name: '',
        inn: '',
        work: '',
        phone: '',
        email: '',
        card: undefined,
        currencies: [],
        services: [],
        delivery: defaultDeliveryId,
        address: '',
        fact_address: '',
      })
    } catch (e: any) {
      console.error(e)

      let errorMessage =
        'Произошла ошибка при отправке заявки. Пожалуйста, проверьте данные и попробуйте ещё раз.'

      if (e?.response?.status === 400) {
        const errData = e?.response?.data
        // Бэк может вернуть объект с ключами-полями и массивами ошибок
        if (errData && typeof errData === 'object') {
          const messages: string[] = []
          Object.entries(errData).forEach(([key, val]) => {
            if (Array.isArray(val)) {
              messages.push(...val.map((v) => String(v)))
            } else if (typeof val === 'string') {
              messages.push(val)
            }
          })
          if (messages.length > 0) {
            errorMessage = messages.join(' ')
          }
        }
      } else if (e?.response?.status === 429) {
        errorMessage =
          'Слишком много запросов. Подождите немного и попробуйте снова.'
      } else if (e?.response?.status >= 500) {
        errorMessage =
          'Сервер временно недоступен. Попробуйте отправить заявку позже.'
      } else if (!e?.response) {
        errorMessage =
          'Нет подключения к интернету. Проверьте соединение и попробуйте снова.'
      }

      addToast('error', 'Ошибка отправки', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ─── Handlers ─── */

  const handleCardSelect = (cardId: number) => {
    setValue('card', cardId, { shouldValidate: true })
  }

  const handleCurrencyToggle = (currencyId: number) => {
    const current = watchCurrencies || []
    if (current.includes(currencyId)) {
      setValue(
        'currencies',
        current.filter((id) => id !== currencyId),
        { shouldValidate: true }
      )
    } else {
      setValue('currencies', [...current, currencyId], {
        shouldValidate: true,
      })
    }
  }

  const isCurrencySelected = (currencyId: number) =>
    (watchCurrencies || []).includes(currencyId)

  const handleServiceToggle = (serviceId: number) => {
    const current = watchServices || []
    if (current.includes(serviceId)) {
      setValue(
        'services',
        current.filter((id) => id !== serviceId),
        { shouldValidate: true }
      )
    } else {
      setValue('services', [...current, serviceId], {
        shouldValidate: true,
      })
    }
  }

  const isServiceSelected = (serviceId: number) =>
    (watchServices || []).includes(serviceId)

  const handleDeliverySelect = (deliveryId: number) => {
    setValue('delivery', deliveryId, { shouldValidate: true })
  }

  /* ─── Render ─── */

  return (
    <>
      <Head>
        <title>{t('cards.online_card_order_title2')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content={t('cards.online_card_short_description')}
        />
      </Head>

      {/* Toast container */}
      {toasts.length > 0 && (
        <div className={style.toastContainer}>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>
      )}

      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('cards.online_card_order_title'),
            link: `/cards/online-card-order/${router?.query?.slug}`,
          }}
        />
      </Container>

      <Container>
        <main className={style.page}>
          {/* Hero */}
          <section className={style.hero}>
            <div className={style.heroContent}>
              <span className={style.badge}>
                {t('cards.online_application')}
              </span>
              <h1>{t('cards.online_card_application_title')}</h1>
              <p>{t('cards.online_card_application_description')}</p>
            </div>
          </section>

          <section className={style.steps}>
            <h2>{t('cards.how_it_works')}</h2>
            <div className={style.stepsGrid}>
              <div className={style.step}>
                <strong>1</strong>
                <h3>{t('cards.fill_in_details')}</h3>
                <p>{t('cards.fill_in_details_description')}</p>
              </div>
              <div className={style.step}>
                <strong>2</strong>
                <h3>{t('cards.submit_application')}</h3>
                <p>{t('cards.submit_application_description')}</p>
              </div>
              <div className={style.step}>
                <strong>3</strong>
                <h3>{t('cards.wait_for_call')}</h3>
                <p>{t('cards.wait_for_call_description')}</p>
              </div>
            </div>
          </section>

          <section className={style.content}>
            <aside className={style.sidebar}>
              {branch && (
                <div className={style.branchBox}>
                  <div className={style.branchHeader}>
                    {branch.icon && (
                      <img
                        src={branch.icon}
                        alt=""
                        className={style.branchIcon}
                      />
                    )}
                    <div>
                      <h3 className={style.branchTitle}>
                        {t('cards.branch_selection')}
                      </h3>
                    </div>
                  </div>

                  <p className={style.branchName}>{branch.name}</p>

                  {branch.address && (
                    <div className={style.branchDetail}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.38 4.5 8.5 4.5 8.5s4.5-5.12 4.5-8.5c0-2.48-2.02-4.5-4.5-4.5zm0 6.1a1.6 1.6 0 110-3.2 1.6 1.6 0 010 3.2z"
                          fill="#6b7280"
                        />
                      </svg>
                      <span>{branch.address}</span>
                    </div>
                  )}

                  {branch.region?.name && (
                    <div className={style.branchDetail}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.6A5.6 5.6 0 1113.6 8 5.61 5.61 0 018 13.6z"
                          fill="#6b7280"
                        />
                        <path
                          d="M10.47 8L8.4 6.81V4.2a.4.4 0 10-.8 0v2.84l2.32 1.34a.4.4 0 00.55-.15.4.4 0 00-.01-.23z"
                          fill="#6b7280"
                        />
                      </svg>
                      <span>{branch.region.name}</span>
                    </div>
                  )}

                  <div className={style.branchDeliveryInfo}>
                    {isDeliveryAvailable ? (
                      <span className={style.deliveryAvailable}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M13.5 5.5L10 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5V5.5z"
                            stroke="#16a34a"
                            strokeWidth="1.2"
                            fill="none"
                          />
                          <path
                            d="M5 8.5l2 2 4-4"
                            stroke="#16a34a"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {t('cards.delivery_available')}
                      </span>
                    ) : (
                      <span className={style.deliveryUnavailable}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M8 1a7 7 0 100 14A7 7 0 008 1z"
                            stroke="#9ca3af"
                            strokeWidth="1.2"
                            fill="none"
                          />
                          <path
                            d="M8 5v3.5M8 10.5v.5"
                            stroke="#9ca3af"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                        </svg>
                        Только самовывоз в отделении
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className={style.infoBox}>
                <h2>{t('cards.prepare_before_filling')}</h2>
                <ul>
                  <li>{t('cards.passport_data')}</li>
                  <li>{t('cards.inn')}</li>
                  <li>{t('cards.phone_number')}</li>
                  <li>{t('cards.residential_address')}</li>
                </ul>
                <div className={style.warning}>
                  {t('cards.actual_phone_notice')}
                </div>
              </div>
            </aside>

            <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
              <div className={style.formHeader}>
                <h2>{t('cards.card_application_form')}</h2>
                <p>{t('cards.required_fields_notice')}</p>
              </div>

              {/* ====== CARD SELECT ====== */}
              <div className={style.cardSelectSection}>
                <p className={style.cardSelectTitle}>
                  {t('forms.card.choose_card')} *
                </p>
                <input
                  type="hidden"
                  {...register('card', {
                    required: t('forms.card.choose_card'),
                  })}
                />
                <div className={style.cardGrid}>
                  {cardInfo?.cards?.map((card) => {
                    const isSelected = String(watchCard) === String(card.id)
                    return (
                      <div
                        key={card.id}
                        className={`${style.cardOption} ${isSelected ? style.cardOptionActive : ''}`}
                        onClick={() => handleCardSelect(card.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleCardSelect(card.id)
                          }
                        }}
                      >
                        <div
                          className={`${style.cardCheckmark} ${isSelected ? style.cardCheckmarkVisible : ''}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3 7l3 3 5-6"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className={style.cardImageWrap}>
                          <img
                            src={card.image_mob || card.image}
                            alt={card.name}
                            className={style.cardImage}
                            draggable={false}
                          />
                        </div>
                        <div className={style.cardMeta}>
                          <span className={style.cardName}>{card.name}</span>
                          {card.currencies && card.currencies.length > 0 && (
                            <div className={style.cardCurrenciesPreview}>
                              {card.currencies.map((cur) => (
                                <span
                                  key={cur.id}
                                  className={style.currencyDot}
                                >
                                  {cur.code}
                                </span>
                              ))}
                            </div>
                          )}
                          {card.services && card.services.length > 0 && (
                            <div className={style.cardServicesPreview}>
                              {card.services.map((svc) => (
                                <span
                                  key={svc.id}
                                  className={style.servicePill}
                                >
                                  {svc.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {errors?.card && (
                  <span className={style.fieldError}>
                    {errors.card.message as string}
                  </span>
                )}
              </div>

              {/* ====== CURRENCY MULTI-SELECT ====== */}
              {selectedCardData &&
                selectedCardData.currencies &&
                selectedCardData.currencies.length > 1 && (
                  <div className={style.currencySelectSection}>
                    <div className={style.currencySectionHeader}>
                      <p className={style.cardSelectTitle}>
                        {t('cards.select_currency')}
                      </p>
                      <span className={style.currencyHint}>
                        {t('cards.multiple_selection_available')}{' '}
                      </span>
                    </div>
                    <input
                      type="hidden"
                      {...register('currencies', {
                        validate: (val) =>
                          (val && val.length > 0) ||
                          'Выберите хотя бы одну валюту',
                      })}
                    />
                    <div className={style.currencyGrid}>
                      {selectedCardData.currencies.map((cur) => {
                        const isChecked = isCurrencySelected(cur.id)
                        return (
                          <div
                            key={cur.id}
                            className={`${style.currencyOption} ${isChecked ? style.currencyOptionActive : ''}`}
                            onClick={() => handleCurrencyToggle(cur.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleCurrencyToggle(cur.id)
                              }
                            }}
                          >
                            <div
                              className={`${style.currencyCheckbox} ${isChecked ? style.currencyCheckboxActive : ''}`}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                className={style.checkIcon}
                              >
                                <path
                                  d="M2.5 6l2.5 2.5 4.5-5"
                                  stroke="#fff"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div className={style.currencyIconWrap}>
                              {cur.icon &&
                              cur.icon !== 'https://eldik.kg/media/test' ? (
                                <img
                                  src={cur.icon}
                                  alt={cur.code}
                                  className={style.currencyIcon}
                                />
                              ) : (
                                <span className={style.currencyIconFallback}>
                                  {cur.code === 'KGZ'
                                    ? 'С'
                                    : cur.code === 'USD'
                                      ? '$'
                                      : cur.code === 'EUR'
                                        ? '€'
                                        : cur.code?.[0] || '?'}
                                </span>
                              )}
                            </div>
                            <div className={style.currencyInfo}>
                              <span className={style.currencyCode}>
                                {cur.code}
                              </span>
                              <span className={style.currencyName}>
                                {cur.name}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {watchCurrencies && watchCurrencies.length > 0 && (
                      <div className={style.currencySummary}>
                        <span className={style.currencySummaryLabel}>
                          Выбрано:
                        </span>
                        <div className={style.currencySummaryTags}>
                          {watchCurrencies.map((curId) => {
                            const cur = selectedCardData.currencies.find(
                              (c) => c.id === curId
                            )
                            if (!cur) return null
                            return (
                              <span
                                key={cur.id}
                                className={style.currencySummaryTag}
                              >
                                {cur.name} ({cur.code})
                                <button
                                  type="button"
                                  className={style.currencyRemove}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCurrencyToggle(cur.id)
                                  }}
                                  aria-label={`Убрать ${cur.name}`}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M3 3l6 6M9 3l-6 6"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    {errors?.currencies && (
                      <span className={style.fieldError}>
                        {errors.currencies.message as string}
                      </span>
                    )}
                  </div>
                )}

              {/* ====== SERVICES ====== */}
              {selectedCardData &&
                selectedCardData.services &&
                selectedCardData.services.length > 0 && (
                  <div className={style.servicesSelectSection}>
                    <div className={style.currencySectionHeader}>
                      <p className={style.cardSelectTitle}>
                        {t('cards.additional_services')}
                      </p>
                      <span className={style.currencyHint}>
                        {t('cards.optional')}
                      </span>
                    </div>
                    <div className={style.servicesGrid}>
                      {selectedCardData.services.map((svc) => {
                        const isChecked = isServiceSelected(svc.id)
                        return (
                          <div
                            key={svc.id}
                            className={`${style.serviceOption} ${isChecked ? style.serviceOptionActive : ''}`}
                            onClick={() => handleServiceToggle(svc.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleServiceToggle(svc.id)
                              }
                            }}
                          >
                            <div
                              className={`${style.currencyCheckbox} ${isChecked ? style.currencyCheckboxActive : ''}`}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                className={style.checkIcon}
                              >
                                <path
                                  d="M2.5 6l2.5 2.5 4.5-5"
                                  stroke="#fff"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div className={style.serviceIconWrap}>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                              >
                                <path
                                  d="M10 2l2.09 4.26L17 7.27l-3.5 3.42.82 4.81L10 13.27l-4.32 2.23.82-4.81L3 7.27l4.91-1.01L10 2z"
                                  stroke={isChecked ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.3"
                                  fill={isChecked ? '#146ce8' : 'none'}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <span className={style.serviceName}>
                              {svc.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

              {/* ====== DELIVERY ====== */}
              {deliveryMethods.length > 0 && (
                <div className={style.deliverySection}>
                  <p className={style.cardSelectTitle}>
                    Способ получения карты *
                  </p>
                  <input
                    type="hidden"
                    {...register('delivery', {
                      required: 'Выберите способ получения',
                    })}
                  />

                  <div className={style.deliveryGrid}>
                    {deliveryMethods.map((method) => {
                      // Скрываем адресную доставку если is_delivery_available === false
                      if (
                        method.delivery_type === 'with_delivery' &&
                        !isDeliveryAvailable
                      ) {
                        return null
                      }

                      const isActive = watchDelivery === method.id
                      const isPickup =
                        method.delivery_type === 'without_delivery'

                      return (
                        <div
                          key={method.id}
                          className={`${style.deliveryOption} ${
                            isActive ? style.deliveryOptionActive : ''
                          }`}
                          onClick={() => handleDeliverySelect(method.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleDeliverySelect(method.id)
                            }
                          }}
                        >
                          <div
                            className={`${style.deliveryRadio} ${
                              isActive ? style.deliveryRadioActive : ''
                            }`}
                          >
                            <div className={style.deliveryRadioDot} />
                          </div>

                          <div className={style.deliveryIconWrap}>
                            {isPickup ? (
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                              >
                                <path
                                  d="M4 11h20v12a2 2 0 01-2 2H6a2 2 0 01-2-2V11z"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  fill="none"
                                />
                                <path
                                  d="M2 7a2 2 0 012-2h20a2 2 0 012 2v4H2V7z"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  fill={isActive ? '#eef4ff' : 'none'}
                                />
                                <path
                                  d="M11 11v-1a3 3 0 116 0v1"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                              >
                                <path
                                  d="M3 18h1.5l1.5-5h12l2 5H22"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="8.5"
                                  cy="21"
                                  r="2"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  fill={isActive ? '#eef4ff' : 'none'}
                                />
                                <circle
                                  cx="18.5"
                                  cy="21"
                                  r="2"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  fill={isActive ? '#eef4ff' : 'none'}
                                />
                                <path
                                  d="M22 13h3l2 4v4h-3"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.5 21h5"
                                  stroke={isActive ? '#146ce8' : '#9ca3af'}
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </div>

                          <div className={style.deliveryContent}>
                            <span className={style.deliveryLabel}>
                              {method.name}
                            </span>
                            <span className={style.deliveryDesc}>
                              {isPickup
                                ? branch?.name
                                  ? `${t('cards.pickup_location')}: ${branch.name}`
                                  : 'Заберите карту в выбранном отделении банка'
                                : t('cards.courier_delivery_bishkek')}
                            </span>
                            {!isPickup && (
                              <span className={style.deliveryPaidNote}>
                                {t('cards.delivery_paid_service')}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {errors?.delivery && (
                    <span className={style.fieldError}>
                      {errors.delivery.message as string}
                    </span>
                  )}

                  {/* Поле адреса — только при with_delivery */}
                  {isAddressDelivery && isDeliveryAvailable && (
                    <div className={style.deliveryAddressField}>
                      <RscInput
                        error={errors.address}
                        label={t('cards.delivery_address')}
                        placeholder="г. Бишкек, ул. ..."
                        {...register('address', {
                          required: isAddressDelivery
                            ? 'Введите адрес доставки'
                            : false,
                        })}
                      />
                      <p className={style.deliveryAddressHint}>
                        {t('cards.delivery_address_description')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ====== FORM FIELDS ====== */}
              <div className={style.fields}>
                <RscInput
                  error={errors.full_name}
                  label={t('cards.full_name')}
                  {...register('full_name', {
                    required: 'Введите ФИО полностью',
                  })}
                />
                <RscInput
                  maxLength={MAX_INN_LENGTH}
                  type="tel"
                  error={errors.inn}
                  value={watchINN}
                  label="ИНН *"
                  {...register('inn', {
                    minLength: {
                      value: MAX_INN_LENGTH,
                      message: 'Введите корректный ИНН',
                    },
                    maxLength: {
                      value: MAX_INN_LENGTH,
                      message: 'Введите корректный ИНН',
                    },
                    required: 'Введите ИНН',
                  })}
                />
                <RscInput
                  error={errors.work}
                  label={t('cards.workplace_or_position')}
                  {...register('work', {
                    required: 'Введите место работы или должность',
                  })}
                />
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: 'Введите номер телефона',
                    minLength: {
                      value: KG_PHONE_MAX_LENGTH,
                      message: 'Введите корректный номер телефона',
                    },
                  }}
                  render={({ field: { value } }) => (
                    <InputPhone
                      placeholder={t('phoneVerification.phone_number')}
                      label={t('phoneVerification.phone_number')}
                      error={errors.phone}
                      value={value || ''}
                      onChangePhone={(event) =>
                        setValue('phone', event.formattedPhone, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
                <RscInput
                  label="Email"
                  value={watchEmail}
                  {...register('email', {
                    pattern: {
                      value: EMAIL_SINX,
                      message: 'Введите корректный email',
                    },
                    maxLength: { value: 254, message: 'Максимум 254 символа' },
                  })}
                  error={errors.email}
                />
                <RscInput
                  error={errors.fact_address}
                  label={t('cards.residential_address2')}
                  {...register('fact_address', {
                    required: 'Введите адрес проживания',
                  })}
                />
              </div>

              <div className={style.notice}>
                {t('cards.after_submit_notice')}
              </div>

              {/* ====== SUBMIT ====== */}
              <button
                type="submit"
                className={`${style.submitBtn} ${isSubmitting ? style.submitBtnLoading : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={style.spinner} />
                    <span>Отправка заявки...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M17.5 2.5L9.17 10.83M17.5 2.5l-5 15-3.33-6.67L2.5 7.5l15-5z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t('cards.submit_card_application')}</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </main>
      </Container>
    </>
  )
}

export default Registration

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const { data: branch } =
    await ArchiveCurrencyApi.getDetailQRBranchesByPublicId(query.slug as string)
  const { data } = await CardsApi.getOrderCardInfo(locale || 'ru')

  return {
    props: {
      branch,
      query,
      info: data,
      locale,
      ...(await getTranslations(locale as string)),
    },
  }
}
