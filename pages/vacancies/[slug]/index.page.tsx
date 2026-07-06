import { useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getTranslations } from 'helpers/serverTranslations'
import s from './vacancies.module.scss'
import { InfoApi } from 'services/api/InfoApi'
import { VacanciesDeteilProps } from 'services/api/InfoApiModule'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'
import VacanciesBanner from 'pages/vacancies/components/vacanciesBanner'
import FormJob from 'components/ui/FormJob'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
import { toPublicUrl } from 'helpers/toPublicUrl'

interface Props {
  data: VacanciesDeteilProps
}

const VacanciesDetail: NextPage<Props> = ({ data }) => {
  const formRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { locale } = useRouter()

  const canonicalUrl = getCanonicalUrl(locale || 'ru', `/vacancies/${data?.slug}`)
  const ogImage = toPublicUrl(data?.og_image || data?.image) || 'https://eldik.kg/images/og-default.png'
  const ogLocale = locale === 'ky' ? 'ky_KG' : locale === 'en' ? 'en_US' : 'ru_RU'
  const ogTitle = data?.og_title || data?.seo_title || data?.title

  const stripHtml = (s?: string) => (s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const truncate = (s: string, n = 200) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)
  const composedFromBody = [
    ...(data?.responsibilities?.map((i) => i.text) || []),
    ...(data?.requirements?.map((i) => i.text) || []),
    ...(data?.offers?.map((i) => i.title) || []),
  ]
    .map(stripHtml)
    .filter(Boolean)
    .slice(0, 4)
    .join('. ')
  const fallbackDescription = stripHtml(data?.desc) || composedFromBody
  const ogDescription = truncate(data?.og_description || data?.seo_description || fallbackDescription)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const jobPostingSchema = data
    ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: data.title,
        description: data.desc,
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          '@type': 'Organization',
          name: 'Элдик Банк',
          sameAs: 'https://eldik.kg',
          logo: 'https://eldik.kg/images/Logo.png',
        },
        jobLocation: data.branches?.map((branch) => ({
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: branch.address,
            addressLocality: 'Бишкек',
            addressCountry: 'KG',
          },
        })),
        ...(data.department?.name && {
          occupationalCategory: data.department.name,
        }),
      }
    : null

  return (
    <div className={s.vacancies}>
      {jobPostingSchema && (
        <Head>
          <title>{data?.seo_title || `${data?.title} — Элдик Банк`}</title>
          <meta name="description" content={data?.seo_description || ogDescription} key="description" />
          <meta name="keywords" content={data?.seo_keywords || ''} key="keywords" />
          <link rel="canonical" href={canonicalUrl} />

          <meta property="og:type" content="article" key="og:type" />
          <meta property="og:site_name" content="Элдик Банк" key="og:site_name" />
          <meta property="og:locale" content={ogLocale} key="og:locale" />
          <meta property="og:url" content={canonicalUrl} key="og:url" />
          <meta property="og:title" content={ogTitle} key="og:title" />
          <meta property="og:description" content={ogDescription} key="og:description" />
          <meta property="og:image" content={ogImage} key="og:image" />

          <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
          <meta name="twitter:title" content={ogTitle} key="twitter:title" />
          <meta name="twitter:description" content={ogDescription} key="twitter:description" />
          <meta name="twitter:image" content={ogImage} key="twitter:image" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
          />
        </Head>
      )}
      <VacanciesBanner
        width={500}
        height={500}
        objectFitProp="cover"
        gradientText={data?.title}
        imgUrl={data?.icon?.url}
        location={data?.branches}
        department={data?.department?.name}
        experience={data?.experience?.label}
        fontSize="55px"
        isDetail
        onApplyClick={scrollToForm}
      />

      <VacanciesNav />

      <div className={s.wrapper}>
        <div className={s.vacancyDetail}>
          <div style={{ marginBottom: '30px' }}>
            <p className={s.txt}>{t('invite_title')}: {data?.title}</p>
          </div>
          {data?.offers?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <p className={s.detailTx}>{t('we_offer')}:</p>
              <ul>
                {data.offers.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          )}

          {data?.responsibilities?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <p className={s.detailTx}>{t('responsibilities')}:</p>
              <ul>
                {data.responsibilities.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>
          )}

          {data?.requirements?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <p className={s.detailTx}>{t('requirements')}:</p>
              <ul>
                {data.requirements.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>
          )}

          {data?.conditions?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <p className={s.detailTx}>{t('conditions')}:</p>
              <ul>
                {data.conditions.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>
          )}

          <div ref={formRef}>
            <FormJob vacancyId={data?.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VacanciesDetail

export const getServerSideProps: GetServerSideProps<Props> = async ({
                                                                      locale,
                                                                      query,
                                                                    }) => {
  const { data } = await InfoApi.getVacancyDeteil(query?.slug as string, locale || 'ru')

  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
