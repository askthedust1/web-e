import { useMemo } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Layout from 'components/Layout'
import { appWithTranslation } from 'next-i18next'
import Router, { useRouter } from 'next/router'
import nProgress from 'nprogress'
import Head from 'next/head'
import RskModal from 'components/RskModal'
import { SEOProps } from 'services/api/MainModule'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.scss'
import '../styles/nprogress.scss'

const ChatwootWidget = dynamic(
  () => import('components/ChatwootWidget/ChatwootWidget'),
  { ssr: false }
)

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

function MyApp({ Component, pageProps }: AppProps) {
  const router: any = useRouter()
  const { pathname } = router

  if (router.pathname === '/404' || router.pathname === '/rsk-printer') {
    return <Component {...pageProps} />
  }

  const pagePropsArray = Object.values(pageProps)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const currentPage: any = useMemo(
    () => pagePropsArray?.find((item: any) => item?.seo_title),
    [router.asPath, pagePropsArray]
  )

  const SEOData: SEOProps = {
    seo_title: currentPage?.seo_title,
    seo_description: currentPage?.seo_description,
    seo_keywords: currentPage?.seo_keywords,
    og_title: currentPage?.og_title,
    og_image: currentPage?.og_image,
    og_description: currentPage?.og_description,
  }

  return (
    <>
      <Head>
        <title>{SEOData?.seo_title || 'Элдик Банк'}</title>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={SEOData?.seo_description || ''} key="description" />
        <meta
          name="keywords"
          content={
            SEOData?.seo_keywords ||
            'элдик, ЭЛДИК, рск, РСК, банк, Кыргызстан, visa, депозиты, кредиты, счета, сейфовые ячейки, платежные карты, денежные переводы'
          }
          key="keywords"
        />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:site_name" content="Элдик Банк" key="og:site_name" />
        <meta
          property="og:title"
          content={SEOData?.og_title || SEOData?.seo_title || 'Элдик Банк'}
          key="og:title"
        />
        <meta
          property="og:description"
          content={SEOData?.og_description || ''}
          key="og:description"
        />
        <meta
          property="og:image"
          content={
            SEOData?.og_image || 'https://eldik.kg/images/og-default.png'
          }
          key="og:image"
        />
      </Head>
      <RskModal />
      <ToastContainer />
      <ChatwootWidget />
      {pathname?.includes('expert-assessment') ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  )
}

export default appWithTranslation(MyApp)
