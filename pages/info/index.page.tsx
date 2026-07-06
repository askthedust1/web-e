import Container from 'components/Container'
import TabInfo from './components/TabInfo/TabInfo'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { InfoApi } from 'services/api/InfoApi'
import { TotalData } from 'services/api/InfoApiModule'
import { useRouter } from 'next/router'
import { OtherPageApi } from 'services/api/OtherApi'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { IVacancies } from 'services/api/OtherApimodule'

const getTranslatedCorporateGovernanceData = (
  t: (key: string) => string
): any => {
  return {
    seo_title: t('corporateGovernance.seo.title'),
    seo_description: t('corporateGovernance.seo.description'),
    og_title: t('corporateGovernance.og.title'),
    og_description: t('corporateGovernance.og.description'),
    og_image: '/images/og-corp.jpg',
    title: t('corporateGovernance.title'),
    hero_description: t('corporateGovernance.hero.description'),
    blocks: [
      {
        type: 'principles',
        title: t('corporateGovernance.principles.title'),
        principles: [
          {
            id: 1,
            title: t('corporateGovernance.principles.items.0.title'),
            description: t(
              'corporateGovernance.principles.items.0.description'
            ),
            icon: 'transparency',
          },
          {
            id: 2,
            title: t('corporateGovernance.principles.items.1.title'),
            description: t(
              'corporateGovernance.principles.items.1.description'
            ),
            icon: 'responsibility',
          },
          {
            id: 3,
            title: t('corporateGovernance.principles.items.2.title'),
            description: t(
              'corporateGovernance.principles.items.2.description'
            ),
            icon: 'control',
          },
          {
            id: 4,
            title: t('corporateGovernance.principles.items.3.title'),
            description: t(
              'corporateGovernance.principles.items.3.description'
            ),
            icon: 'ethics',
          },
          {
            id: 5,
            title: t('corporateGovernance.principles.items.4.title'),
            description: t(
              'corporateGovernance.principles.items.4.description'
            ),
            icon: 'esg',
          },
          {
            id: 6,
            title: t('corporateGovernance.principles.items.5.title'),
            description: t(
              'corporateGovernance.principles.items.5.description'
            ),
            icon: 'protection',
          },
        ],
      },
      {
        type: 'board_of_directors',
        title: t('corporateGovernance.board.title'),
        description: t('corporateGovernance.board.description'),
        functions: [
          t('corporateGovernance.board.functions.0'),
          t('corporateGovernance.board.functions.1'),
          t('corporateGovernance.board.functions.2'),
          t('corporateGovernance.board.functions.3'),
          t('corporateGovernance.board.functions.4'),
          t('corporateGovernance.board.functions.5'),
          t('corporateGovernance.board.functions.6'),
        ],
        link: '/info?page=1&type=administration_page',
        link_text: t('corporateGovernance.board.linkText'),
      },
      {
        type: 'committees',
        title: t('corporateGovernance.committees.title'),
        description: t('corporateGovernance.committees.description'),
        committees: [
          {
            id: 1,
            type: 'audit',
            title: t('corporateGovernance.committees.items.0.title'),
            description: t(
              'corporateGovernance.committees.items.0.description'
            ),
          },
          {
            id: 2,
            type: 'risk',
            title: t('corporateGovernance.committees.items.1.title'),
            description: t(
              'corporateGovernance.committees.items.1.description'
            ),
          },
          {
            id: 4,
            type: 'nomination',
            title: t('corporateGovernance.committees.items.3.title'),
            description: t(
              'corporateGovernance.committees.items.3.description'
            ),
          },
          {
            id: 5,
            type: 'sustainability',
            title: t('corporateGovernance.committees.items.4.title'),
            description: t(
              'corporateGovernance.committees.items.4.description'
            ),
          },
        ],
      },
      {
        type: 'management_board',
        title: t('corporateGovernance.management.title'),
        description: t('corporateGovernance.management.description'),
        responsibilities: [
          t('corporateGovernance.management.responsibilities.0'),
          t('corporateGovernance.management.responsibilities.1'),
          t('corporateGovernance.management.responsibilities.2'),
          t('corporateGovernance.management.responsibilities.3'),
          t('corporateGovernance.management.responsibilities.4'),
          t('corporateGovernance.management.responsibilities.5'),
        ],
        link: '/info?page=1&type=administration_page',
        link_text: t('corporateGovernance.management.linkText'),
      },
      {
        type: 'corporate_secretary',
        title: t('corporateGovernance.secretary.title'),
        description: t('corporateGovernance.secretary.description'),
      },
      {
        type: 'esg',
        title: t('corporateGovernance.esg.title'),
        description: t('corporateGovernance.esg.description'),
        approaches: [
          t('corporateGovernance.esg.approaches.0'),
          t('corporateGovernance.esg.approaches.1'),
          t('corporateGovernance.esg.approaches.2'),
          t('corporateGovernance.esg.approaches.3'),
        ],
        documents: [
          {
            title: t('corporateGovernance.esg.documents.0.title'),
            file: '/files/Кодекс_деловой_этики_ОАО_Элдик_Банк.pdf',
            type: 'pdf',
          },
        ],
        link: '/sustainable-development',
        link_text: t('corporateGovernance.esg.linkText'),
      },
      {
        type: 'sharia_management',
        title: t('corporateGovernance.sharia.title'),
        description: t('corporateGovernance.sharia.description'),
        elements: [
          t('corporateGovernance.sharia.elements.0'),
          t('corporateGovernance.sharia.elements.1'),
          t('corporateGovernance.sharia.elements.2'),
          t('corporateGovernance.sharia.elements.3'),
        ],
        link: '/ru/info?page=1&type=administration_page',
        link_text: t('corporateGovernance.sharia.linkText'),
      },
      {
        type: 'documents',
        title: t('corporateGovernance.documents.title'),
        documents: [
          {
            title: t('corporateGovernance.documents.items.0.title'),
            file: '/files/Кодекс_Корпоративного_управления.pdf',
            type: 'pdf',
            size: '1.8 MB',
          },
          {
            title: t('corporateGovernance.documents.items.1.title'),
            file: '/files/CERTIFICATION_REGARDING_CORRESPONDENT_ACCOUNTS_FOR_FOREIGN_BANKS_2.pdf',
            type: 'pdf',
            size: '1.89 MB',
          },
        ],
      },
      {
        type: 'transparency',
        title: t('corporateGovernance.transparency.title'),
        description: t('corporateGovernance.transparency.description'),
      },
    ],
  }
}

