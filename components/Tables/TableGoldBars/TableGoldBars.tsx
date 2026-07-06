import Section from 'components/Section'
import React, { FC } from 'react'
import Heading from 'components/Heading/Heading'
import style from './table-gold-bars.module.scss'
import { useTranslation } from 'next-i18next'
interface TableGoldBarsProps {
  title?: string
  data: {
    id: number
    weight: string
    width: string
    length: string
    metal: string
    sample: string
  }[]
}

const TableGoldBars: FC<TableGoldBarsProps> = ({
  title,
  data,
}: TableGoldBarsProps) => {
  const { t } = useTranslation()
  const titles = [
    t('gold_bars_page.weight'),
    t('gold_bars_page.width'),
    t('gold_bars_page.hight'),
    t('gold_bars_page.mettal'),
    t('gold_bars_page.try'),
  ]
  return (
    <Section>
      <Heading title={title} />
      <table className={style.table}>
        <thead>
          <tr className={style.tr}>
            {titles.map((item) => (
              <th key={item} className={`${style.th} light-16`}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className={`${style.tr} color-white-hover`} key={item.id}>
              <td className={`${style.td} light-16`}>{item.weight}</td>
              <td className={`${style.td} light-16`}>{item.width}</td>
              <td className={`${style.td} light-16`}>{item.length}</td>
              <td className={`${style.td} light-16`}>{item.metal}</td>
              <td className={`${style.td} light-16`}>{item.sample}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className={style.tableMob}>
        <thead className={style.theadMob}>
          <tr className={style.trMob}>
            {titles.map((item) => (
              <th key={item} className={`${style.thMob} light-14`}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={style.tbodyMob}>
          {data.map((item) => (
            <tr className={style.trMob} key={item.id}>
              <td className={`${style.tdMob} light-14`}>{item.weight}</td>
              <td className={`${style.tdMob} light-14`}>{item.width}</td>
              <td className={`${style.tdMob} light-14`}>{item.length}</td>
              <td className={`${style.tdMob} light-14`}>{item.metal}</td>
              <td className={`${style.tdMob} light-14`}>{item.sample}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

export default TableGoldBars
