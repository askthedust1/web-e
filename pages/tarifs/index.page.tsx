import CardLongDoc from 'components/Cards/CardLongDoc'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import React from 'react'
import { useTranslation } from 'next-i18next'
import { TarifssApi } from 'services/api/TarifsApi'
import { TarifsApiProps } from 'services/api/TarifsApimodule'
import Section from 'components/Section'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import s from './tarifs.module.scss'
import PaginatedItems from 'components/PaginationCammmon/index.page'
import { useRouter } from 'next/router'
interface Props {
  data: TarifsApiProps
  page_size: string
  page_count: number
}

const Tarifs: NextPage<Props> = ({ data, page_size, page_count }) => {
  const router = useRouter()
  const routPath = router.query.page ? parseInt(router.query.page as string) - 1 : 0
  const { t } = useTranslation()

  const onChangePage = (current: number, _size: string) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...(router.query.for_who === 'legal' ? { for_who: 'legal' } : {}),
        page: current,
      },
    })
  }

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('setting.tariffs'),
            link: '/transfers',
          }}
        />
      </Container>
      <Container>
        <Section className={s.wrapper}>
          <HeadingWithNav title={t('setting.tariffs')} />
        </Section>
        {data?.results?.map((item) => (
          <CardLongDoc
            key={item.id}
            data={item}
            value={t('setting.download')}
          />
        ))}
        <PaginatedItems
          currentPage={routPath}
          onChangePage={onChangePage}
          itemsPerPage={page_size}
          pageCount={page_count}
        />
      </Container>
    </>
  )
}

export default Tarifs

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const page = (query?.page || '1') as string
  const page_size = '9' as string
  const typeOfUser = checkQueryParams(query)
  const { data } = await TarifssApi.getTarifs(locale as string, {
    ...typeOfUser,
    page_size,
    page
  })
  const SEOtarif = await TarifssApi.getTarifsSEO(locale as string)
  return {
    props: {
      page,
      page_size,
      page_count: data?.page_count,
      data,
      SEOtarif: SEOtarif.data,
      ...(await getTranslations(locale as string)),
    },
  }
}
