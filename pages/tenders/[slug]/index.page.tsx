import Container from 'components/Container'
import Section from 'components/Section'
import clsx from 'clsx'
import CardBigInfo from 'pages/info/components/CardBigInfo'
import CkEditor from 'components/CkEditor'
import Button from 'components/Buttons/Button'
import { GetServerSideProps, NextPage } from 'next'
import { TenderDetailProps, TendersApi } from 'services/api/TendersModule'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import Message from 'components/Message'
import { useEffect, useState } from 'react'
import { UserStorage } from 'services/storage/user'
import RequestTender from '../components/reuest'
import ResultModal from 'components/ResultModal'
import PopUpTwoButtons from 'components/PopUpTwoButtons'
import LoginTender from '../components/login'
import RegistrationForm from '../components/registration'
import Authentication from '../components/auth'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { UserApi, UserData } from 'services/api/UsersApiModule'
import { store } from 'store'
import HeadingWithNav from 'components/Heading/Heading'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'next-i18next'
import Loader from 'components/Loader'
import s from './tender-deteil.module.scss'
import parseTime from 'helpers/parseTime'
import ComplaintForm from 'pages/tenders/components/complaint'
import TableTenderComplaints from 'components/Tables/TableTenderComplaints'
import { getApiErrorMessage } from 'helpers/getApiErrorMessage'

export interface RequestTenderPost {
  message: string
  tender: number
  recaptcha: string
}
export interface RequestTenderMessage {
  message: string
  file: File[]
  recaptcha: string
}
interface Props {
  data: TenderDetailProps
}

