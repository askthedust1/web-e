import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CardsApi } from 'services/api/CardsApi'
import {
  AllCards,
  BankCards,
  BankCardsTypeOne,
  OrderCardInfoProps,
  ResultsProps,
} from 'services/api/CardsApModule'

import styles from './onlineCardOrder.module.scss'
import style from 'pages/payment-cards/payment-cards.module.scss'
import Container from 'components/Container'
import NavigationPrimary from 'components/Navigations/NavigationPrimary'
import CardBig from 'components/Cards/CardBig'
import ContactBlock from 'components/ContactBlock'
import Icon from 'components/Icon'
import Accordion from 'components/Accordion'
import Modal from 'components/ui/Modal'
import DetailCardInfo from 'pages/payment-cards/components/detail'
import Loader from 'components/Loader'
import { useRouter } from 'next/router'
import visa1 from 'public/images/cards/Visa_Business.png'
import visa2 from 'public/images/cards/Visa_Infinite_5rjKwMT.png'
import visa3 from 'public/images/cards/Visa_Gold.png'
import { ArchiveCurrencyApi } from 'services/api/ArchiveCurrencyApi'

interface CardItem {
  id: number
  name: string
  image: string | null
  image_mob: string | null
  short_desc?: string | null
}

export interface BranchData {
  id: number
  is_active: boolean
  region?: { id: number; name: string } | null
  city?: { id: number; name: string } | null
  name: string
  address: string
  day_n_night: boolean
  is_closed: boolean
  is_closed_till?: string | null
  additional_info?: string
  phones?: string[]
  status?: string
  icon?: string
}

interface DocItem {
  id: number
  title: string
  ext: string
  file: string
}

interface Props {
  data: AllCards
  cards?: OrderCardInfoProps
  paymentCard: BankCards
  locale: string
  info: OrderCardInfoProps
  branch?: BranchData
}

const AUTOPLAY_MS = 1800
const WHEEL_LOCK_MS = 600
const SWIPE_THRESHOLD = 45

const CARD_W = 520
const TX_FACTOR = CARD_W * 0.38
const TZ_FACTOR = CARD_W * 0.34
const ROTATE_Y = 38
const SCALE_STEP = 0.09

const BANNER_CARDS: CardItem[] = [
  { id: 1, name: 'Visa Business', image: visa1.src, image_mob: visa1.src },
  { id: 2, name: 'Visa Infinite', image: visa2.src, image_mob: visa2.src },
  { id: 3, name: 'Visa Gold', image: visa3.src, image_mob: visa3.src },
]

