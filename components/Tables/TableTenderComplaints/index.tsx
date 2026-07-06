import React, { FC } from 'react'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import { TenderAppliction } from 'services/api/TendersModule'
import EmptyData from 'components/EmptyData'
import s from './table-tender-complaints.module.scss'
import style from 'components/Document/document.module.scss'
import Icon from 'components/Icon'

interface TenderComplaints {
  data: TenderAppliction[]
  isCRM?: boolean
}

const TableTenderComplaints: FC<TenderComplaints> = ({
                                                       data,
                                                       isCRM
                                                     }) => {
  const { t } = useTranslation()

  const renderTableRows = () => {
    return data?.map((item, index) => (
      <tr key={index} className={s.trBody}>
        <td className={s.td}>
          <div className={s.titleWrapper}>
            <p className={clsx(s.number, 'light-14')}>№{item.id}</p>
          </div>
        </td>
        <td style={{display: isCRM ? 'block' : 'none'}} className={s.td}>
          <div className={clsx(s.price, 'light-16')}>{item.tender.title}</div>
        </td>
        <td className={s.td}>
          <div className={clsx(s.price, 'light-16')}>{item.company}</div>
        </td>
        <td className={s.td}>
          <div className={clsx(s.price, 'light-16')}>{item.message}</div>
        </td>
        <td className={s.td}>
          <div className={clsx(s.price, 'light-16')}>
            { item.solution ?
              <a href={item.solution} className={`${s.wrapper} light-16`} target="_blank" rel="noreferrer">
                <Icon id="pdf" width={32} height={32} className={style.icon} />
              </a>
              : t('status.consideration') }
          </div>
        </td>
      </tr>
    ))
  }

  return (
    <>
      {data?.length === 0 && isCRM ? (
        <EmptyData text={t('empty_complaints')} />
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead className={s.thead}>
            <tr className={s.trHead}>
              <th className={clsx(s.th, 'regular-16', s.thFirs)}>№</th>
              <th style={{display: isCRM ? 'table-cell' : 'none'}} className={clsx(s.th, 'regular-16', s.thFirs)}>{t('tender_page.tender_name')}</th>
              <th className={clsx(s.th, 'regular-16')}>{t('tender_page.supplier_name')}</th>
              <th className={clsx(s.th, 'regular-16')}>{t('tender_page.complaint_content')}</th>
              <th className={clsx(s.th, 'regular-16')}>{t('tender_page.solution')}</th>
            </tr>
            </thead>
            <tbody className={s.tbody}>{renderTableRows()}</tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default TableTenderComplaints