const ListDataFetcers: any = {
  about_page: {
    fetcher: InfoApi.getPageParams,
  },
  corporate_governance: {
    fetcher: async (locale: string) => {
      const translations = await import(`public/locales/${locale}/common.json`)

      const t = (key: string) => {
        const keys = key.split('.')
        let value: any = translations.default || {}

        for (const k of keys) {
          value = value?.[k]
          if (value === undefined) return key
        }
        return value || key
      }

      return {
        data: getTranslatedCorporateGovernanceData(t),
      }
    },
  },
  administration_page: {
    fetcher: InfoApi.getPageParams,
  },
  correspond_net_page: {
    fetcher: InfoApi.getPageParams,
  },
  requisites_page: {
    fetcher: InfoApi.getPageParams,
  },
  press_page: {
    fetcher: InfoApi.getPageParams,
  },
  contacts_page: {
    fetcher: InfoApi.getPageParams,
  },
}

interface Props {
  allData: TotalData
  region: {
    name: string
    id: number | string
  }[]
  department: {
    id: number
    name: string
    slug: string
  }[]
  vacancies: IVacancies
}

const Info: NextPage<Props> = ({ allData, region, department, vacancies }) => {
  const tabInfo = []
  for (const key in ListDataFetcers) {
    tabInfo.push({
      type: key,
    })
  }

  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      {[allData]?.map((item, index) => (
        <Head key={index}>
          <title>{item?.seo_title || 'РСК БАНК'}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            property="og:title"
            content={item?.og_title || 'РСК БАНК'}
            key="og:title"
          />
          <meta
            property="og:image"
            content={item?.og_image || '/'}
            key="og:image"
          />
          <meta
            property="og:description"
            content={item?.og_description || 'РСК БАНК'}
            key="og:description"
          />
          <meta
            name="description"
            content={item?.seo_description || 'РСК БАНК'}
            key="description"
          />
          <meta
            name="keywords"
            content={item?.seo_keywords || 'РСК БАНК'}
            key="keywords"
          />
        </Head>
      ))}

      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: router.query.type
              ? t(`info_page.${router.query.type}`)
              : t(`info_page.about_page`),
            link: router.query.type
              ? `info?type=${router.query.type}`
              : '/info?type=about_page',
          }}
        />
      </Container>
      <TabInfo
        allData={[allData]}
        labels={tabInfo}
        regions={region}
        department={department}
        vacancies={vacancies}
      />
    </>
  )
}

export default Info

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const getRouteOfPage = query?.type?.length
    ? ListDataFetcers[(query.type as string) || 'about_page']
    : ListDataFetcers['about_page']

  const page = (query.page || '1') as string
  const page_size = '9'

  const queryParams = new URLSearchParams({
    page,
    page_size,
  }).toString()

  let allData

  if (query?.type === 'corporate_governance') {
    allData = (await getRouteOfPage?.fetcher(locale || 'ru'))?.data || {}
  } else if (query?.type?.includes('vacancies-list')) {
    allData =
      (
        await InfoApi.getPage(
          'vacancies',
          locale || 'ru',
          query?.region ? String(query?.region) : '',
          query?.city ? String(query?.city) : '',
          query?.department ? String(query?.department) : '',
          queryParams
        )
      )?.data || {}
  } else {
    allData =
      (
        await getRouteOfPage?.fetcher(
          query?.type || 'about_page',
          locale || 'ru',
          query.region ? String(query.region) : null,
          query.city ? String(query.city) : null,
          query.department ? String(query.department) : null,
          {
            page,
            page_size,
          }
        )
      )?.data || {}
  }

  const region = (await OtherPageApi?.getRegions(locale || 'ru'))?.data
  const department = (await OtherPageApi?.getDepartments(locale || 'ru'))?.data
  const vacancies = query?.type?.includes('vacancies')
    ? (await OtherPageApi?.getHrStuff(locale || 'ru'))?.data
    : {}

  return {
    props: {
      region,
      allData,
      department,
      vacancies,
      ...(await getTranslations(locale as string)),
    },
  }
}
