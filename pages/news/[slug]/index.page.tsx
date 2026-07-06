import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import React from 'react'
import clsx from 'clsx'
import CarouselNewsPromotions from 'components/Carousels/CarouselNewsPromotions'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { NewsListDetail } from 'services/api/NewsApi.models'
import { NewsApi } from 'services/api/NewsApi'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useMediaQuery } from 'react-responsive'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
import { toPublicUrl } from 'helpers/toPublicUrl'
import CkEditor from 'components/CkEditor'
import s from '../news.module.scss'
import { CbkBannerDefault } from 'components/Sliders/SliderDefault'
interface Props {
  data: NewsListDetail
}
const NewsDeteil: NextPage<Props> = ({ data }) => {
  const timeFormat = data
    ? format(new Date(data.published_at), 'dd MMMM y', {
        locale: ru,
      })
    : null
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { t } = useTranslation()
  const { locale } = useRouter()

  const canonicalUrl = getCanonicalUrl(locale || 'ru', `/news/${data?.slug}`)
  const ogImage = toPublicUrl(data?.og_image || data?.image)
  const ogLocale =
    locale === 'ky' ? 'ky_KG' : locale === 'en' ? 'en_US' : 'ru_RU'

  const stripHtml = (s?: string) =>
    (s || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  const truncate = (s: string, n = 200) =>
    s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s
  const ogTitle = data?.og_title || data?.seo_title || data?.title
  const ogDescription = truncate(
    data?.og_description ||
      data?.seo_description ||
      stripHtml(data?.short_desc) ||
      stripHtml(data?.desc)
  )

  const articleSchema = data
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: data.title,
        image: ogImage,
        datePublished: data.published_at,
        dateModified: data.published_at,
        description: ogDescription,
        url: canonicalUrl,
        author: {
          '@type': 'Organization',
          name: 'Элдик Банк',
          url: 'https://eldik.kg',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Элдик Банк',
          logo: {
            '@type': 'ImageObject',
            url: 'https://eldik.kg/images/Logo.png',
          },
        },
      }
    : null

  return (
    <>
      <Head>
        <title>{data?.seo_title || data?.title}</title>
        <meta name="description" content={ogDescription} key="description" />
        <meta name="keywords" content={data?.seo_keywords} key="keywords" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" key="og:type" />
        <meta property="og:site_name" content="Элдик Банк" key="og:site_name" />
        <meta property="og:locale" content={ogLocale} key="og:locale" />
        <meta property="og:url" content={canonicalUrl} key="og:url" />
        <meta property="og:title" content={ogTitle} key="og:title" />
        <meta
          property="og:description"
          content={ogDescription}
          key="og:description"
        />
        <meta property="og:image" content={ogImage} key="og:image" />

        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta name="twitter:title" content={ogTitle} key="twitter:title" />
        <meta
          name="twitter:description"
          content={ogDescription}
          key="twitter:description"
        />
        <meta name="twitter:image" content={ogImage} key="twitter:image" />

        {articleSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
        )}
      </Head>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('titles_for_block.news'),
            link: '/news',
          }}
          slug={{
            title: data?.title,
            link: data?.slug,
          }}
        />
        <div className={s.newsWrapper}>
          <div className={clsx(s.date, 'light-14')}>{timeFormat}</div>
          <h1 className={clsx(s.title, 'medium-40')}>{data?.title}</h1>
          <AppImage
            alt={data?.title}
            src={data?.image || '/'}
            className={s.imgWrapper}
            height={!isMobile ? 460 : 250}
            width={!isMobile ? 1000 : 380}
            sizes="(max-width: 640px) 100vw, 1000px"
          />
          <div className={clsx(s.subtitle, 'regular-20')}>
            <CkEditor description={data?.desc} />
          </div>

          <div className={clsx(s.cuption, 'light-18')}>
            <CkEditor description={data?.short_desc} />
          </div>
        </div>
        <div className={s.banner}>
          <CbkBannerDefault banners={data?.extra_images} />
        </div>
        <CarouselNewsPromotions
          pathname="/news"
          data={data?.other_news}
          title={t('titles_for_block.news')}
        />
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  locale,
}) => {
  const lang: any = locale
  const { data } = await NewsApi.getNewsDeteil(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}

export default NewsDeteil
