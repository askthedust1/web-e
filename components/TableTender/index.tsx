import { FC } from 'react'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import Button from 'components/Buttons/Button'
import { TenderList, TendersApi } from 'services/api/TendersModule'
import { useRouter } from 'next/router'
import Icon from 'components/Icon'
import PopUpTwoButtons from 'components/PopUpTwoButtons'
import { store } from 'store'
import EmptyData from 'components/EmptyData'
import s from './table-tender.module.scss'
import PopUp from 'components/PopUp'
import parseTime from 'helpers/parseTime'

interface Files {
  ext: string
  file: string
  id: number
  title: string
}
const { modals } = store
export const showButtons = (
  files: Files[],
  _userToken?: string | boolean | null,
  className?: string,
  label?: string
) => {
  return (
    <div className={s.buttons}>
      {files?.map(
        (item: { file: string | undefined; title: string }, index) => (
          <>
            <Button
              key={index}
              isLong
              onOtherPage
              href={item.file}
              isBlue
              className={clsx(s.button, className, 'bg-white')}
              value={label || item.title}
            />
          </>
        )
      )}
    </div>
  )
}

export enum TenderStatuses {
  Active = 'active',
  Finished = 'finished',
}

export const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}

export const deleteTenderApp = (
  tenderId: number,
  e: React.MouseEvent<HTMLElement>,
  userToken: string,
  getUserDataByToken?: any,
  tramslate?: any
) => {
  stopPropagation(e)
  modals?.openModal({
    body: (
      <PopUpTwoButtons
        closeModal={() => modals?.resetData()}
        leftButton={() => {
          deleteTender(tenderId, userToken, getUserDataByToken, tramslate)
        }}
        rigthButton={() => modals?.resetData()}
        leftButtonText={tramslate?.leftText}
        rigthButtonText={tramslate?.righText}
        title={tramslate?.title}
        isImage={false}
      />
    ),
  })
}
export const deleteTender = async (
  id: number,
  userToken: string,
  nextFunction?: any,
  tramslate?: any
) => {
  try {
    await TendersApi.resetTender(id, userToken as string).then((_res) => {
      modals?.resetData()
      nextFunction()
      modals?.resetTenderFilers()
    })
  } catch (e) {
    modals.openModal({
      body: (
        <PopUp
          text={tramslate?.error_popup}
          closeModal={() => modals?.resetData()}
        />
      ),
    })
  }
}

interface Props {
  data?: TenderList[]
  userToken: string | boolean | null
  isCRM?: Boolean
  getUserToken?(): void
}

const TableTender: FC<Props> = ({
  data,
  userToken,
  isCRM = false,
  getUserToken,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const procurementMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      competition: t('tender_page.method_competition'),
      quotation_request: t('tender_page.method_quotation'),
      direct_contract: t('tender_page.method_direct'),
      simple_purchase: t('tender_page.method_simple'),
    }
    return labels[method] || method
  }

  const statusTender = (status: string) => {
    switch (status) {
      case TenderStatuses.Active:
        return (
          <div className={clsx(s.status, 'light-18', s.active)}>
            {t('tender_page.active')}
          </div>
        )
      case TenderStatuses.Finished:
        return (
          <div className={clsx(s.status, 'light-18', s.disabled)}>
            {t('tender_page.disabled')}
          </div>
        )
    }
  }

  const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  const edditTenderApp = (slug: string, e: React.MouseEvent<HTMLElement>) => {
    stopPropagation(e)
    tenderDeteil(slug)
  }

  const tenderDeteil = (slug: string) => {
    const forWho = router?.query?.for_who
    const query = forWho === 'legal' ? { for_who: 'legal', slug } : { slug }

    router.push({
      pathname: '/tenders/[slug]',
      query,
    })
  }

  return (
    <>
      {data?.length === 0 ? (
        <EmptyData />
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr className={s.trHead}>
                <th className={clsx(s.th, 'regular-16', s.thFirs)}>
                  {t('tender_page.tender_name')}
                </th>
                <th className={clsx(s.th, 'regular-16')}>
                  {t('tender_page.procurement_method')}
                </th>
                <th className={clsx(s.th, 'regular-16')}>
                  {t('tender_page.plan_summa')}
                </th>
                <th className={clsx(s.th, 'regular-16')}>
                  {t('tender_page.date_open')}
                </th>
                <th className={clsx(s.th, 'regular-16')}>
                  {t('tender_page.adress_postavka')}
                </th>
                <th className={clsx(s.th, 'regular-16')}>
                  {t('tender_page.status_reuest')}
                </th>
                {userToken && isCRM && (
                  <th className={clsx(s.th, 'regular-16')}>
                    {t('tender_page.action')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {data?.map((item, index) => {
                const timeFormat = parseTime(
                  item.opened_at,
                  'dd.MM.yyyy HH:mm',
                  router.locale
                )
                return (
                  <tr
                    key={index}
                    className={s.trBody}
                    onClick={() => tenderDeteil(item.slug)}
                  >
                    <td className={s.td}>
                      <div className={s.titleWrapper}>
                        <p className={clsx(s.number, 'light-14')}>
                          {t('tender_num1')} №{item.num}
                        </p>
                        <p className={clsx(s.title, 'medium-16')}>
                          {item.title}
                        </p>
                        <p className={clsx(s.subtitle, 'light-14')}>
                          {item.caption}
                        </p>
                      </div>
                    </td>
                    <td className={s.td}>
                      <span
                        className={clsx(
                          s.methodBadge,
                          s[item.procurement_method]
                        )}
                      >
                        {procurementMethodLabel(item.procurement_method)}
                      </span>
                    </td>
                    <td className={s.td}>
                      <div className={clsx(s.price, 'light-18')}>
                        {item.plan_sum}
                      </div>
                    </td>
                    <td className={s.td}>
                      <div className={clsx(s.date, 'light-18')}>
                        {timeFormat}
                      </div>
                    </td>
                    <td className={s.td}>
                      <div className={clsx(s.adress, 'light-18')}>
                        {item.address}
                      </div>
                    </td>
                    <td className={s.td}>
                      <div className={s.statusWrapper}>
                        {statusTender(item.status)}
                        {showButtons(
                          item.result_docs,
                          userToken as string,
                          undefined,
                          t('tender_page.tender_results')
                        )}
                      </div>
                    </td>
                    {userToken && isCRM && (
                      <td className={s.td}>
                        <div className={s.action}>
                          <div
                            className={s.edit}
                            onClick={(e) => edditTenderApp(item?.slug, e)}
                          >
                            <Icon id="edit" width={32} height={32} />
                          </div>
                          <div
                            className={s.delete}
                            onClick={(e) =>
                              deleteTenderApp(
                                item.applicationId,
                                e,
                                userToken as string,
                                getUserToken,
                                {
                                  leftText: t('tender_page.yes'),
                                  righText: t('tender_page.no'),
                                  title: t('tender_page.delete_caption'),
                                }
                              )
                            }
                          >
                            <Icon id="delete" width={32} height={32} />
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default TableTender
