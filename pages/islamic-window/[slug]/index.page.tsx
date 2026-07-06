import React from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import IslamicConditionsTable from 'components/IslamicWindow/IslamicConditionsTable'
import Section from 'components/Section'
import TabDefault from 'components/Tab'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { IslamicWindowApi } from 'services/api/IslamicWindowApi'
import { IslamicProductDetail } from 'services/api/IslamicWindowModule'
import style from './islamic-detail.module.scss'

interface IslamicWindowDetailProps {
  data: IslamicProductDetail | null
}

const IslamicWindowDetailPage: NextPage<IslamicWindowDetailProps> = ({ data }) => {
  const { t } = useTranslation()

  const hasBanner = !!(data?.banner_image || data?.banner_bg)

  return (
    <>
      <Head>
        <title>{data?.seo_title || data?.name}</title>
        <meta name="description" content={data?.seo_description} key="description" />
        <meta name="keywords" content={data?.seo_keywords} key="keywords" />
        <meta property="og:title" content={data?.og_title || data?.name} key="og:title" />
        <meta property="og:description" content={data?.og_description} key="og:description" />
        <meta property="og:image" content={data?.og_image} key="og:image" />
      </Head>

      <div style={{ overflow: 'hidden' }}>
        {/* Breadcrumbs */}
        <Container>
          <BreadCrumbsCustom
            color={hasBanner ? data?.banner_title_hex || '' : ''}
            absolute={hasBanner}
            currentPage={{
              title: t('pages_names.all_islamic_products'),
              link: '/islamic-window',
            }}
            slug={{
              title: data?.banner_title || data?.name || '',
              link: data?.slug || '',
            }}
          />
        </Container>

        {/* Banner — only when image/bg is set in admin */}
        {hasBanner ? (
          <Section>
            <Banner
              banner_title_hex={data?.banner_title_hex || ''}
              banner_subtitle_hex={data?.banner_subtitle_hex || ''}
              isReques={false}
              link={data?.banner_button_link}
              title={data?.banner_title || data?.name}
              subtitle={data?.banner_subtitle}
              linkText={data?.banner_button_text}
              imagePath={data?.banner_image}
              imagePathMobile={data?.banner_image_mob}
              banner_bg={data?.banner_bg}
              banner_bg_mob={data?.banner_bg_mob}
            />
          </Section>
        ) : (
          /* Fallback green header when no banner */
          <div className={style.greenHeader}>
            <Container>
              <h1 className={style.greenHeaderTitle}>{data?.name}</h1>
              {data?.short_desc && (
                <p className={style.greenHeaderDesc}>{data.short_desc}</p>
              )}
            </Container>
          </div>
        )}

        <Container>
          {/* Main description */}
          {data?.main_desc && (
            <Section>
              <CkEditor title={data?.main_title} caption={data?.main_desc} />
            </Section>
          )}

          {/* Conditions table — the core content */}
          {data?.shorts && data.shorts.length > 0 && (
            <IslamicConditionsTable
              shorts={data.shorts}
              title={t('pages_names.all_islamic_products')}
            />
          )}

          {/* Second description block */}
          {data?.second_desc && (
            <Section>
              <CkEditor title={data.second_title} caption={data.second_desc} />
            </Section>
          )}

          {/* Sections as tabs (detailed conditions, requirements, etc.) */}
          {data?.sections && data.sections.length > 0 && (
            <>
              <HeadingWithNav title={data.sections_title} />
              <TabDefault tabs={data.sections} accardion={[]} />
            </>
          )}
        </Container>
      </div>
    </>
  )
}

export default IslamicWindowDetailPage

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const lang = locale || 'ru'
  const { data } = await IslamicWindowApi.getProductDetail(query?.slug as string, lang)
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}
