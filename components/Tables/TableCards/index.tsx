import HeadingWithNav from 'components/Heading/Heading'
import Section from 'components/Section'
import { FC } from 'react'
import style from './table-cards.module.scss'
import { useTranslation } from 'next-i18next'

interface Props {
  titles: string[]
  data: {
    id: number
    month_from: number
    month_till: number
    percs: {
      id: number
      currency: {
        id: number
        name: string
        code: string
        icon: string
      }
      perc: string
    }[]
  }[]
  title?: string
}
const TableCards: FC<Props> = ({ titles: _titles, data, title }) => {
  const { t } = useTranslation()
  return (
    <Section>
      <HeadingWithNav title={title} />
      <table className={style.table}>
        <thead>
          <tr className={style.tr}>
            <th className={`${style.th} light-16`}>{t('deposit_period')}</th>
            {data[0]?.percs?.map((item) => (
              <th key={item?.id} className={`${style.th} light-16`}>
                {item?.currency?.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className={style.tr} key={index}>
              <td className={`${style.td} light-16`}>
                {t('short.from')} {item.month_from} {t('short.till')}{' '}
                {item.month_till} {t('short.month')}
              </td>
              {item?.percs?.map((item, index) => (
                <td key={index} className={`${style.td} light-16`}>
                  {item?.perc}% {t('yearly')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <table className={style.tableMob}>
        <thead className={style.theadMob}>
          <tr className={style.trMob}>
            <th className={`${style.thMob} light-14`}>{t('deposit_period')}</th>
            {data[0]?.percs?.map((item) => (
              <th key={item?.id} className={`${style.thMob} light-14`}>
                {item?.currency?.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={style.tbodyMob}>
          {data.map((item) => (
            <tr className={style.trMob} key={item.id}>
              <td className={`${style.tdMob} light-14`}>
                {t('short.from')} {item.month_from} {t('short.till')}{' '}
                {item.month_till} {t('short.month')}
              </td>
              {item?.percs?.map((item, index) => (
                <td key={index} className={`${style.tdMob} light-14`}>
                  {item?.perc}% {t('yearly')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

export default TableCards
