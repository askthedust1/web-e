import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import CarouselCardMain from 'components/Carousels/CarouselCardMain'
import MobileBankingExchangeRates from 'components/MobileBankingExchangeRates'
import CarouselsCardThird from 'components/Carousels/CarouselsCardThird'
import ForClients from 'components/ForClients'
import CardPayment from 'components/Cards/CardPayment'
import CarouselNewsPromotions from 'components/Carousels/CarouselNewsPromotions'
import { MainApi } from 'services/api/MainApi'
import { MainPage } from 'services/api/MainModule'
import HomeSlider from 'components/Sliders/HomeSlider'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
import { useRouter } from 'next/router'

interface HomeProps {
  data: MainPage
}

const OG_IMAGE_DEFAULT = 'https://eldik.kg/images/og-default.png'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'BankOrFinancialService',
  name: 'Элдик Банк',
  alternateName: 'Eldik Bank',
  url: 'https://eldik.kg',
  logo: 'https://eldik.kg/images/Logo.png',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KG',
    addressLocality: 'Бишкек',
    addressRegion: 'Чуйская область',
    streetAddress: 'ул. Московская 80',
    postalCode: '720010',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+996-312-911111',
    contactType: 'customer service',
    areaServed: 'KG',
    availableLanguage: ['Russian', 'Kyrgyz', 'English'],
  },
  sameAs: [
    'https://www.facebook.com/eldikbank',
    'https://www.instagram.com/eldikbank',
    'https://www.youtube.com/@Eldikbank',
    'https://t.me/eldikbank',
  ],
}

const Home: NextPage<HomeProps> = ({ data }: HomeProps) => {
  const page = data?.page
  const { t } = useTranslation()
  const { locale } = useRouter()

  return (
    <div>
      <Head>
        <title>{data?.page?.seo_title || t('seo.home_title')}</title>
        <meta name="description" content={data?.page?.seo_description || t('seo.home_description')} key="description" />
        <meta name="keywords" content={data?.page?.seo_keywords} key="keywords" />
        <meta property="og:title" content={data?.page?.og_title || data?.page?.seo_title} key="og:title" />
        <meta property="og:description" content={data?.page?.og_description || data?.page?.seo_description} key="og:description" />
        <meta property="og:image" content={data?.page?.og_image || OG_IMAGE_DEFAULT} key="og:image" />
        <meta property="og:image:width" content="1200" key="og:image:width" />
        <meta property="og:image:height" content="630" key="og:image:height" />
        <link rel="canonical" href={getCanonicalUrl(locale || 'ru', '/')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </Head>
      <h1 className="visually-hidden">
        {t('homepage_h1')}
      </h1>
      <HomeSlider data={page?.banners} />
      <CarouselCardMain
        title={page?.suggest_title}
        data={page?.actual_suggests}
        buttonText={t('setting.button_more')}
      />
      <MobileBankingExchangeRates
        data={page?.app_banner}
        exchange={data?.exchange}
      />
      <CarouselsCardThird
        title={page?.services_title}
        data={page?.online_services}
      />
      <ForClients title={page?.clients_title} data={page?.for_clients} />
      <CardPayment data={page?.card_banner} />
      <CarouselNewsPromotions
        pathname="/news"
        data={data?.news?.slice(0, 4)}
        title={t('titles_for_block.news')}
      />
    </div>
  )
}
export default Home
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await MainApi.getMainPage(locale || 'ru', typeOfUser)

  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
