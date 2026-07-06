import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardSecondary from 'components/Cards/CardSecondary'
import Container from 'components/Container'
import Heading from 'components/Heading/Heading'
import Icon from 'components/Icon'
import InputSearch from 'components/Input/InputSearch'
import PaginatedItems from 'components/PaginationCammmon/index.page'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import { NewsApi } from 'services/api/NewsApi'
import { NewsResult } from 'services/api/NewsApi.models'
import style from './news.module.scss'
import { SEOpage } from 'services/api/BranchesApimodule'

interface Props {
  news: NewsResult[]
  page: string
  page_size: string
  pageCount: number
  SEOnews: SEOpage
}

// DD.MM.YYYY → YYYY-MM-DD (returns '' if incomplete / invalid)
function cisToIso(cis: string): string {
  const match = cis.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!match) return ''
  return `${match[3]}-${match[2]}-${match[1]}`
}

// YYYY-MM-DD → DD.MM.YYYY (returns '' if empty)
function isoToCis(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return ''
  return `${match[3]}.${match[2]}.${match[1]}`
}

// Auto-insert dots as user types digits
function autoFormatCis(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
}

const News: FC<Props> = ({ news, pageCount, page: _page, page_size, SEOnews }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [searchValue, setSearchValue] = useState((router.query.search as string) || '')
  const [dateFromDisplay, setDateFromDisplay] = useState(isoToCis((router.query.date_from as string) || ''))
  const [dateToDisplay, setDateToDisplay] = useState(isoToCis((router.query.date_to as string) || ''))
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue((router.query.search as string) || '')
  }, [router.query.search])

  useEffect(() => {
    setDateFromDisplay(isoToCis((router.query.date_from as string) || ''))
  }, [router.query.date_from])

  useEffect(() => {
    setDateToDisplay(isoToCis((router.query.date_to as string) || ''))
  }, [router.query.date_to])

  const buildQuery = useCallback(
    (overrides: Record<string, string>) => {
      const base: Record<string, string> = {}
      if (router.query.for_who === 'legal') base.for_who = 'legal'
      const search = 'search' in overrides ? overrides.search : ((router.query.search as string) ?? '')
      const date_from = 'date_from' in overrides ? overrides.date_from : ((router.query.date_from as string) ?? '')
      const date_to = 'date_to' in overrides ? overrides.date_to : ((router.query.date_to as string) ?? '')
      const page = overrides.page ?? '1'
      if (search) base.search = search
      if (date_from) base.date_from = date_from
      if (date_to) base.date_to = date_to
      base.page = page
      return base
    },
    [router.query]
  )

  const onChangePage = (current: number, _size: string) => {
    router.push({ pathname: '/news', query: buildQuery({ page: String(current) }) })
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      router.push({ pathname: '/news', query: buildQuery({ search: value, page: '1' }) })
    }, 400)
  }

  const onDateDisplayChange =
    (field: 'date_from' | 'date_to', setDisplay: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = autoFormatCis(e.target.value)
      setDisplay(formatted)
      const iso = cisToIso(formatted)
      if (iso || formatted === '') {
        router.push({ pathname: '/news', query: buildQuery({ [field]: iso, page: '1' }) })
      }
    }

  return (
    <>
      <Head>
        <title>{SEOnews?.seo_title}</title>
        <meta name="description" content={SEOnews?.seo_description} key="description" />
        <meta name="keywords" content={SEOnews?.seo_keywords} key="keywords" />
        <meta property="og:title" content={SEOnews?.og_title || SEOnews?.seo_title} key="og:title" />
        <meta property="og:description" content={SEOnews?.og_description} key="og:description" />
        <meta property="og:image" content={SEOnews?.og_image} key="og:image" />
        <link rel="canonical" href={getCanonicalUrl(router.locale || 'ru', '/news')} />
      </Head>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('titles_for_block.news'),
            link: '/news',
          }}
        />

        <Heading title={t('titles_for_block.news')} />

        <div className={style.filters}>
          <div className={style.searchWrapper}>
            <InputSearch
              value={searchValue}
              onChange={onSearchChange}
              placeholder={t('search.search')}
              className={style.searchInput}
            />
          </div>
          <div className={style.dateRange}>
            <div className={style.dateInputWrapper}>
              <input
                type="text"
                inputMode="numeric"
                className={style.dateInput}
                value={dateFromDisplay}
                onChange={onDateDisplayChange('date_from', setDateFromDisplay)}
                placeholder="ДД.ММ.ГГГГ"
                maxLength={10}
              />
              <Icon id="calendar" className={style.calendarIcon} width={16} height={16} />
            </div>
            <span className={style.dateSeparator}>—</span>
            <div className={style.dateInputWrapper}>
              <input
                type="text"
                inputMode="numeric"
                className={style.dateInput}
                value={dateToDisplay}
                onChange={onDateDisplayChange('date_to', setDateToDisplay)}
                placeholder="ДД.ММ.ГГГГ"
                maxLength={10}
              />
              <Icon id="calendar" className={style.calendarIcon} width={16} height={16} />
            </div>
          </div>
        </div>

        <div className={style.pagination}>
          <div className={style.wrapper}>
            {news?.map((item) => (
              <CardSecondary
                href={{
                  pathname: `news/[slug]`,
                  query: { ...router.query, slug: item?.slug },
                }}
                key={item.id}
                imageWidth={380}
                imageHeight={200}
                item={item}
              />
            ))}
          </div>
          <PaginatedItems
            onChangePage={onChangePage}
            itemsPerPage={page_size}
            pageCount={pageCount}
            currentPage={Number(router.query.page) - 1 || 0}
          />
        </div>
      </Container>
    </>
  )
}

export default News

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, locale }) => {
  const page = (query.page || '1') as string
  const page_size = '9' as string
  const search = (query.search || '') as string
  const date_from = (query.date_from || '') as string
  const date_to = (query.date_to || '') as string
  const { data } = await NewsApi.getNewsP(
    {
      page,
      page_size,
      ...(search && { search }),
      ...(date_from && { date_from }),
      ...(date_to && { date_to }),
    },
    locale || 'ru'
  )
  const newsSeo = await NewsApi.getNewsSEO(locale as string)
  return {
    props: {
      news: data.results,
      page,
      pageCount: data.page_count,
      page_size,
      SEOnews: newsSeo.data,
      ...(await getTranslations(locale as string)),
    },
  }
}
