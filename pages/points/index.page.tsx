import clsx from 'clsx'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { ServicePoints } from 'services/api/BranchesApi'
import {
  Branches,
  Cities,
  SEOpage,
  ServiceDetailProps,
} from 'services/api/BranchesApimodule'
import s from './points.module.scss'
import { useState, useReducer, useEffect, useRef, useCallback } from 'react'
import ListPoints from './components/ListPoints'
import {
  ADD_FILTER,
  ALL_POINTS_SAVE,
  CITY,
  MODE,
  POINTS_STATE,
  REGION,
  RESET_FILTER,
  SELECT_BRANCH,
  ServiceReducer,
  TOGGLE_FILTER,
  TYPE,
} from './pointsReducer'
import { useRouter } from 'next/router'
import MapPoints from './components/MapPoints'
import { useDebounce } from 'helpers/debounce'
import Loader from 'components/Loader'
import { BANKOMATS_TYPE, TIME_OPTIONS, TYPE_OPTIONS } from 'constants/service-point'

enum WorkMode {
  Now = 1,
  DayNight = 2,
  UnderWork = 3,
}

interface ServicePointProps {
  region: string
  currentService: 'branches' | 'bankomats'
  data?: Branches[]
  city: Cities[]
  regions: Cities[]
  SEOpoints: SEOpage
  pageCountProp: number
}

