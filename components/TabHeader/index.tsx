import { FC } from 'react'
import clsx from 'clsx'
import s from './tab-header.module.scss'

interface Props {
  titles: {
    title: string
    id: number
  }[]
  setTabActive(id: number): void
  tabActive: number
}

const TabHeader: FC<Props> = ({ titles, setTabActive, tabActive }) => {
  return (
    <div className={s.tabWrapper}>
      <div className={s.tabContainer}>
        {titles?.map((item) => (
          <div
            onClick={() => setTabActive(item.id)}
            key={item.id}
            className={clsx(
              s.tab,
              'light-18',
              item.id === tabActive && s.tabActive
            )}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabHeader
