import Button from 'components/Buttons/Button'
import Container from 'components/Container'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import flatIcon from 'public/images/Logo.png'
import logo from 'public/images/LogoName.png'
import style from './error.module.scss'

type SupportedLocale = 'ky' | 'ru' | 'en'

interface Error505Props {
  statusCode?: number
}

const CONTENT: Record<
  SupportedLocale,
  {
    eyebrow: string
    title: string
    description: string
    primary: string
    secondary: string
    support: string
  }
> = {
  ky: {
    eyebrow: 'Убактылуу техникалык мүчүлүштүк',
    title: 'Барак убактылуу жеткиликсиз болуп турат',
    description:
      'Биз көйгөйдү каттап алдык жана сервистин ишин калыбына келтирип жатабыз. Бир аздан кийин кайра аракет кылып көрүңүз.',
    primary: 'Башкы бетке өтүү',
    secondary: 'Кайра жүктөө',
    support: 'Шашылыш маселе болсо, Банктын байланыш борборуна кайрылыңыз.',
  },
  ru: {
    eyebrow: 'Временный технический сбой',
    title: 'Страница сейчас недоступна',
    description:
      'Мы уже зафиксировали проблему и восстанавливаем работу сервиса. Попробуйте обновить страницу чуть позже.',
    primary: 'Перейти на главную',
    secondary: 'Обновить страницу',
    support: 'Если вопрос срочный, свяжитесь с контакт-центром Банка.',
  },
  en: {
    eyebrow: 'Temporary technical issue',
    title: 'This page is temporarily unavailable',
    description:
      'We have already detected the issue and are restoring the service. Please try refreshing the page again a bit later.',
    primary: 'Go to homepage',
    secondary: 'Refresh page',
    support: 'If the issue is urgent, please contact the Bank support team.',
  },
}

const Error505 = ({ statusCode = 500 }: Error505Props) => {
  const router = useRouter()
  const locale = (router.locale || router.defaultLocale || 'ky') as SupportedLocale
  const content = CONTENT[locale] || CONTENT.ky

  return (
    <>
      <Head>
        <title>{`${statusCode} | Элдик Банк`}</title>
        <meta property="og:title" content="Элдик Банк" key="og:title" />
        <link rel="icon" type="image/png" sizes="32x32" href={flatIcon.src} />
        <meta property="og:site_name" content="Элдик Банк" key="og:site_name" />
        <meta
          name="keywords"
          content="банк, Кыргызстан, visa, депозиты, кредиты, счета, сейфовые ячейки, платежные карты, денежные переводы"
          key="keywords"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:description" content="Элдик Банк" key="og:description" />
      </Head>
      <section className={style.section}>
        <div className={style.bgGlowTop} aria-hidden="true" />
        <div className={style.bgGlowBottom} aria-hidden="true" />
        <Container>
          <div className={style.card}>
            <div className={style.content}>
              <div className={style.brand}>
                <Image src={logo} alt="Eldik Bank" width={148} height={54} priority />
              </div>
              <p className={`${style.eyebrow} default-12`}>{content.eyebrow}</p>
              <div className={style.codeWrap}>
                <span className={style.codeShadow} aria-hidden="true">
                  {statusCode}
                </span>
                <span className={style.code}>{statusCode}</span>
              </div>
              <h1 className={`${style.title} medium-40`}>{content.title}</h1>
              <p className={`${style.subtitle} light-18`}>{content.description}</p>
              <div className={style.actions}>
                <Button
                  className={style.primaryButton}
                  href="/"
                  isBlue
                  value={content.primary}
                />
                <Button
                  className={style.secondaryButton}
                  isOutline
                  value={content.secondary}
                  onClick={() => router.reload()}
                />
              </div>
              <p className={`${style.support} regular-15`}>{content.support}</p>
            </div>
            <div className={style.aside} aria-hidden="true">
              <div className={style.ringLarge} />
              <div className={style.ringSmall} />
              <div className={style.signalCard}>
                <span className={style.signalLabel}>eldik.kg</span>
                <span className={style.signalStatus}>500</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default Error505
