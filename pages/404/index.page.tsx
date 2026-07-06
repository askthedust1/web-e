import Button from 'components/Buttons/Button'
import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import { useEffect, useState } from 'react'
import style from './error404.module.scss'
import Error from '/public/images/404/404.png'
import Head from 'next/head'
import { useRouter } from 'next/router'
import flatIcon from 'public/images/Logo.png'

const KyLang = {
  title: 'Бет табылган жок',
  subtitle: 'Дареги туура эмес алынды, же сайтта андай бет жок',
  button_text: 'Башкы бет',
}
const RuLang = {
  title: 'Страница не найдена',
  subtitle:
    'Неправильно набран адрес, или такой страницы на сайте больше не существует.',
  button_text: 'Главная страница',
}
const EnLang = {
  title: 'Page not found',
  subtitle: 'Wrong address or this page is not available anymore',
  button_text: 'Homepage',
}

interface Props {
  title: string
  subtitle: string
  button_text: string
}

const Error404 = () => {
  const router = useRouter()
  const { locale } = router
  const [lang, setLang] = useState<Props>(RuLang)

  useEffect(() => {
    switch (locale) {
      case 'ru':
        setLang(RuLang)
        break
      case 'en':
        setLang(EnLang)
        break
      case 'ky':
        setLang(KyLang)
        break
    }
  }, [locale])

  return (
    <>
      <Head>
        <title>{'Элдик Банк Кыргызстан'}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={flatIcon.src} />
        <meta
          property="og:title"
          content={'Элдик Банк Кыргызстан'}
          key="og:title"
        />
        <meta
          property="og:site_name"
          content="Элдик Банк Кыргызстан"
          key="og:site_name"
        />
        <meta
          name="keywords"
          content={
            'Элдик, ЭЛДИК, рск, РСК,  банк, кырыгызстан, visa, депозиты, кредиты, счета, сейфовые ячейки, платежные карты, денежные переводы'
          }
          key="keywords"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" key="og:type" />
        <meta
          property="og:description"
          content="Сайт Элдик Банк Кыргызстан"
          key="og:description"
        />
      </Head>
      <Container>
        <div className={style.wrapper}>
          <AppImage
            className={style.image}
            src={Error.src}
            height={200}
            width={200}
            alt="404"
          />
          <div className={style.code}>404</div>
          <p className={style.title}>{lang?.title}</p>
          <p className={style.subtitle}>{lang?.subtitle}</p>
          <Button
            className={style.button}
            href="/"
            isOutline
            value={lang?.button_text}
          />
        </div>
      </Container>
    </>
  )
}

export default Error404
