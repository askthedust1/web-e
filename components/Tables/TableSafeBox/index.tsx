import Section from 'components/Section'
import style from './table-safe.module.scss'
import { useState, FC } from 'react'
import CarouselNavigation from 'components/Carousels/CarouselNavigation'


interface TableSafeProps {
  id: number
  title: string
  prices: {
    id: number
    measure: string
    price: string
    percent: string
  }[]
}

interface Props {
  data: TableSafeProps[]
}
const TableSafeBox: FC<Props> = ({ data }) => {
  const [state, setState] = useState<number>(data[0]?.id)
  const allTables = data?.filter((item) => item?.id === state)[0]?.prices

  const onClickTab = (id: number) => {
    setState(id)
  }

  return (
    <div>
      <Section>
        <div className={style.navigation}>
          <CarouselNavigation
            navigation={data}
            onClick={onClickTab}
            activeTab={state}
          />
        </div>
        <table className={style.table}>
          <thead>
            <tr className={style.tr}></tr>
          </thead>
          <tbody>
            {allTables?.map((item) => (
              <tr className={style.tr} key={item.id}>
                <td className={`${style.td} light-16`}>{item?.measure}</td>
                <td className={`${style.td} light-16`}>{item?.price}</td>
                <td className={`${style.td} light-16`}>{item?.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  )
}

export default TableSafeBox
