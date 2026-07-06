import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import clsx from 'clsx'
import { TotalData } from 'services/api/InfoApiModule'
import { getTranslations } from 'helpers/serverTranslations'
import s from './jobList.module.scss'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'
import PaginatedItems from 'components/PaginationCammmon/index.page'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import SendResume from 'pages/vacancies/components/sendResume'
import FilterSidebar from './FilterSidebar'
import VacancyTile, { deptPalette } from './VacancyTile'
import { VacancyFacetsApi } from 'services/api/VacancyFacetsApi'
import {
  EMPTY_FILTERS,
  VacancyFacets,
  VacancyFilters,
} from 'services/api/VacancyFacetsApi.models'

interface Props {
  page_size: string
  initialAllData: TotalData
  initialFacets: VacancyFacets
  initialFilters: VacancyFilters
  for_who: string | null
}

interface Chip {
  key: string
  label: string
  color: string
  onRemove: () => void
}

const JobList: NextPage<Props> = ({
  page_size,
  initialAllData,
  initialFacets,
  initialFilters,
  for_who,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const locale = router.locale || 'ru'

  const [allData, setAllData] = useState<TotalData>(initialAllData)
  const [facets, setFacets] = useState<VacancyFacets>(initialFacets)
  const [filters, setFilters] = useState<VacancyFilters>(initialFilters)
  const [page, setPage] = useState<number>(
    typeof router.query.page === 'string' ? parseInt(router.query.page) : 1
  )
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const reqId = useRef(0)
  const syncUrl = useCallback(
    (f: VacancyFilters, p: number) => {
      const query: Record<string, string | string[]> = {}
      if (f.search) query.search = f.search
      if (f.region) query.region = f.region
      if (f.city) query.city = f.city
      if (f.department.length) query.department = f.department.map(String)
      if (p > 1) query.page = String(p)
      if (for_who) query.for_who = for_who
      router.replace({ pathname: '/vacancies/job-list', query }, undefined, {
        shallow: true,
      })
    },
    [router, for_who]
  )

  const fetchAll = useCallback(
    async (f: VacancyFilters, p: number) => {
      const id = ++reqId.current
      setLoading(true)
      const [listRes, facetRes] = await Promise.all([
        VacancyFacetsApi.getVacancies(
          locale,
          f,
          String(p),
          page_size,
          for_who,
          true
        ),
        VacancyFacetsApi.getFacets(locale, f, true),
      ])
      if (id !== reqId.current) return
      if (listRes?.data) setAllData(listRes.data)
      if (facetRes?.data) setFacets(facetRes.data)
      setLoading(false)
    },
    [locale, page_size, for_who]
  )

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    fetchAll(filters, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const apply = useCallback(
    (next: VacancyFilters, nextPage = 1) => {
      setFilters(next)
      setPage(nextPage)
      syncUrl(next, nextPage)
      fetchAll(next, nextPage)
    },
    [syncUrl, fetchAll]
  )

  const onSearchChange = (value: string) =>
    setFilters((f) => ({ ...f, search: value }))

  useEffect(() => {
    const handler = setTimeout(() => apply({ ...filters }, 1), 500)
    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search])

  const onDepartmentToggle = (id: number) => {
    const has = filters.department.includes(id)
    const department = has
      ? filters.department.filter((d) => d !== id)
      : [...filters.department, id]
    apply({ ...filters, department }, 1)
  }

  const onRegionChange = (value: string) =>
    apply({ ...filters, region: value, city: '' }, 1)
  const onCityChange = (value: string) => apply({ ...filters, city: value }, 1)
  const onReset = () => apply(EMPTY_FILTERS, 1)

  const onChangePage = (current: number) => {
    setPage(current)
    syncUrl(filters, current)
    fetchAll(filters, current)
  }

  const hasVacancies = allData?.results && allData.results.length > 0
  const searchQuery = filters.search.trim()
  const activeCount =
    filters.department.length +
    (filters.region ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (searchQuery ? 1 : 0)
  const hasFilters = activeCount > 0

  const chips: Chip[] = []
  filters.department.forEach((id) => {
    const dep = facets.departments.find((d) => d.id === id)
    if (dep)
      chips.push({
        key: `dep-${id}`,
        label: dep.name,
        color: deptPalette(dep.id).color,
        onRemove: () => onDepartmentToggle(id),
      })
  })
  const selectedRegion = facets.regions.find(
    (r) => String(r.id) === filters.region
  )
  if (selectedRegion) {
    chips.push({
      key: 'region',
      label: selectedRegion.name,
      color: '#156CE6',
      onRemove: () => onRegionChange(''),
    })
  }
  if (filters.city) {
    const city = selectedRegion?.cities.find(
      (c) => String(c.id) === filters.city
    )
    if (city)
      chips.push({
        key: 'city',
        label: city.name,
        color: '#1B9FD8',
        onRemove: () => onCityChange(''),
      })
  }
  if (searchQuery) {
    chips.push({
      key: 'search',
      label: `«${searchQuery}»`,
      color: '#9AA3AF',
      onRemove: () => onSearchChange(''),
    })
  }

  return (
    <div className={s.jobList}>
      <div className={s.navSlot}>
        <VacanciesNav />
      </div>
      <div className={s.inner}>
        <div className={s.eyebrow}>{t('job.career_eyebrow')}</div>
        <h1 className={s.title}>
          {t('job.list_title')} <span>{t('job.list_title_gradient')}</span>
        </h1>

        <div className={clsx(s.layout, !sidebarOpen && s.collapsed)}>
          {sidebarOpen && (
            <FilterSidebar
              facets={facets}
              filters={filters}
              hasFilters={hasFilters}
              onSearchChange={onSearchChange}
              onDepartmentToggle={onDepartmentToggle}
              onRegionChange={onRegionChange}
              onCityChange={onCityChange}
              onReset={onReset}
              onCollapse={() => setSidebarOpen(false)}
            />
          )}

          <main>
            <div className={s.resultsHead}>
              <div className={s.resultsHeadLeft}>
                {!sidebarOpen && (
                  <button
                    type="button"
                    className={s.filtersBtn}
                    onClick={() => setSidebarOpen(true)}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6h16M7 12h10M10 18h4" />
                    </svg>
                    {t('job.filters')}
                    {hasFilters && (
                      <span className={s.filtersBadge}>{activeCount}</span>
                    )}
                  </button>
                )}
                <div className={s.resultCount}>
                  {t('job.search_vacancies')}:{' '}
                  <span>{allData?.count ?? 0}</span>
                </div>
              </div>
              {loading && (
                <span className={s.updating}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#156CE6"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.2-8.5" />
                  </svg>
                  {t('job.updating')}
                </span>
              )}
            </div>

            {chips.length > 0 && (
              <div className={s.chips}>
                {chips.map((chip) => (
                  <span key={chip.key} className={s.chip}>
                    <span
                      className={s.chipDot}
                      style={{ background: chip.color }}
                    />
                    {chip.label}
                    <button
                      type="button"
                      className={s.chipRemove}
                      onClick={chip.onRemove}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {hasVacancies ? (
              <div
                className={clsx(
                  s.grid,
                  !sidebarOpen && s.wide,
                  loading && s.loading
                )}
              >
                {allData?.results?.map((vacancy, idx) => (
                  <VacancyTile
                    key={vacancy.id}
                    title={vacancy.title}
                    slug={vacancy.slug}
                    location={vacancy.cities}
                    img={vacancy?.icon?.url}
                    gradient={
                      deptPalette(vacancy.departments?.[0]?.id ?? idx).gradient
                    }
                  />
                ))}
              </div>
            ) : (
              <div className={s.empty}>
                <div className={s.emptyTitle}>{t('job.no_results')}</div>
                <div className={s.emptyHint}>{t('job.no_results_hint')}</div>
                {hasFilters && (
                  <button
                    type="button"
                    className={s.emptyReset}
                    onClick={onReset}
                  >
                    {t('job.reset')}
                  </button>
                )}
              </div>
            )}

            <PaginatedItems
              currentPage={page - 1}
              onChangePage={onChangePage}
              itemsPerPage={page_size}
              pageCount={allData?.page_count || 1}
            />
          </main>
        </div>

        <div style={{ marginTop: '30px' }}>
          <SendResume />
        </div>
      </div>
    </div>
  )
}

export default JobList

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const page = typeof query.page === 'string' ? query.page : '1'
  const page_size = '10'
  const for_who = typeof query.for_who === 'string' ? query.for_who : null

  const departmentQuery = query.department
  const department = Array.isArray(departmentQuery)
    ? departmentQuery.map((d) => parseInt(d)).filter((n) => !Number.isNaN(n))
    : typeof departmentQuery === 'string' && departmentQuery
      ? [parseInt(departmentQuery)].filter((n) => !Number.isNaN(n))
      : []

  const initialFilters: VacancyFilters = {
    search: typeof query.search === 'string' ? query.search : '',
    region: typeof query.region === 'string' ? query.region : '',
    city: typeof query.city === 'string' ? query.city : '',
    department,
  }

  const lc = locale || 'ru'
  let initialAllData: TotalData = {} as TotalData
  let initialFacets: VacancyFacets = { regions: [], departments: [] }

  try {
    const res = await VacancyFacetsApi.getVacancies(
      lc,
      initialFilters,
      page,
      page_size,
      for_who,
      false
    )
    initialAllData = res?.data || ({} as TotalData)
  } catch (e) {}

  try {
    const res = await VacancyFacetsApi.getFacets(lc, initialFilters, false)
    initialFacets = res?.data || { regions: [], departments: [] }
  } catch (e) {}

  return {
    props: {
      page_size,
      initialAllData,
      initialFacets,
      initialFilters,
      for_who,
      ...(await getTranslations(lc)),
    },
  }
}
