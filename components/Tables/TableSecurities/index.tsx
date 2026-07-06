import Section from 'components/Section'
import React, { FC } from 'react'
import Heading from "components/Heading/Heading";
import style from "./table-securities.module.scss"
interface TableSecuritiesProps {
  title?: string,
  data: {
    id: number,
    condition: string,
    tariff: string,
  }[]
  titles: string[]
}

const TableSecurities: FC<TableSecuritiesProps> = ({ title, data, titles }: TableSecuritiesProps) => {
  
  return (
    <Section >
      <Heading title={title} />
      <div className={style.tableWrapper}>
      <table className={style.table}>
        <thead>
          <tr className={style.tr}>
            {titles?.map((item) => (
              <th key={item} className={`${style.th} light-16`}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className={style.tr} key={item.id}>
              <td className={`${style.td} light-16`}>{item.condition}</td>
              <td className={`${style.td} light-16`}>{item.tariff}</td>

            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Section>
  )
}

export default TableSecurities