const PointService: NextPage<ServicePointProps> = ({
                                                     data,
                                                     city: _city,
                                                     regions,
                                                     SEOpoints,
                                                     currentService,
                                                     region,
                                                     pageCountProp
                                                   }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [service, dispatchService]: any = useReducer<any>(
    ServiceReducer,
    POINTS_STATE
  )

  const [points, setPoints] = useState<Branches[] | any>(data)
  const [detailPoint, setDetail] = useState<ServiceDetailProps | null>(null)
  const [page, setPage] = useState<number>(1)
  const [_pageCount, setPageCount] = useState<number>(pageCountProp || 1)
  const [clearMap, setClearMap] = useState<string | null>(null)
  const [searchInput, setInputSearch] = useState<string>('')
  const { locale } = useRouter()
  const [selectedTab, setSelectedTab] = useState<'branches' | 'bankomats'>(currentService)
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([42.8746, 74.5698])
  const [activeTypeTab, setActiveTypeTab] = useState<string>('')
  const [activeTimeTab, setActiveTimeTab] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListVisible, setIsListVisible] = useState(true)

  const BRANCH_TABS = [
    { title: t('service_point_service.branches'), id: 'branches' },
    { title: t('service_point_service.bankomats'), id: 'bankomats' },
  ]

  const [activeRegion, setActiveRegion] = useState(region)

  const handleHoverItem = (id: number | null) => {
    setHoveredItemId(id)
  }

  useEffect(() => {
    setActiveTypeTab('')
    setActiveTimeTab('')
  }, [selectedTab])

  useEffect(() => {
    if (points?.length > 0) {
      const firstPoint = points[0]
      setMapCenter([parseFloat(firstPoint.lat), parseFloat(firstPoint.lng)])
    }
  }, [points])

  useEffect(() => {
    if (!router.query.region) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            region: '9',
            page: 1,
          },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [])

  useEffect(() => {
    if (data?.length || 0 > 0) {
      setPoints(data)
      dispatchService({
        type: ALL_POINTS_SAVE,
        payloaud: data,
      })
    }
  }, [data])

  const isFirstTabChange = useRef(true)

  useEffect(() => {
    if (!service.service) return

    if (isFirstTabChange.current) {
      isFirstTabChange.current = false
      return
    }

    fetchWithPagination(service.service)
  }, [])

  useEffect(() => {
    dispatchService({
      type: ADD_FILTER,
      payloaud: router.query,
    })
  }, [router.query])

  const routerParams = () => {
    router.push(
      {
        pathname: router?.pathname,
        query: {
          service: service.service || 'branches',
          region: service.region,
          city: service.city,
          mode: service.mode,
          branches: service.branches,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const fetchWithPagination = useCallback(
    async (
      serviceType = 'branches',
      params: Record<string, any> = {},
      shouldAppend = false
    ) => {
      setIsLoading(true)

      if (!shouldAppend) {
        setPage(1)
        setPageCount(1)
      }

      const targetPage = shouldAppend ? page + 1 : 1

      const normalizeParam = (val: any) =>
        typeof val === 'object' && val !== null ? '' : val

      const cleanedParams = {
        ...params,
        region: normalizeParam(params.region),
        mode: normalizeParam(params.mode),
        branch_type: normalizeParam(params.branch_type),
        type: normalizeParam(params.type),
        is_paginated: undefined,
        page: targetPage,
        page_size: undefined,
      }

      try {
        const res = await ServicePoints.getAllPointsClient(
          locale || 'ru',
          serviceType || 'branches',
          cleanedParams
        )

        const pointsData = Array.isArray(res.data) ? res.data : res.data?.results || []

        setPoints((prev: any) => {
          if (
            !shouldAppend ||
            params.service !== service.service ||
            params.region !== service.region ||
            params.city !== service.city
          ) {
            return pointsData
          }
          return [...prev, ...pointsData]
        })

        setPage(targetPage)
        setPageCount(res?.data?.page_count || 1)

        if (!shouldAppend) {
          dispatchService({
            type: ALL_POINTS_SAVE,
            payloaud: pointsData,
          })
        }
      } catch (error) {
        console.error('Error fetching points:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, locale, service.service, service.region, service.city]
  )

  const hendleSelectService = async (option: string) => {
    setPage(1)
    setPageCount(1)
    setPoints([])

    dispatchService({ type: TOGGLE_FILTER, payloaud: true })

    dispatchService({
      type: RESET_FILTER,
      payloaud: {
        service: option,
        region: '',
        city: '',
        mode: '',
        branches: '',
        type: '',
      },
    })

    setInputSearch('')

    await router.push(
      {
        pathname: router.pathname,
        query: { service: option, region: '9' },
      },
      undefined,
      { shallow: true }
    )

    await fetchWithPagination(option, {
      service: option,
      region: '9',
      page: 1,
    })

    setActiveRegion('9')

    dispatchService({ type: TOGGLE_FILTER, payloaud: false })
  }

  const _selectCity = async (selectCity: string) => {
    routerParams()
    dispatchService({ type: CITY, payloaud: selectCity })

    await router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, city: selectCity },
      },
      undefined,
      { shallow: true }
    )

    await fetchWithPagination(service.service || 'branches', {
      city: selectCity,
      page: 1,
    })
  }

  const selectRegion = async (selectRegion: string) => {
    setPage(1)
    setPageCount(1)
    setPoints([])
    routerParams()
    dispatchService({ type: REGION, payloaud: selectRegion })
    dispatchService({ type: CITY, payloaud: '' })

    await router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, region: selectRegion, city: '' },
      },
      undefined,
      { shallow: true }
    )

    await fetchWithPagination(service.service || 'branches', {
      region: selectRegion,
      city: '',
      branch_type: service.branch_type,
      mode: service.mode,
      type: service.type,
      page: 1,
    })
  }

  const selectBranch = async (selectBranch: string) => {
    setPage(1)
    setPageCount(1)
    setPoints([])
    routerParams()
    dispatchService({ type: SELECT_BRANCH, payloaud: selectBranch })

    await router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, branch_type: selectBranch },
      },
      undefined,
      { shallow: true }
    )

    await fetchWithPagination(service.service || 'branches', {
      branch_type: selectBranch,
      region: service.region,
      page: 1,
    })
  }

  const selectType = async (type: string) => {
    dispatchService({ type: TYPE, payloaud: type })

    await router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, type },
      },
      undefined,
      { shallow: true }
    )

    await fetchWithPagination(service.service || 'branches', {
      type,
      region: service.region,
      page: 1,
    })
  }

  const selectMode = async (mode: string) => {
    const modeNum = parseInt(mode)

    dispatchService({ type: MODE, payloaud: modeNum })

    await router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, mode: modeNum },
      },
      undefined,
      { shallow: true }
    )

    if (!service.all_data) return



    let filtered: Branches[] = []

    switch (modeNum) {
      case WorkMode.Now:
        filtered = service.all_data.filter((item: any) => item.is_open)
        break
      case WorkMode.DayNight:
        filtered = service.all_data.filter((item: any) => item.day_n_night)
        break
      case WorkMode.UnderWork:
        filtered = service.all_data.filter((item: any) => item.has_ground_mode)
        break
      default:
        filtered = service.all_data
    }

    setPoints(filtered)
  }

  const searchHendler = (search: string) => {
    setInputSearch(search)

    if (search.length === 0) {
      setPage(1)
      setPageCount(1)
      setDetail(null)
      setClearMap(null)
      fetchWithPagination(service.service || 'branches', {
        region: service.region,
        city: service.city,
        mode: service.mode,
        branches: service.branches,
        page: 1,
      })
    }
  }

  const getDetailInfo = async (slug: string) => {
    const { data } = await ServicePoints.getDetailInfo(
      slug,
      service.service || 'branches',
      locale as string
    )
    setDetail(data)
  }

  const clearPoint = () => {
    setClearMap(null)
    setDetail(null)
  }

  const debouncedValue = useDebounce(searchInput as string)

  const searchService = async () => {
    if (debouncedValue.length !== 0) {
      setPage(1)
      setPageCount(1)
      setDetail(null)
      setClearMap(null)

      const { data } = await ServicePoints.getSearch(
        service.service,
        debouncedValue,
        locale as string
      )
      setPoints(Array.isArray(data) ? data : data?.results || [])
    }
  }

  const resetFilters = async () => {
    dispatchService({ type: RESET_FILTER, payloaud: '' })

    await router.push(
      {
        pathname: router.pathname,
        query: {
          service: service.service,
          region: '9',
          page: 1,
        },
      },
      undefined,
      { shallow: true }
    )
    setActiveRegion('9')
    await fetchWithPagination(service.service || 'branches', { region: '9' })
  }

  const refreshData = () => {
    setPoints(data)
  }

  useEffect(() => {
    dispatchService({
      type: ALL_POINTS_SAVE,
      payloaud: data,
    })
  }, [])

  useEffect(() => {
    searchService()
  }, [debouncedValue])

  useEffect(() => {
    refreshData()
  }, [locale])

  useEffect(() => {
    dispatchService({
      type: ADD_FILTER,
      payloaud: router.query,
    })
  }, [])

  const _filterCites = regions
    ?.filter((item) => item?.id === Number(router.query?.region))
    ?.map((item) => item?.cities)
    .flat()

  return (
    <>
      {(service?.loader || isLoading) && <Loader />}
      <Section className={s.grid}>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: SEOpoints?.seo_title,
              link: '/points',
            }}
          />
        </Container>
        <Container>
          <HeadingWithNav title={SEOpoints?.seo_title} />
        </Container>
      </Section>

      <Container>
        <div className={s.branchTypeTabsWrapper}>
          <div className={s.branchTypeTabs}>
            {BRANCH_TABS.map((tab) => (
              <button
                key={tab.id}
                className={clsx(
                  s.branchTypeTab,
                  selectedTab === tab.id && s.activeBranchTypeTab
                )}
                onClick={() => {
                  setSelectedTab(tab.id as 'branches' | 'bankomats')
                  hendleSelectService(tab.id)
                }}
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div className={s.btnContainer}>
            <button
              className={s.resetFiltersButton}
              onClick={() => {
                resetFilters()
                setActiveTypeTab('')
                setActiveTimeTab('')
              }}
            >
              {t('points.reset_filters')}
            </button>
          </div>
        </div>

        <h4 className={s.filterGroupTitle}>Регион</h4>
        <div className={s.regionTabs}>
          {regions?.map((region) => (
            <button
              key={region.id}
              className={clsx(
                s.regionTab,
                activeRegion === String(region.id) && s.activeRegionTab
              )}
              onClick={() => {
                setActiveRegion(String(region.id))
                selectRegion(String(region.id))
              }}
            >
              {region.name}
            </button>
          ))}
        </div>

        <div className={s.filterGroupContainer}>
          <div className={s.filterGroup}>
            <h4 className={s.filterGroupTitle}>
              {selectedTab === 'branches'
                ? t('points.branch_type_title')
                : t('points.device_type_title')}
            </h4>
            <div className={s.filterPills}>
              {(selectedTab === 'branches' ? TYPE_OPTIONS : BANKOMATS_TYPE).map(
                (option) => (
                  <button
                    key={option.id}
                    className={clsx(
                      s.filterPill,
                      activeTypeTab === option.id && s.activeFilterPill
                    )}
                    onClick={() => {
                      setActiveTypeTab(option.id)
                      if (selectedTab === 'branches') {
                        selectBranch(option.id)
                      } else {
                        selectType(option.id)
                      }
                    }}
                  >
                    {t(`service_point_service.${option.locale}`)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className={s.filterGroup}>
            <h4 className={s.filterGroupTitle}>{t('points.work_mode_title')}</h4>
            <div className={s.filterPills}>
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={clsx(
                    s.filterPill,
                    activeTimeTab === String(option.id) && s.activeFilterPill
                  )}
                  onClick={() => {
                    setActiveTimeTab(String(option.id))
                    selectMode(String(option.id))
                  }}
                >
                  {t(`service_point_service.${option.locale}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.searchContainer}>
          <svg
            className={s.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder={`${t('search.search')}...`}
            value={searchInput}
            onChange={(e) => searchHendler(e.target.value)}
            className={s.searchInput}
          />
          {searchInput && (
            <button
              onClick={() => searchHendler('')}
              className={s.clearSearchButton}
            >
              ×
            </button>
          )}
        </div>

        <div className={s.mapWrapper}>
          <div className={clsx(s.listPointsWrapper, !isListVisible && s.hidden)}>
            <button
              className={s.toggleListButton}
              onClick={() => setIsListVisible(!isListVisible)}
            >
              {isListVisible && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/ AMLINKS_IGNORED_2000/svg"
                >
                  <path
                    d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                    fill="#0F0F0F"
                  ></path>
                </svg>
              )}
            </button>
            <div className={clsx(s.scrollContainer)}>
              <ListPoints data={points} onHoverItem={handleHoverItem} getDetailInfo={getDetailInfo} detailPoint={detailPoint} />
            </div>
          </div>

          <div className={s.mapContainer}>
            { !isListVisible && (
              <button
                className={s.toggleListButtonRight}
                onClick={() => setIsListVisible(!isListVisible)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                    fill="#0F0F0F"
                  ></path>
                </svg>
              </button>
              )
            }
            <MapPoints
              clearPoint={clearPoint}
              clearMap={clearMap}
              getDetailInfo={getDetailInfo}
              setClearMap={setClearMap}
              data={points}
              detailPoint={detailPoint}
              hoveredItemId={hoveredItemId}
              center={mapCenter}
            />
          </div>
        </div>
      </Container>
    </>
  )
}

export default PointService

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const region = query?.region || '9'
  const currentService: any = query?.service || 'branches'
  const { data } = await ServicePoints.getAllPoints(
    locale || 'ru',
    currentService,
    {
      region,
      city: query?.city,
      mode: query?.mode,
      branch_type: query?.branch_type,
      is_paginated: true,
      page: 1,
    }
  )
  const [city, regions, translations] = await Promise.all([
    ServicePoints.getCities(locale || 'ru', { region }),
    ServicePoints.getRegions(locale || 'ru'),
    getTranslations(locale as string),
  ])

  const SEOpoints = await ServicePoints.getBranchesPage(locale || 'ru')
  return {
    props: {
      data: data?.results || [],
      city: city?.data,
      currentService: currentService,
      pageCountProp: data?.page_count || 1,
      region: region,
      regions: regions?.data,
      SEOpoints: SEOpoints?.data,
      ...translations,
    },
  }
}