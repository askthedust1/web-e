import { useState } from 'react'
import CardLongDoc from 'components/Cards/CardLongDoc'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import { ReportsApi, ReportsApiProps } from 'services/api/ReportModuleApi'
import { useRouter } from 'next/router'
import Section from 'components/Section'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import s from './reports.module.scss'
import PaginatedItems from 'components/PaginationCammmon/index.page'

interface Props {
  data: ReportsApiProps,
  page: string,
  page_size: string
  page_count: number
}

const Tarifs: NextPage<Props> = ({ data,
  page_size, page_count }) => {

  const { t } = useTranslation()
  const router = useRouter()
  const _routPath = router.query.page ? parseInt(router.query.page as string) - 1 : 0
  const [currentPage, setCurrentPage] = useState(router.query.page ? parseInt(router.query.page as string) - 1 : 0)

  const hendlerReport = (type: string) => {
    setCurrentPage(0)
    router.push(
      {

        pathname: router.pathname,
        query: {
          type: type,
          for_who: router.query.for_who || 'individual',
          page: 1
        },

      }
    )
  }
  const onChangePage = (current: number, _size: string) => {
    setCurrentPage(current - 1)
    router.push(
      {

        pathname: router.pathname,
        query: {
          type: router.query.type || "1",
          for_who: router.query.for_who || 'individual',
          page: current
        },

      }
    )


  }

  return (
    <>
      <Container>
        <Section isMedium className={s.wrapper}>
          <BreadCrumbsCustom
            currentPage={{
              title: t('titles_for_block.reports'),
              link: '/reports',
            }}
          />
          <div className={s.header}>
            {' '}
            <HeadingWithNav title={t('titles_for_block.reports')} />
            <div className={s.middleNav}>
              <a
                onClick={() => hendlerReport('2')}
                className={clsx(
                  s.middleNavLink,
                  String(router.query?.type) === '2' && s.middleNavLinkActive,
                  'light-14',
                  String(router.query?.type) === '2' && 'color-white bg-black'
                )}
              >
                {t('financial_reports')}
              </a>

              <a
                onClick={() => hendlerReport('1')}
                className={clsx(
                  'light-14',
                  s.middleNavLink,
                  String(router.query?.type) === '1' && s.middleNavLinkActive,
                  !router.query?.type?.length && s.middleNavLinkActive,
                  String(router.query?.type) === '1' && 'color-white bg-black'
                )}
              >
                {t('annual_yearly_reports')}
              </a>
            </div>
          </div>
        </Section>

        {data?.results?.map((item) => (
          <CardLongDoc
            key={item.id}
            data={item}
            value={t('setting.download')}
          />
        ))}
        <PaginatedItems
          currentPage={currentPage}
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
  const { data } = await ReportsApi.getReports(locale as string, {
    type: query.type || '1',
    page_size,
    page
  })
  return {
    props: {
      page,
      page_size,
      page_count: data?.page_count,
      query,
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
