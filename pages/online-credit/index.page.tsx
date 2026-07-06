import React from 'react'
import { GetServerSideProps } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import s from './onlineCredit.module.scss'
import { appStoreUrl, googlePlayUrl } from '../../helpers/openDeepLink'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'

const OnlineCreditPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('qr_seo_title')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={t('qr_seo_title')} key="og:title" />
        <meta
          property="og:image"
          content="/images/qr-code/eldikLogo.png"
          key="og:image"
        />
        <meta
          property="og:description"
          content={t('qr_seo_description')}
          key="og:description"
        />
        <meta
          name="description"
          content={t('qr_seo_description')}
          key="description"
        />
        <meta name="keywords" content={t('qr_seo_keywords')} key="keywords" />
      </Head>
      <Container>
        <div className={s.creditContainer}>
          <p>{t('qr1')}</p>
          <div className={s.qrDownload}>
            <AppImage
              alt="eldikLogo"
              src="/images/qr-code/eldikLogo.png"
              width={80}
              height={80}
            />
            <p className={s.qrText}>{t('qr2')}</p>
          </div>
          <div className={s.qrWrapper}>
            <div className={s.qrItem}>
              <AppImage
                alt="EldikPlayMarket"
                src="/images/qr-code/EldikPlayMarket.png"
                width={250}
                height={250}
              />
              <a
                href={googlePlayUrl}
                target="_blank"
                rel="noreferrer"
                className={s.app__link}
              >
                {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
                <img
                  alt="google"
                  src="/images/mobile-app/google.svg"
                  width={130}
                  height={43}
                />
              </a>
            </div>
            <div className={s.qrItem}>
              <AppImage
                alt="EldikAppStore"
                src="/images/qr-code/EldikAppStore.png"
                width={250}
                height={250}
              />
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noreferrer"
                className={s.app__link}
              >
                {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
                <img
                  alt="appstore"
                  src="/images/mobile-app/appstore.svg"
                  width={130}
                  height={43}
                />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default OnlineCreditPage

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getTranslations(locale as string as string)),
    },
  }
}
