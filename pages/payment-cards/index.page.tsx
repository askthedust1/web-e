import React, { useEffect, useState } from 'react'
import Accordion from 'components/Accordion'
import { GetServerSideProps, NextPage } from 'next'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardBig from 'components/Cards/CardBig'
import ContactBlock from 'components/ContactBlock'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import NavigationPrimary from 'components/Navigations/NavigationPrimary'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import { CardsApi } from 'services/api/CardsApi'
import {
  AllCards,
  BankCards,
  BankCardsTypeOne,
  OrderCardInfoProps,
  ResultsProps,
} from 'services/api/CardsApModule'
import style from './payment-cards.module.scss'
import Icon from 'components/Icon'
import Modal from 'components/ui/Modal'
import DetailCardInfo from 'pages/payment-cards/components/detail'
import Loader from 'components/Loader'

interface Props {
  paymentCard: BankCards
  data: AllCards
  info: OrderCardInfoProps
  locale: string
}

const PaymentCards: NextPage<Props> = ({ paymentCard, data, locale, info }) => {
  const { t } = useTranslation()
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
      router.push(`/payment-cards/?payment_system=${''}${forWhoParam}`)
      return
    }
    if (currentCattegory !== category) {
      router.push(
        `/payment-cards/?payment_system=${encodeURIComponent(category)}${forWhoParam}`
      )
    }
  }
  const onFilterCardsMob = (category: string) => {
    const forWhoParam =
      router?.query.for_who === 'legal' ? '&for_who=legal' : ''
    setSelectedImage(category)
    router.push(
      `/payment-cards/?payment_system=${encodeURIComponent(category)}${forWhoParam}`
    )
  }
  return (
    <>
      <div className={style.page}>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: t('cards.payment_card_title'),
              link: '/payment-cards',
            }}
          />
        </Container>
        <Container>
          <HeadingWithNav title={t('cards.payment_card_title')} />
        </Container>

        <NavigationPrimary
          data={paymentCard?.payment_systems}
          onClick={onFilterCards}
          onFilterCardsMob={onFilterCardsMob}
          selectedImage={selectedImage}
          isCard
        />
        <Container>
          {data?.results?.map((item, _index) => (
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
                        pathname: '/bank-cards/order-card',
                        query: { ...router.query, type: item?.id, card: 1 },
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
            {(() => {
              const docs: Array<{
                id: number
                title: string
                ext: string
                file: string
              }> = info?.page?.docs || []

              const currentSystem = paymentCard?.payment_systems?.find(
                (s: any) => s.id === currentCattegory
              )
              const currentSystemName: string = (
                currentSystem?.name || ''
              ).toLowerCase()

              const findDoc = (keywords: string[]) =>
                docs.find((d) => {
                  const title = (d.title || '').toLowerCase()
                  return keywords.every((kw) =>
                    title.includes(kw.toLowerCase())
                  )
                })

              const offerDoc =
                findDoc(['публичная оферта']) ||
                findDoc(['оферта']) ||
                findDoc(['offer'])

              let rulesDoc = null

              if (currentSystemName.includes('visa')) {
                rulesDoc =
                  findDoc(['правила', 'visa']) || findDoc(['rules', 'visa'])
              } else if (currentSystemName.includes('master')) {
                rulesDoc =
                  findDoc(['правила', 'mastercard']) ||
                  findDoc(['правила', 'master']) ||
                  findDoc(['rules', 'mastercard']) ||
                  findDoc(['rules', 'master'])
              } else if (
                currentSystemName.includes('элкарт') ||
                currentSystemName.includes('elcart') ||
                currentSystemName.includes('elkart')
              ) {
                rulesDoc =
                  docs.find((d) => {
                    const t = (d.title || '').toLowerCase()
                    return (
                      (t.includes('правила') || t.includes('rules')) &&
                      (t.includes('элкарт') ||
                        t.includes('elkart') ||
                        t.includes('elcart')) &&
                      !t.includes('пенсион') &&
                      !t.includes('pension')
                    )
                  }) || null
              } else {
                rulesDoc =
                  docs.find((d) => {
                    const t = (d.title || '').toLowerCase()
                    return (
                      (t.includes('правила') || t.includes('rules')) &&
                      (t.includes('элкарт') ||
                        t.includes('elkart') ||
                        t.includes('elcart')) &&
                      !t.includes('пенсион') &&
                      !t.includes('pension')
                    )
                  }) || null
              }

              const consentDoc =
                findDoc(['согласие', 'персональных данных']) ||
                findDoc(['сбор']) ||
                findDoc([
                  'Жеке маалыматтарды чогултууга жана иштетүүгө макул',
                ]) ||
                findDoc(['персональных данных']) ||
                findDoc([
                  'Consent to the collection and processing of person',
                ]) ||
                findDoc(['personal data'])

              const items = [
                {
                  doc: offerDoc,
                },
                {
                  doc: rulesDoc,
                },
                {
                  doc: consentDoc,
                },
              ]

              return items.map((it, idx) => (
                <a
                  key={idx}
                  className={style.docButton}
                  href={it.doc?.file || '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!it.doc?.file) e.preventDefault()
                  }}
                >
                  <span className={style.docIconWrap}>
                    <Icon id="pdf" width={20} height={22} />
                  </span>
                  <span className={style.docLabel}>{it.doc?.title}</span>
                </a>
              ))
            })()}
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

export default PaymentCards
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const payment_system = (query.payment_system || '') as string
  const type = (query.type || '') as string
  const { data: info } = await CardsApi.getOrderCardInfo(locale || 'ru')
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
      locale,
      ...(await getTranslations(locale as string)),
    },
  }
}