const BranchBadge: React.FC<{ branch?: BranchData }> = ({ branch }) => {
  const { t } = useTranslation()
  if (!branch || !branch.name) return null

  const cityName = branch.city?.name || branch.region?.name || ''
  const isOpen = branch.is_active && !branch.is_closed
  const phone = branch.phones?.[0]

  return (
    <div className={styles.branchBadge}>
      <span className={styles.branchEyebrow}>
        {t('cards.card_order_processed_at_branch')}
      </span>

      <div className={styles.branchCard}>
        {branch.icon && (
          <div className={styles.branchIcon}>
            <img src={branch.icon} alt="" />
          </div>
        )}

        <div className={styles.branchBody}>
          <div className={styles.branchTopRow}>
            <h2 className={styles.branchName}>{branch.name}</h2>
          </div>

          {branch.address && (
            <p className={styles.branchAddress}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
              {branch.address}
            </p>
          )}

          <div className={styles.branchChips}>
            {cityName && <span className={styles.chip}>{cityName}</span>}
            {branch.day_n_night && (
              <span className={styles.chip}>Круглосуточно</span>
            )}
            {phone && <span className={styles.chip}>{phone}</span>}
          </div>

          {branch.additional_info && (
            <p className={styles.branchNote}>{branch.additional_info}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const CardCarousel: React.FC<{ items: CardItem[] }> = ({ items }) => {
  const len = items.length
  const [active, setActive] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wheelLock = useRef(false)
  const dragStartX = useRef<number | null>(null)

  const offsetOf = useCallback(
    (i: number) => {
      let d = i - active
      const half = Math.floor(len / 2)

      if (d > half) d -= len
      if (d < -half) d += len

      return d
    },
    [active, len]
  )

  const go = useCallback(
    (dir: number) => {
      setActive((prev) => (prev + dir + len) % len)
    },
    [len]
  )

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS)
  }, [go])

  useEffect(() => {
    startAutoplay()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active, startAutoplay])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const onWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return

    wheelLock.current = true
    go(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1)

    window.setTimeout(() => {
      wheelLock.current = false
    }, WHEEL_LOCK_MS)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return

    const dx = e.clientX - dragStartX.current
    dragStartX.current = null

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      go(dx < 0 ? 1 : -1)
    }
  }

  const styleFor = (i: number): React.CSSProperties => {
    const o = offsetOf(i)
    const a = Math.abs(o)
    const s = Math.sign(o)

    const translateX = o * TX_FACTOR
    const rotateY = -s * ROTATE_Y
    const translateZ = -a * TZ_FACTOR
    const scale = 1 - a * SCALE_STEP

    return {
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: a > 2 ? 0 : 1,
      zIndex: 100 - a,
      pointerEvents: o === 0 ? 'auto' : 'none',
    }
  }

  return (
    <div className={styles.carousel}>
      <div
        ref={stageRef}
        className={styles.stage}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className={styles.track}>
          {items.map((card, i) => (
            <div
              key={card.id}
              className={`${styles.card} ${
                offsetOf(i) === 0 ? styles.cardActive : ''
              }`}
              style={styleFor(i)}
              onClick={() => offsetOf(i) !== 0 && setActive(i)}
            >
              <img
                src={(card.image || card.image_mob) as string}
                alt={card.name}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const OnlineCardOrder: NextPage<Props> = ({
  locale,
  paymentCard,
  data,
  info,
  branch,
}) => {
  const { t } = useTranslation()
  const items = BANNER_CARDS

  const [selectedImage, setSelectedImage] = useState<string>('')
  const router = useRouter()
  const currentCattegory = parseInt(router.query.payment_system as string)
  const [showModal, setShowModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalContent, setModalContent] = useState<ResultsProps | null>(null)
  const [card, setCard] = useState<BankCardsTypeOne | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!modalContent?.slug) {
        return
      }

      setLoading(true)

      try {
        const response = await CardsApi.getCardSlugClient(
          modalContent?.slug,
          locale
        )
        setCard(response?.data)
      } catch {
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale, modalContent?.slug, showModal])

  const handleOpenModal = (content: any) => {
    setModalContent(content)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalContent(null)
  }

  const handleOpenInfoModal = (_content: any) => {
    setShowInfoModal(true)
  }

  const handleCloseInfoModal = () => {
    setShowInfoModal(false)
  }

  const onFilterCards = (category: number) => {
    const forWhoParam =
      router?.query.for_who === 'legal' ? '&for_who=legal' : ''
    if (currentCattegory === category) {
      router.push(
        `/cards/online-card-order/${router?.query?.slug}?payment_system=${''}${forWhoParam}`
      )
      return
    }
    if (currentCattegory !== category) {
      router.push(
        `/cards/online-card-order/${router?.query?.slug}?payment_system=${encodeURIComponent(
          category
        )}${forWhoParam}`
      )
    }
  }

  const onFilterCardsMob = (category: string) => {
    const forWhoParam =
      router?.query.for_who === 'legal' ? '&for_who=legal' : ''
    setSelectedImage(category)
    router.push(
      `/cards/online-card-order/${router?.query?.slug}?payment_system=${encodeURIComponent(
        category
      )}${forWhoParam}`
    )
  }

  const docItems = useMemo<Array<DocItem | null | undefined>>(() => {
    const docs: DocItem[] = info?.page?.docs || []

    const currentSystem = paymentCard?.payment_systems?.find(
      (s: any) => s.id === currentCattegory
    )
    const currentSystemName = (currentSystem?.name || '').toLowerCase()

    const findDoc = (keywords: string[]) =>
      docs.find((d) => {
        const title = (d.title || '').toLowerCase()
        return keywords.every((kw) => title.includes(kw.toLowerCase()))
      })

    const offerDoc =
      findDoc(['публичная оферта']) || findDoc(['оферта']) || findDoc(['offer'])

    let rulesDoc: DocItem | null | undefined = null

    if (currentSystemName.includes('visa')) {
      rulesDoc = findDoc(['правила', 'visa']) || findDoc(['rules', 'visa'])
    } else if (currentSystemName.includes('master')) {
      rulesDoc =
        findDoc(['правила', 'mastercard']) ||
        findDoc(['правила', 'master']) ||
        findDoc(['rules', 'mastercard']) ||
        findDoc(['rules', 'master'])
    } else {
      rulesDoc =
        docs.find((d) => {
          const tt = (d.title || '').toLowerCase()
          return (
            (tt.includes('правила') || tt.includes('rules')) &&
            (tt.includes('элкарт') ||
              tt.includes('elkart') ||
              tt.includes('elcart')) &&
            !tt.includes('пенсион') &&
            !tt.includes('pension')
          )
        }) || null
    }

    const consentDoc =
      findDoc(['согласие', 'персональных данных']) ||
      findDoc(['сбор']) ||
      findDoc(['персональных данных']) ||
      findDoc(['personal data'])

    return [offerDoc, rulesDoc, consentDoc]
  }, [info, paymentCard, currentCattegory])

  return (
    <>
      <Head>
        <title>{t('cards.online_card_order_title')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta
          property="og:title"
          content={t('cards.online_card_order_title')}
          key="og:title"
        />
        <meta
          property="og:description"
          content={t('cards.online_card_order_description')}
          key="og:description"
        />
        <meta
          name="description"
          content={t('cards.online_card_order_meta_description')}
          key="description"
        />
        <meta
          name="keywords"
          content={t('cards.online_card_order_keywords')}
          key="keywords"
        />
      </Head>

      <div className={styles.wrapper}>
        <h1 className={styles.heading}>
          {t('cards.online_card_order_heading')}
        </h1>

        <p className={styles.subhead}>
          {t('cards.online_card_order_subheading')}
        </p>

        <p className={styles.lede}>{t('cards.online_card_order_text')}</p>
        {items.length > 0 ? (
          <CardCarousel items={items} />
        ) : (
          <p className={styles.empty}>Нет доступных карт</p>
        )}
        <BranchBadge branch={branch} />
      </div>

      <div className={style.page} style={{ marginTop: 40 }}>
        <NavigationPrimary
          data={paymentCard?.payment_systems}
          onClick={onFilterCards}
          onFilterCardsMob={onFilterCardsMob}
          selectedImage={selectedImage}
          isCard
        />
        <Container>
          {data?.results?.map((item) => (
            <div key={item.id} className={style.cardWrapper}>
              <CardBig
                issuance={item.issuance}
                annual_service={item.annual_service}
                card_expiration_date={item.card_expiration_date}
                title={item.name}
                desc={item.short_desc}
                img={item.image}
                is_available={item.is_available}
                is_creatable={item.is_creatable}
                linkBlue={`/payment-cards/${item?.slug}`}
                link={
                  item.is_creatable
                    ? {
                        pathname: `/cards/online-card-order/registration/${router.query.slug}`,
                        query: {
                          card: item.id,
                        },
                      }
                    : null
                }
                onOpenModal={() => handleOpenModal(item)}
                onOpenInfoModal={() => handleOpenInfoModal(item)}
                currencies={item.currencies.map((curr) => curr.name).join(', ')}
              />
            </div>
          ))}
        </Container>

        {paymentCard?.support_phone && (
          <ContactBlock
            phone_number={paymentCard?.support_phone}
            email={paymentCard.support_email}
          />
        )}

        <Container>
          <div className={style.docsButtons}>
            {docItems.map((doc, idx) => (
              <a
                key={idx}
                className={style.docButton}
                href={doc?.file || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!doc?.file) e.preventDefault()
                }}
              >
                <span className={style.docIconWrap}>
                  <Icon id="pdf" width={20} height={22} />
                </span>
                <span className={style.docLabel}>{doc?.title}</span>
              </a>
            ))}
          </div>
        </Container>

        {paymentCard?.faqs && <Accordion accardion={paymentCard?.faqs} />}
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        {card && !loading ? <DetailCardInfo card={card} /> : <Loader />}
      </Modal>
      <Modal
        width="450px"
        isOpen={showInfoModal}
        onClose={handleCloseInfoModal}
      >
        <div className={style.infoModalContent}>
          <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none">
            <path
              d="M8.95043 20.6471C6.17301 19.9956 4.00437 17.827 3.35287 15.0496C2.88237 13.0437 2.88237 10.9563 3.35287 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35287C17.827 4.00437 19.9956 6.173 20.6471 8.95043C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95043 20.6471Z"
              stroke="#0095FF"
              strokeWidth="1.5"
            />
            <path
              d="M8.95043 20.6471C10.9563 21.1176 13.0437 21.1176 15.0496 20.6471C17.827 19.9956 19.9956 17.827 20.6471 15.0496C21.1176 13.0437 21.1176 10.9563 20.6471 8.95043C19.9956 6.173 17.827 4.00437 15.0496 3.35288C13.0437 2.88237 10.9563 2.88237 8.95043 3.35288C6.173 4.00437 4.00437 6.17301 3.35287 8.95043"
              stroke="#363853"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M12 15.5V11.5" stroke="#0095FF" />
            <circle cx="12" cy="9" r="0.5" stroke="#0095FF" />
          </svg>

          <h3 className={style.infoModalTitle}>
            {t('forms.card.info_modal.title')}
          </h3>

          <div className={style.infoModalText}>
            <p className={style.infoModalParagraph}>
              {t('forms.card.info_modal.text_1')}
            </p>
            <p className={style.infoModalParagraph}>
              {t('forms.card.info_modal.text_2')}
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default OnlineCardOrder

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const payment_system = (query.payment_system || '') as string
  const type = (query.type || '') as string
  const { data: info } = await CardsApi.getOrderCardInfo(locale || 'ru')
  const { data: branch } =
    await ArchiveCurrencyApi.getDetailQRBranchesByPublicId(query.slug as string)
  const { data } = await CardsApi.getAllCardsFilter(
    { payment_system, type },
    locale || 'ru'
  )
  const response = await CardsApi.getPaymentCards(locale || 'ru')
  const paymentCard = response.data

  return {
    props: {
      data,
      payment_system,
      info,
      query,
      paymentCard,
      branch,
      locale,
      ...(await getTranslations(locale as string)),
    },
  }
}