const TenderDeteilPage: NextPage<Props> = observer(({ data }) => {
  const [token, setToken] = useState<string | boolean | null>(null)
  const [popUp, setPopUp] = useState<boolean>(false)
  const [loader, setLoader] = useState<boolean>(false)
  const [appData, setAppData] = useState<null | TenderDetailProps>(null)
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [isComplaint, setIsComplaint] = useState<boolean>(false)
  const [isReg, setIsReg] = useState<boolean>(false)
  const [isRequest, setIsReqest] = useState<boolean>(false)
  const [complaints, setComplaints] = useState([])
  const { locale } = useRouter()
  const started_at = parseTime(data?.started_at, 'dd MMMM y-HH:mm', locale)
  const opened_at = parseTime(data?.opened_at, 'dd MMMM y-HH:mm', locale)
  const [userData, setUserData] = useState<UserData | null>(null)
  const { query } = useRouter()
  const { modals } = store
  const { t } = useTranslation()

  const fetchComplaints = async () => {
    const currentToken = UserStorage.getUserToken()
    if (!currentToken) return
    try {
      const response = await TendersApi.getTenderComplaints(
        locale || 'ru',
        data.id,
        currentToken as string
      )
      setComplaints(response.data)
    } catch (e) {
      console.error('Ошибка при получении жалоб:', e)
    }
  }

  const request = () => {
    if (token) {
      setIsReqest(true)
    } else {
      setPopUp(true)
    }
  }

  const onSubmitTender = async (info: RequestTenderMessage) => {
    setLoader(true)
    try {
      setIsReqest(true)
      const currentData = {
        message: info.message,
        tender: data.id,
        recaptcha: info.recaptcha,
      }
      await TendersApi.postTenderAplication(token as string, currentData).then(
        async (res) => {
          try {
            await onSubmitTenderFiles(info?.file, res?.data?.id)
            setLoader(false)
            modals?.openModal({
              body: (
                <ResultModal
                  success={true}
                  message={t('popup_ordered') || ''}
                  closeModal={() => modals?.resetData()}
                />
              ),
            })
            getUserDataByToken()
          } catch (e: any) {
            // App was created (201) but document upload failed. Roll back the
            // orphaned application so a retry doesn't pile up duplicate empty
            // applications (CCONV-1507).
            if (res?.data?.id) {
              try {
                await TendersApi.resetTender(res.data.id, token as string)
              } catch (_rollbackErr) {
                // best-effort cleanup; surface the original error below
              }
            }
            setLoader(false)
            modals.openModal({
              body: (
                <ResultModal
                  success={false}
                  message={getApiErrorMessage(e, t('error_popup'))}
                  closeModal={() => modals?.resetData()}
                />
              ),
            })
            return
          }
        }
      )
    } catch (e: any) {
      setLoader(false)
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message={getApiErrorMessage(e, t('error_popup'))}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setLoader(false)
    }
  }
  const onSubmitTenderFiles = async (files: File[], tenderId: number) => {
    const list = Array.isArray(files) ? files : files ? [files] : []
    if (list.length === 0) {
      throw new Error(t('error_popup'))
    }
    try {
      return await Promise.all(
        list.map(async (file) => {
          const formData = new FormData()
          formData.append('application', String(tenderId))
          formData.append('file', file)
          return await TendersApi.postTenderFilesAplication(
            token as string,
            formData
          )
        })
      )
    } catch (e) {
      console.error('Ошибка при загрузке файлов:', e)
      throw e
    }
  }

  const loginReqest = () => {
    setPopUp(false)
    setIsLogin(true)
    getUserDataByToken()
  }
  const registrationReqest = () => {
    setPopUp(false)
    setIsReg(true)
    getUserDataByToken()
  }
  const onEditHendler = async (
    newData: RequestTenderMessage,
    appID: number
  ) => {
    setLoader(true)
    const currentData = {
      message: newData.message,
      tender: appID,
      recaptcha: newData.recaptcha,
    }
    try {
      await TendersApi.putTender(appID, token as string, currentData).then(
        (_response) => {
          setLoader(false)
          appData?.docs?.forEach(async (item) => {
            await TendersApi.deleteDocument(item?.id, token as string)
          })
          onSubmitTenderFiles(newData?.file, appID)
        }
      )
      setLoader(false)
    } catch (e) {
      setLoader(false)
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setLoader(false)
    }
  }

  const getUserToken = async () => {
    const TOKEN = UserStorage.getUserToken()

    setToken(TOKEN as string)

    if (TOKEN) {
      getUserData(TOKEN as string, data.id)
      getUserDataByToken()
    } else {
      setUserData(null)
      setAppData(null)
    }
  }
  const getUserData = async (userToken: string, _tenderId: number) => {
    try {
      const res = await UserApi.getUserDataByToken(userToken as string)
      setUserData(res.data)
    } catch (e) {
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    }
  }
  const getUserDataByToken = async () => {
    const TOKEN = UserStorage.getUserToken()
    try {
      const _data = TendersApi.getTenderDetailToken(
        query?.slug as string,
        locale || 'ru',
        TOKEN as string
      ).then((e) => {
        setAppData(e?.data?.application)
      })
    } catch (e) {
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    }
  }

  useEffect(() => {
    getUserToken()
  }, [token])

  useEffect(() => {
    fetchComplaints()
  }, [locale, data.id])

  return (
    <>
      {loader && <Loader />}
      <Section className={s.mr_40}>
        <Container>
          <BreadCrumbsCustom
            isShowMain={false}
            currentPage={{
              title: t('tender_page.all_tender'),
              link: '/tenders',
            }}
            slug={{
              title: data?.title,
              link: data?.slug,
            }}
          />
        </Container>
      </Section>
      {isLogin && (
        <LoginTender
          closePopup={() => setIsLogin(false)}
          getUserToken={getUserToken}
        />
      )}
      {isReg && (
        <RegistrationForm
          loginShow={() => setIsLogin(true)}
          closePopup={() => setIsReg(false)}
          getUserToken={getUserToken}
        />
      )}
      {popUp && (
        <PopUpTwoButtons
          rigthButton={registrationReqest}
          leftButton={loginReqest}
          closeModal={() => setPopUp(false)}
          text={t('tender_page.cuption_auth')}
          leftButtonText={t('tender_page.login')}
          rigthButtonText={t('tender_page.register')}
        />
      )}
      <Container>
        <Authentication
          loginNmae={userData?.username}
          userName={userData?.fio}
          token={token}
          getUserToken={getUserToken}
        />
        <HeadingWithNav title={data?.title} />
        <Section className={s.wrapper}>
          <div className={s.rigth}>
            <div className={s.header}>
              <div className={clsx(s.title, 'border-black', 'm-5')}>
                <p className={clsx(s.key, 'light-14')}>
                  {t('tender_page.tender_num')}
                </p>
                <p className={clsx(s.value, 'medium-16')}>№{data?.num}</p>
              </div>
              <div className={clsx(s.title, 'border-black', 'm-5')}>
                <p className={clsx(s.key, 'light-14')}>
                  {t('tender_page.procurement_method')}
                </p>
                <p className={clsx(s.value, 'medium-16')}>
                  {(
                    {
                      competition: t('tender_page.method_competition'),
                      quotation_request: t('tender_page.method_quotation'),
                      direct_contract: t('tender_page.method_direct'),
                      simple_purchase: t('tender_page.method_simple'),
                    } as Record<string, string>
                  )[data?.procurement_method] || data?.procurement_method}
                </p>
              </div>
              <div className={clsx(s.title, 'border-black', 'm-5')}>
                <p className={clsx(s.key, 'light-14')}>
                  {t('tender_page.tender_date')}
                </p>
                <p className={clsx(s.value, 'medium-16')}>{started_at}</p>
              </div>
              <div className={clsx(s.title, 'border-black', 'm-5')}>
                <p className={clsx(s.key, 'light-14')}>
                  {t('tender_page.tender_opened')}
                </p>
                <p className={clsx(s.value, 'medium-16')}>{opened_at}</p>
              </div>
              <div className={clsx(s.title, 'border-black', 'm-5')}>
                <p className={clsx(s.key, 'light-14')}>
                  {t('tender_page.tender_summa')}
                </p>
                <p className={clsx(s.value, 'medium-16')}>{data?.plan_sum}</p>
              </div>
              <div className={clsx(s.title, 'border-black', 'm-5')}>
                <p className={clsx(s.key, 'light-14')}>
                  {t('tender_page.tender_adress')}
                </p>
                <p className={clsx(s.value, s.addres, 'medium-16')}>
                  {data?.address}
                </p>
              </div>
            </div>
            <CkEditor caption={data?.desc} />
            {data?.caption && <Message danger title={data?.caption} />}
            <div className={s.btnWrap}>
              {!isRequest && !appData && (
                <Button
                  onClick={() => request()}
                  value={t('tender_page.do_reuest')}
                />
              )}
              <Button
                className={s.redButton}
                onClick={() => setIsComplaint(true)}
                value={t('tender_page.send_complaint')}
              />
              {isComplaint && (
                <ComplaintForm
                  closePopup={() => setIsComplaint(false)}
                  initValue={token ? userData : null}
                  tenderId={data.id}
                  userToken={token as string}
                  onComplaintSuccess={fetchComplaints}
                />
              )}
            </div>
            <div
              className={clsx(
                s.show,
                isRequest && s.active,
                appData && s.active
              )}
            >
              <RequestTender
                getUserDataByToken={getUserDataByToken}
                userToken={token}
                initValue={appData}
                onSubmitTender={onSubmitTender}
                onEditHendler={onEditHendler}
                setLoader={setLoader}
              />
            </div>
            {complaints && complaints.length > 0 && (
              <TableTenderComplaints data={complaints} />
            )}
          </div>
          <div className={s.left}>
            <CardBigInfo
              userToken={token}
              files={data?.result_docs}
              title={t('doc')}
              docs={data?.docs}
              buttons
            />
          </div>
        </Section>
      </Container>
    </>
  )
})

export default TenderDeteilPage
export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  locale,
}) => {
  const { data } = await TendersApi.getTenderDetail(
    query.slug as string,
    locale || 'ru'
  )

  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
