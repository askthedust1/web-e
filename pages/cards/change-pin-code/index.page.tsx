import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { getTranslations } from 'helpers/serverTranslations'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'

import Container from 'components/Container'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Section from 'components/Section'
import HeadingWithNav from 'components/Heading/Heading'

import { ServicePoints } from 'services/api/BranchesApi'
import {
  Branches,
  Cities,
  ServiceDetailProps,
} from 'services/api/BranchesApimodule'
import MapPoints from 'pages/points/components/MapPoints'

import s from './сhangePinCode .module.scss'

import imgStep1 from 'public/images/cards/step.png'
import imgStep2 from 'public/images/cards/step2.png'
import imgStep3 from 'public/images/cards/step3.png'
import imgStep4 from '../../../public/images/cards/step4.jpg'
import imgStep5 from '../../../public/images/cards/step5.jpg'
import qr from '../../../public/images/cards/qr.png'
import style from 'components/Banner/banner.module.scss'

type TabId = 'app' | 'atm' | 'branch'

interface ChangePinCodeProps {
  bankomats: Branches[]
  branches: Branches[]
  regions: Cities[]
}

const PhoneFrame: React.FC<{
  image: StaticImageData
  alt: string
  isLast?: boolean
}> = ({ image, alt, isLast }) => (
  <div className={clsx(s.phone, isLast && s.phoneGlow)}>
    <div className={s.phoneButtonLeft} />
    <div className={s.phoneButtonRight1} />
    <div className={s.phoneButtonRight2} />
    <div className={s.phoneBody}>
      <div className={s.phoneNotch}>
        <div className={s.phoneCam} />
      </div>
      <div className={s.phoneScreen}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="160px"
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
          placeholder="blur"
          quality={85}
        />
      </div>
      <div className={s.phoneBar} />
    </div>
  </div>
)

const QrModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation()

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={s.modal}>
        <button className={s.modalX} onClick={onClose}>
          ×
        </button>

        <div className={s.modalBody}>
          <h3 className={s.modalTitle}>
            {t('pin_change.qr_title', t('cards.download_eldik_app'))}
          </h3>
          <p className={s.modalDesc}>
            {t('pin_change.qr_subtitle', t('cards.scan_qr_code'))}
          </p>

          <div className={s.qrBox}>
            <Image
              src={qr}
              alt="QR"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
              placeholder="blur"
              className={s.qrImg}
            />
          </div>

          <div className={style.gridApps}>
            <a
              href="https://play.google.com/store/apps/details?id=kg.rsk.staging&hl=en"
              target="_blank"
              rel="noreferrer"
              className={style.app__link}
            >
              {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
              <img
                alt=""
                src="/images/mobile-app/google.svg"
                width={160}
                height={52}
              />
            </a>
            <a
              href="https://apps.apple.com/kg/app/eldik/id6596756225"
              target="_blank"
              rel="noreferrer"
              className={style.app__link}
            >
              {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
              <img
                alt=""
                src="/images/mobile-app/appstore.svg"
                width={160}
                height={52}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const APP_STEPS: { num: number; image: StaticImageData }[] = [
  { num: 1, image: imgStep1 },
  { num: 2, image: imgStep2 },
  { num: 3, image: imgStep3 },
  { num: 4, image: imgStep4 },
  { num: 5, image: imgStep5 },
]

const InAppTab: React.FC = () => {
  const { t } = useTranslation()
  const [showQr, setShowQr] = useState(false)

  const labels = [
    t('pin_change.app_step1', t('forms.card.choose_card')),
    t('pin_change.app_step2', t('cards.select_required_card')),
    t('pin_change.app_step3', t('cards.select_pin_change')),
    t('pin_change.app_step4', t('cards.enter_new_pin')),
    t('pin_change.app_step5', t('cards.pin_changed')),
  ]

  return (
    <>
      <div className={s.stepsTrack}>
        {APP_STEPS.map((step, i) => (
          <React.Fragment key={step.num}>
            {i > 0 && (
              <div className={s.connector}>
                <div className={s.cDot} />
                <div className={s.cLine} />
                <div className={s.cDot} />
              </div>
            )}

            <div className={s.stepItem}>
              <div className={clsx(s.badge, step.num === 5 && s.badgeDone)}>
                {step.num === 5 ? '✓' : step.num}
              </div>

              <PhoneFrame
                image={step.image}
                alt={labels[i]}
                isLast={step.num === 5}
              />

              <p
                className={clsx(s.stepLabel, step.num === 5 && s.stepLabelDone)}
              >
                {labels[i]}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className={s.ctaRow}>
        <button className={s.ctaBtn} onClick={() => setShowQr(true)}>
          {t('pin_change.download_app', t('cards.download_app'))}
        </button>
      </div>

      {showQr && <QrModal onClose={() => setShowQr(false)} />}
    </>
  )
}

const AtmIcon: React.FC<{ type: number }> = ({ type }) => (
  <div className={s.atmIllustration}>
    <div className={s.atmTop}>
      <span>ЭЛДИК БАНК</span>
    </div>

    <div className={s.atmScreen}>
      {type === 1 && <div className={s.cardInsert} />}

      {type === 2 && (
        <div className={s.langBox}>
          <span>Кыргызча</span>
          <b>Русский</b>
          <span>English</span>
        </div>
      )}

      {[3, 5, 6, 7].includes(type) && (
        <div className={s.pinBox}>
          <span>
            {type === 3 && 'Введите ПИН-код'}
            {type === 5 && 'Старый ПИН-код'}
            {type === 6 && 'Новый ПИН-код'}
            {type === 7 && 'Подтвердите ПИН-код'}
          </span>
          <div>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      )}

      {type === 4 && (
        <div className={s.menuBox}>
          <span>Баланс</span>
          <span>Снятие наличных</span>
          <b>Смена ПИН-кода</b>
        </div>
      )}

      {type === 8 && (
        <div className={s.successBox}>
          <div>✓</div>
          <span>ПИН-код установлен</span>
        </div>
      )}
    </div>

    <div className={s.atmKeyboard}>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>

    <div className={s.atmCardSlot} />
  </div>
)

const InAtmTab: React.FC<{ bankomats: Branches[]; regions: Cities[] }> = ({
  bankomats: init,
  regions,
}) => {
  const { t } = useTranslation()
  const { locale } = useRouter()

  const [bankomats, setBankomats] = useState<Branches[]>(init)
  const [activeRegion, setActiveRegion] = useState('9')
  const [detailPoint, setDetail] = useState<ServiceDetailProps | null>(null)
  const [clearMap, setClearMap] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    42.8746, 74.5698,
  ])

  useEffect(() => {
    if (bankomats?.length > 0) {
      setMapCenter([parseFloat(bankomats[0].lat), parseFloat(bankomats[0].lng)])
    }
  }, [bankomats])

  const changeRegion = useCallback(
    async (id: string) => {
      setActiveRegion(id)

      try {
        const res = await ServicePoints.getAllPointsClient(
          locale || 'ru',
          'bankomats',
          { region: id }
        )
        setBankomats(
          Array.isArray(res.data) ? res.data : res.data?.results || []
        )
      } catch (e) {
        console.error(e)
      }
    },
    [locale]
  )

  const getDetail = async (slug: string) => {
    try {
      const { data } = await ServicePoints.getDetailInfo(
        slug,
        'bankomats',
        locale as string
      )
      setDetail(data)
    } catch (e) {
      console.error(e)
    }
  }

  const clear = () => {
    setClearMap(null)
    setDetail(null)
  }

  const steps = [
    t('pin_change.atm_step1', t('cards.insert_card_atm')),
    t('pin_change.atm_step2', t('cards.select_language')),
    t('pin_change.atm_step3', t('cards.enter_card_pin')),
    t('pin_change.atm_step4', t('cards.select_pin_change')),
    t('pin_change.atm_step5', t('cards.enter_old_pin')),
    t('pin_change.atm_step6', t('cards.enter_new_pin')),
    t('pin_change.atm_step7', t('cards.confirm_new_pin')),
    t('pin_change.atm_step8', t('cards.pin_changed')),
  ]

  return (
    <>
      <div className={s.atmCardsGrid}>
        {steps.map((text, i) => (
          <div key={i} className={s.atmCard}>
            <div className={clsx(s.atmBadge, i === 7 && s.atmBadgeSuccess)}>
              {i === 7 ? '✓' : i + 1}
            </div>

            <h3 className={s.atmCardTitle}>{text}</h3>

            <AtmIcon type={i + 1} />
          </div>
        ))}
      </div>

      <div className={s.mapSection}>
        <div className={s.mapHeader}>
          <h3>{t('pin_change.atm_map_title', t('cards.find_nearest_atm'))}</h3>
          <p>{t('pin_change.atm_map_desc', t('cards.find_atm_description'))}</p>
        </div>

        <div className={s.regionRow}>
          {regions?.map((r) => (
            <button
              key={r.id}
              className={clsx(
                s.regionBtn,
                activeRegion === String(r.id) && s.regionBtnActive
              )}
              onClick={() => changeRegion(String(r.id))}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className={s.mapBlock}>
          <MapPoints
            clearPoint={clear}
            clearMap={clearMap}
            getDetailInfo={getDetail}
            setClearMap={setClearMap}
            data={bankomats}
            detailPoint={detailPoint}
            hoveredItemId={null}
            center={mapCenter}
          />
        </div>
      </div>
    </>
  )
}

const InBranchTab: React.FC<{ branches: Branches[]; regions: Cities[] }> = ({
  branches: init,
  regions,
}) => {
  const { t } = useTranslation()
  const { locale } = useRouter()

  const [branches, setBranches] = useState<Branches[]>(init)
  const [activeRegion, setActiveRegion] = useState('9')
  const [detailPoint, setDetail] = useState<ServiceDetailProps | null>(null)
  const [clearMap, setClearMap] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    42.8746, 74.5698,
  ])

  useEffect(() => {
    if (branches?.length > 0) {
      setMapCenter([parseFloat(branches[0].lat), parseFloat(branches[0].lng)])
    }
  }, [branches])

  const changeRegion = useCallback(
    async (id: string) => {
      setActiveRegion(id)

      try {
        const res = await ServicePoints.getAllPointsClient(
          locale || 'ru',
          'branches',
          { region: id }
        )
        setBranches(
          Array.isArray(res.data) ? res.data : res.data?.results || []
        )
      } catch (e) {
        console.error(e)
      }
    },
    [locale]
  )

  const getDetail = async (slug: string) => {
    try {
      const { data } = await ServicePoints.getDetailInfo(
        slug,
        'branches',
        locale as string
      )
      setDetail(data)
    } catch (e) {
      console.error(e)
    }
  }

  const clear = () => {
    setClearMap(null)
    setDetail(null)
  }

  const steps = [
    t('pin_change.branch_step1', t('cards.insert_card_pos')),
    t('pin_change.branch_step2', t('cards.enter_new_pin')),
    t('pin_change.branch_step3', t('cards.confirm_new_pin')),
    t('pin_change.branch_step4', t('cards.pin_changed')),
  ]

  return (
    <div className={s.branchBox}>
      <div className={s.branchMapSide}>
        <div className={s.branchMapHead}>
          <h3>
            {t('pin_change.branch_map_title', t('cards.select_bank_branch'))}
          </h3>
          <p>
            {t(
              'pin_change.branch_map_desc',
              t('cards.bank_branch_description')
            )}
          </p>
        </div>

        <div className={s.regionRow}>
          {regions?.map((r) => (
            <button
              key={r.id}
              className={clsx(
                s.regionBtn,
                activeRegion === String(r.id) && s.regionBtnActive
              )}
              onClick={() => changeRegion(String(r.id))}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className={s.branchMapBlock}>
          <MapPoints
            clearPoint={clear}
            clearMap={clearMap}
            getDetailInfo={getDetail}
            setClearMap={setClearMap}
            data={branches}
            detailPoint={detailPoint}
            hoveredItemId={null}
            center={mapCenter}
          />
        </div>
      </div>

      <div className={s.branchStepsSide}>
        <span className={s.branchSmallTitle}>
          {t('pin_change.branch_label', t('cards.at_bank_branch'))}
        </span>

        <h2>{t('pin_change.branch_title', t('cards.change_pin_in_branch'))}</h2>

        <div className={s.branchSteps}>
          {steps.map((step, index) => (
            <div key={index} className={s.branchStep}>
              <div
                className={clsx(
                  s.branchStepNum,
                  index === steps.length - 1 && s.branchStepNumDone
                )}
              >
                {index === steps.length - 1 ? '✓' : index + 1}
              </div>

              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ChangePinCode: NextPage<ChangePinCodeProps> = ({
  bankomats,
  branches,
  regions,
}) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabId>('app')

  const TABS: { id: TabId; label: string; icon: JSX.Element }[] = [
    {
      id: 'app',
      label: t('pin_change.tab_app', t('cards.in_app')),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="5"
            y="2"
            width="14"
            height="20"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="18"
            x2="12"
            y2="18.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 'atm',
      label: t('pin_change.tab_atm', t('cards.at_atm')),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="2"
            y1="10"
            x2="22"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="6"
            y="13"
            width="4"
            height="3"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      id: 'branch',
      label: t('pin_change.tab_branch', t('cards.at_bank_branch')),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 21h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M5 21V9l7-5 7 5v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 21v-6h6v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ]

  return (
    <>
      <Section className={s.headerSection}>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: t('pin_change.breadcrumb', t('cards.card_pin_change')),
              link: '/cards/change-pin-code',
            }}
          />
        </Container>

        <Container>
          <HeadingWithNav
            title={t('pin_change.heading', t('cards.how_to_change_card_pin'))}
          />
        </Container>
      </Section>

      <Container>
        <div className={s.page}>
          <div className={s.tabBar}>
            {TABS.map((item) => (
              <button
                key={item.id}
                className={clsx(s.tabBtn, tab === item.id && s.tabBtnActive)}
                onClick={() => setTab(item.id)}
              >
                <span className={s.tabIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className={s.tabPane}>
            {tab === 'app' && <InAppTab />}
            {tab === 'atm' && (
              <InAtmTab bankomats={bankomats} regions={regions} />
            )}
            {tab === 'branch' && (
              <InBranchTab branches={branches} regions={regions} />
            )}
          </div>
        </div>
      </Container>
    </>
  )
}

export default ChangePinCode

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const region = query?.region || '9'

  const [bankomatsRes, branchesRes, regRes, tr] = await Promise.all([
    ServicePoints.getAllPoints(locale || 'ru', 'bankomats', {
      region,
      is_paginated: false,
    }),
    ServicePoints.getAllPoints(locale || 'ru', 'branches', {
      region,
      is_paginated: false,
    }),
    ServicePoints.getRegions(locale || 'ru'),
    getTranslations(locale as string),
  ])

  return {
    props: {
      bankomats: bankomatsRes?.data?.results || bankomatsRes?.data || [],
      branches: branchesRes?.data?.results || branchesRes?.data || [],
      regions: regRes?.data || [],
      ...tr,
    },
  }
}
