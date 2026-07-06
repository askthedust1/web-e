import React from 'react'
import AppImage from 'components/ui/AppImage'
import style from 'pages/payment-cards/payment-cards.module.scss'
import parse from 'html-react-parser'
import { BankCardsTypeOne } from 'services/api/CardsApModule'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import Button from 'components/Buttons/Button'
import { useRouter } from 'next/router'
import Icon from 'components/Icon'

interface Props {
  card: BankCardsTypeOne
}

interface Advantage {
  id: number
  title: string
  icon?: string
}

const isVirtualCard = (cardName: string): boolean => {
  if (!cardName) return false

  const virtualCardKeywords = [
    'виртуальная',
    'виртуальные',
    'виртуальной',
    'virtual',
    'цифровая',
    'цифровые',
    'цифровой',
  ]

  const lowerName = cardName.toLowerCase()
  return virtualCardKeywords.some((keyword) => lowerName.includes(keyword))
}

const getAdvantageIcon = (_title: string, icon?: string) => {
  if (icon) {
    return <AppImage width={40} height={40} src={icon} alt="ic" />
  }

  return '✅'
}

const AdvantageCard: React.FC<{ advantage: Advantage }> = ({ advantage }) => {
  return (
    <div className={style.advantageCard}>
      <div className={style.advantageIconWrapper}>
        <div className={style.advantageIcon}>
          {getAdvantageIcon(advantage.title, advantage.icon)}
        </div>
      </div>
      <div className={style.advantageContent}>
        <h3 className={style.advantageTitle}>{advantage.title}</h3>
      </div>
    </div>
  )
}

const CardBenefitsGrid: React.FC<{
  title: string
  advantages: Advantage[]
}> = ({ title, advantages }) => {
  return (
    <section className={style.benefitsSection}>
      <div className={style.benefitsHeader}>
        <h2 className={style.benefitsTitle}>{title}</h2>
      </div>

      <div className={style.benefitsGrid}>
        {advantages.map((advantage) => (
          <AdvantageCard key={advantage.id} advantage={advantage} />
        ))}
      </div>
    </section>
  )
}

const APP_STORE_LINK = 'https://apps.apple.com/sn/app/eldik/id6596756225'
const PLAY_STORE_LINK =
  'https://play.google.com/store/apps/details?id=kg.rsk.staging&pcampaignid=web_share'

const DetailCardInfo: NextPage<Props> = ({ card }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isVirtual = isVirtualCard(card.name)

  const handleOpenTariff = () => {
    if (card?.tariff_term_file) {
      window.open(card.tariff_term_file, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDownloadApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor

    const win = window as any

    if (/android/i.test(userAgent)) {
      window.open(PLAY_STORE_LINK, '_blank', 'noopener,noreferrer')
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !win.MSStream) {
      window.open(APP_STORE_LINK, '_blank', 'noopener,noreferrer')
    } else {
      window.open(PLAY_STORE_LINK, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      <div className={style.modalHeader}>
        <h2 className={style.title}>{card.name}</h2>
      </div>

      <div className={style.modalBody}>
        <div className={style.cardsInfo}>
          <div className={style.cardImageContainer}>
            {card?.image_detail && (
              <AppImage
                src={card.image_detail}
                alt={card?.name || 'Изображение карты'}
                width={400}
                height={350}
                sizes="(max-width: 768px) 280px, 300px"
                className={style.cardImage}
              />
            )}
            {isVirtual && <div className={style.virtualCardNote}></div>}
          </div>

          <div className={style.cardDetails}>
            {card?.desc && (
              <div className={style.cardDescription}>{parse(card.desc)}</div>
            )}

            {card?.issuance &&
              (card?.annual_service || card?.card_expiration_date) && (
                <div className={style.cardSpecs}>
                  <div className={style.specsGrid}>
                    <div className={style.specItem}>
                      <span className={style.specLabel}>
                        {t('forms.card.features.issuance')}
                      </span>
                      <span className={style.specValue}>{card.issuance}</span>
                    </div>

                    <div className={style.specItem}>
                      {card?.card_expiration_date && (
                        <>
                          <span className={style.specLabel}>
                            {t('forms.card.features.expiration')}
                          </span>
                          <span className={style.specValue}>
                            {card?.card_expiration_date}
                          </span>
                        </>
                      )}
                      {card?.annual_service && (
                        <>
                          <span className={style.specLabel}>
                            {t('forms.card.features.annual_service')}
                          </span>
                          <span className={style.specValue}>
                            {card?.annual_service}
                          </span>
                        </>
                      )}
                    </div>

                    <div className={style.specItem}>
                      <span className={style.specLabel}>
                        {t('forms.card.features.currency')}
                      </span>
                      <span className={style.specValue}>
                        {card.currencies?.map((curr) => curr.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {card?.docs && card.docs.length > 0 && (
              <div className={style.cardDocsBlock}>
                <p className={style.cardDocsHeading}>{t('doc')}</p>
                {card.docs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file}
                    target="_blank"
                    rel="noreferrer"
                    className={style.cardDocsRow}
                  >
                    <span className={style.cardDocsIconWrap}>
                      <Icon id="pdf" width={20} height={20} />
                    </span>
                    <span className={style.cardDocsName}>{doc.title}</span>
                    {doc.ext && (
                      <span className={style.cardDocsBadge}>
                        {doc.ext.toUpperCase()}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {card?.advantages && card.advantages.length > 0 && (
          <CardBenefitsGrid
            title={t('forms.card.benefits_title')}
            advantages={card.advantages}
          />
        )}
      </div>

      <div className={style.modalFooter}>
        <div className={style.footerActions}>
          {isVirtual ? (
            <Button
              value="Скачать приложение"
              isLarge
              isBlue
              onClick={handleDownloadApp}
            />
          ) : (
            <>
              {card?.is_creatable && (
                <Button
                  value={t('setting.button_request')}
                  isLarge
                  isBlue
                  hrefLink={
                    card?.is_creatable
                      ? {
                          pathname: '/bank-cards/order-card',
                          query: { ...router.query, type: card.id, card: 1 },
                        }
                      : null
                  }
                />
              )}
            </>
          )}

          <Button
            value={t('forms.card.buttons.tariffs')}
            isLarge
            isOutline
            onClick={handleOpenTariff}
            disabled={!card?.tariff_term_file}
          />
        </div>
      </div>
    </>
  )
}

export default DetailCardInfo
