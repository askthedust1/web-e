import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Container from 'components/Container'
import s from './tenders.module.scss'
import TableTender from 'components/TableTender'
import HeadingWithNav from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { TenderAppliction, TenderList, TendersApi } from 'services/api/TendersModule'
import { UserStorage } from 'services/storage/user'
import Authentication from './components/auth'
import { UserApi, UserData } from 'services/api/UsersApiModule'
import SelectFilter from 'components/Select'
import TabHeader from 'components/TabHeader'
import Profile from './components/profile'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'next-i18next'
import parse from 'html-react-parser'
import TableTenderComplaints from 'components/Tables/TableTenderComplaints'

interface Props {
  tenders: TenderList[],
  SEOtender: {
    description?: string
  }
}
enum TenderTabs {
  AllTenders = 1,
  MyTenders = 2,
  MyComplaints= 3,
  MyProfile = 4
}

const TendersPage: NextPage<Props> = observer(({ tenders, SEOtender }) => {
  const { t } = useTranslation()
  const TABS_TENDER = [
    {
      title: t('tender_page.all_tender'),
      id: TenderTabs.AllTenders,
    },
    {
      title: t('tender_page.my_tenders'),
      id: TenderTabs.MyTenders,
    },
    {
      title: t('tender_page.my_complaints'),
      id: TenderTabs.MyComplaints,
    },
    {
      title: t('tender_page.my_profile'),
      id: TenderTabs.MyProfile,
    },
  ]
  const TENDER_STATUSES_FILTER = [
    {
      name: t('tender_page.active'),
      id: 'active',
    },
    {
      name: t('tender_page.disabled'),
      id: 'finished',
    },
  ]
  const PROCUREMENT_METHODS_FILTER = [
    { name: t('tender_page.all_methods'), id: '' },
    { name: t('tender_page.method_competition'), id: 'competition' },
    { name: t('tender_page.method_quotation'), id: 'quotation_request' },
    { name: t('tender_page.method_direct'), id: 'direct_contract' },
    { name: t('tender_page.method_simple'), id: 'simple_purchase' },
  ]
  const [status, setStatus] = useState<string>('active')
  const [procurementMethod, setProcurementMethod] = useState<string>('')
  const [tabActive, setTabActive] = useState<number>(TenderTabs.AllTenders)
  const [tenderList, setTenderList] = useState<TenderList[]>(tenders?.filter((item) => item.status === status))
  const [complaintsList, setComplaintsList] = useState<TenderAppliction[]>([])
  const [token, setToken] = useState<string | boolean | null>(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [tenderAppList, setTenderAppList] = useState<UserData[] | null>(null)
  const [docsOpen, setDocsOpen] = useState(false)
  const docsContentRef = useRef<HTMLDivElement>(null)

  const getUserToken = () => {
    const TOKEN = UserStorage.getUserToken()
    setToken(TOKEN)
    if (TOKEN) {
      getUserData(TOKEN)
    } else {
      setUserData(null)
    }
  }

  const getUserData = async (userToken: string) => {
    if (!userToken) {
      return null
    }
    try {
      const userData = await UserApi.getUserDataByToken(userToken as string)
      const tenderAppList = await TendersApi.getTenderListApplications(
        userToken as string
      )
      const complaintsListData = await TendersApi.getUserTenderComplaints(userToken as string);
      setUserData(userData?.data)
      setTenderAppList(tenderAppList.data)
      setComplaintsList(complaintsListData.data)
    } catch (e) { }
  }

  const applyFilters = (statusVal: string, methodVal: string) => {
    let filtered = tenders
    if (statusVal) {
      filtered = filtered?.filter((item) => item.status === statusVal)
    }
    if (methodVal) {
      filtered = filtered?.filter((item) => item.procurement_method === methodVal)
    }
    setTenderList(filtered)
  }

  const filterTenders = (e: string) => {
    setStatus(e)
    applyFilters(e, procurementMethod)
  }

  const filterByMethod = (e: string) => {
    setProcurementMethod(e)
    applyFilters(status, e)
  }

  const myTenderApps = tenderAppList?.map((wrapperTender) => ({
    applicationId: wrapperTender.id,
    ...wrapperTender.tender,
  }))

  useEffect(() => {
    getUserToken()
  }, [token])

  return (
    <>
      <Container>
        <Authentication
          loginNmae={userData?.username}
          userName={userData?.fio}
          token={token}
          getUserToken={getUserToken}
        />
        <HeadingWithNav title={t('tender_page.tender_title')} />
        <div className={s.filterBar}>
          <div className={s.filters}>
            <SelectFilter
              optionList={TENDER_STATUSES_FILTER}
              selectOption={filterTenders}
              value={status}
              label={t('tender_page.all_tender')}
            />
            <SelectFilter
              optionList={PROCUREMENT_METHODS_FILTER}
              selectOption={filterByMethod}
              value={procurementMethod}
              label={t('tender_page.procurement_method')}
            />
          </div>
          <span className={s.resultCount}>
            {tenderList?.length || 0} {t('tender_page.tenders_count')}
          </span>
        </div>

        {SEOtender?.description && (
          <div className={s.docsBlock}>
            <button
              className={s.docsToggle}
              onClick={() => setDocsOpen(!docsOpen)}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>{t('tender_page.regulatory_docs')}</span>
              <svg
                className={clsx(s.docsArrow, docsOpen && s.docsArrowOpen)}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              ref={docsContentRef}
              className={s.docsContent}
              style={{
                maxHeight: docsOpen ? docsContentRef.current?.scrollHeight + 'px' : '0',
              }}
            >
              <div className={s.docsInner}>
                {parse(SEOtender.description)}
              </div>
            </div>
          </div>
        )}

        {token && (
          <div className={s.tabWrapper}>
            <TabHeader
              tabActive={tabActive}
              titles={TABS_TENDER}
              setTabActive={setTabActive}
            />
          </div>
        )}
        {tabActive === TenderTabs.AllTenders && (
          <TableTender data={tenderList} userToken={token} />
        )}
        {tabActive === TenderTabs.MyTenders && (
          <TableTender
            getUserToken={getUserToken}
            data={myTenderApps}
            userToken={token}
            isCRM
          />
        )}
        {tabActive === TenderTabs.MyComplaints && (
          <TableTenderComplaints data={complaintsList} isCRM />
        )}
        {tabActive === TenderTabs.MyProfile && (
          <Profile userToken={token} data={userData} />
        )}
      </Container>
    </>
  )
})

export default TendersPage
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const [{ data }, SEOtender, translations] = await Promise.all([
    TendersApi.getTenderList((locale as string) || 'ru'),
    TendersApi.getTenderListSEO((locale as string) || 'ru'),
    getTranslations(locale as string),
  ])

  return {
    props: { SEOtender: SEOtender.data, tenders: data, ...translations },
  }
}
