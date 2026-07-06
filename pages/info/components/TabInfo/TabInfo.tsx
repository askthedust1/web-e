import { FC, Key } from 'react'
import style from './tab-info.module.scss'
import Container from 'components/Container'
import Table from 'components/Table'
import Section from 'components/Section'
import Message from 'components/Message'
import CardBigInfo from '../CardBigInfo'
import { TotalData } from 'services/api/InfoApiModule'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import CarouselNavigation from 'components/Carousels/CarouselNavigation'
import Document from 'components/Document'
import PaginatedItems from 'components/PaginationCammmon/index.page'
import { IVacancies } from 'services/api/OtherApimodule'
import dynamic from 'next/dynamic'
import Loader from 'components/Loader'
import CorporateGovernancePage from 'pages/info/components/CorporateGovernancePage/CorporateGovernancePage'

const DefaultMap = dynamic(() => import("../MapDefault"), { ssr: false, loading: () => <Loader/> });

const TABLE_INFO = [
  {
    title: 'Банки-корреспонденты',
    titleEn: 'Correspondent banks',
    titleKg: 'Корреспондент банктар',
    id: 1,
  },
  {
    title: 'SWIFT',
    titleEn: 'SWIFT',
    titleKg: 'SWIFT',
    id: 2,
  },
  {
    title: 'Валюта',
    titleEn: 'Currency',
    titleKg: 'Валюта',
    id: 3,
  },
  {
    title: 'Счет',
    titleEn: 'Score',
    titleKg: 'Текшерүү',
    id: 4,
  },
]

interface TabInfo {
  labels: { type: string }[]
  allData: TotalData[]
  regions: {
    name: string
    id: number | string
  }[],
  department: {
    id: number,
    name: string,
    slug: string
  }[],
  vacancies: IVacancies
}
const TabInfo: FC<TabInfo> = ({ labels, allData, regions: _regions, department: _department, vacancies: _vacancies }: TabInfo) => {
  const router: any = useRouter()
  const { t } = useTranslation()
  const currentType = router.query.type || labels[0]?.type

  const changeTypePanel = (typeOfPage: string | number) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          page: router.query.page || '1',
          type: typeOfPage,
          for_who: router.query.for_who || 'individual',
        },
      },
      undefined,
      { scroll: false }
    )
  }

  const onChangePage = (current: number, _size: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: current,
        },
      },
      undefined,
      { scroll: false }
    )
  }
  if (!allData) {
    return null
  }

  if (currentType === 'corporate_governance') {
    return (
      <>
        <CarouselNavigation
          onClick={changeTypePanel}
          navigation={labels?.map((item, _index) => ({
            title: t(`info_page.${item?.type}`),
            id: item?.type,
          }))}
          activeTab={currentType}
        />
        <CorporateGovernancePage data={allData[0]} />
      </>
    )
  }

  return (
    <>
      <CarouselNavigation
        onClick={changeTypePanel}
        navigation={labels?.map((item, _index) => ({
          title: t(`info_page.${item?.type}`),
          id: item?.type,
        }))}
        activeTab={router.query.type || labels[0]?.type}
      />
      <Container>
        <Section className={style.card}>
          <div className={style.block}>
            {!!allData?.length && allData?.map((item, index) => (
              <div key={index} className={`${style.panel} regular-18`}>
                {item?.desc && item?.title && (
                  <CardBigInfo
                    desc={item?.desc}
                    title={item?.title}
                    docs={item?.docs}
                  />
                )}
                {item.desc1 && (
                  <CardBigInfo
                    title={item?.title}
                    desc={item?.desc1}
                    docs={item?.docs}
                  />
                )}
                {item?.groups &&
                  item?.groups.map(
                    (
                      groupsData: { id: Key | null | undefined },
                      index: number
                    ) => <CardBigInfo key={index} groups={groupsData} />
                  )}
                {item?.banks && (
                  <Table
                    panels={TABLE_INFO}
                    data={item?.banks?.map((table: any) => ({
                      id: table?.id,
                      first: table?.bank,
                      second: table?.swift,
                      third: table?.currency?.code,
                      fourh: table?.account,
                    }))}
                  />
                )}
                {item?.caption && <Message title={item?.caption} warning />}
                {item?.lat && (
                  <DefaultMap
                    centerLocation={{
                      lat: parseFloat(item.lat),
                      lng: parseFloat(item.lng),
                    }}
                  />
                )}
                {item?.desc2 && <CardBigInfo desc={item?.desc2} />}
                {
                  (router?.query?.type === 'administration_page') &&
                  <Document documents={item?.docs} />
                }

              </div>
            ))}
            { !!allData[0]?.count && !!(router?.asPath.includes("vacancies-list")) && (
              <div>
                <PaginatedItems
                  onChangePage={onChangePage}
                  itemsPerPage="9"
                  pageCount={allData[0]?.page_count}
                />
              </div>
            )}
          </div>
        </Section>
      </Container>
    </>
  )
}
export default TabInfo
