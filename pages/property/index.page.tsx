import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardSecondary from 'components/Cards/CardSecondary'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import React from 'react'
import { PropertyApiProps } from 'services/api/PropertyApiModule'
import { PropertyApi } from 'services/api/PropertyApi'
import PaginatedItems from 'components/PaginationCammmon/index.page'
import { useRouter } from 'next/router'
import s from './property.module.scss'
interface Props {
  data: PropertyApiProps
  page_size: string
  pageCount: number
}
const SaleProperty: NextPage<Props> = ({ data, page_size, pageCount }) => {
  const router = useRouter()
  const onChangePage = (current: number, _size: string) => {
    router.push(`/property/?page=${current}`)
  }
  const { t } = useTranslation()

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('pages_names.property'),
            link: '/property',
          }}
        />
      </Container>
      <Container>
        <HeadingWithNav title={t('pages_names.property')} />
        <div className={s.grid}>
          {data.results?.map((property) => (
            <CardSecondary
              href={{
                pathname: '/property/[slug]',
                query: { slug: property?.slug },
              }}
              key={property.id}
              imageWidth={380}
              imageHeight={200}
              item={property}
              isProperty
            />
          ))}
        </div>
        <PaginatedItems
          onChangePage={onChangePage}
          itemsPerPage={page_size}
          pageCount={pageCount}
        />
      </Container>
    </>
  )
}

export default SaleProperty
export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  locale,
}) => {
  const page = (query.page || '1') as string
  const page_size = '9' as string
  const { data } = await PropertyApi.getProperty(
    {
      page,
      page_size,
    },
    locale || 'ru'
  )
  return {
    props: {
      data: data,
      page_size,
      pageCount: data.page_count,
      ...(await getTranslations(locale as string)),
    },
  }
}
