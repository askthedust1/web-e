import React from 'react'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Container from 'components/Container'
import Heading from 'components/Heading/Heading'
import IslamicProductCard from 'components/IslamicWindow/IslamicProductCard'
import IslamicWindowBranches from 'components/IslamicWindow/IslamicWindowBranches'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import { getTranslations } from 'helpers/serverTranslations'
import { IslamicWindowApi } from 'services/api/IslamicWindowApi'
import {
  IslamicProductList,
  IslamicWindowBranchesResponse,
  IslamicWindowPage,
} from 'services/api/IslamicWindowModule'
import style from './islamic-window.module.scss'
import { useRouter } from 'next/router'

interface IslamicWindowPageProps {
  page: IslamicWindowPage | null
  products: IslamicProductList | null
  branches: IslamicWindowBranchesResponse | null
}

const IslamicWindowListPage: NextPage<IslamicWindowPageProps> = ({
  page,
  products,
  branches,
}) => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  const title = page?.main_title || t('pages_names.all_islamic_products')

  resetIdCounter()

  const fatwaFile =
    locale === 'ru'
      ? 'eldik_murabaha_fatwa_rus.pdf'
      : 'eldik_murabaha_fatwa_kg.pdf'
  const fatwaSrc = `/files/${fatwaFile}`

  return (
    <>
      <Head>
        <title>{page?.seo_title || title}</title>
        <meta
          name="description"
          content={page?.seo_description}
          key="description"
        />
        <meta name="keywords" content={page?.seo_keywords} key="keywords" />
        <meta
          property="og:title"
          content={page?.og_title || title}
          key="og:title"
        />
        <meta
          property="og:description"
          content={page?.og_description}
          key="og:description"
        />
      </Head>

      <div className={style.page}>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title,
              link: '/islamic-window',
            }}
          />
        </Container>

        <Container>
          <Heading title={title} />
        </Container>

        <Container>
          <Tabs>
            <TabList>
              <Tab className="react-tabs__tab light-16">
                {t('islamic_addresses.tab_products')}
              </Tab>
              <Tab className="react-tabs__tab light-16">
                {t('islamic_addresses.tab_addresses')}
              </Tab>
              <Tab className="react-tabs__tab light-16">
                {t('islamic_addresses.tab_fatwa')}
              </Tab>
            </TabList>

            <TabPanel>
              <div className={style.list}>
                {products?.results?.map((item) => (
                  <IslamicProductCard
                    key={item.id}
                    name={item.name}
                    short_desc={item.short_desc}
                    slug={item.slug}
                    shorts={item.shorts}
                  />
                ))}
              </div>
            </TabPanel>

            <TabPanel>
              <IslamicWindowBranches data={branches} />
            </TabPanel>

            <TabPanel>
              <div className={style.fatwa}>
                <object
                  data={fatwaSrc}
                  type="application/pdf"
                  width="100%"
                  height="800"
                >
                  <p>
                    {t(
                      'islamic_addresses.pdf_not_supported',
                      'Ваш браузер не поддерживает просмотр PDF.'
                    )}{' '}
                    <a
                      href={fatwaSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('islamic_addresses.download_fatwa', 'Скачать файл')}
                    </a>
                  </p>
                </object>
              </div>
            </TabPanel>
          </Tabs>
        </Container>
      </div>
    </>
  )
}

export default IslamicWindowListPage

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lang = locale || 'ru'
  const [pageRes, productsRes, branchesRes] = await Promise.all([
    IslamicWindowApi.getPage(lang),
    IslamicWindowApi.getProductsList(lang),
    IslamicWindowApi.getBranches(lang),
  ])
  return {
    props: {
      page: pageRes.data,
      products: productsRes.data,
      branches: branchesRes.data,
      ...(await getTranslations(lang)),
    },
  }
}
