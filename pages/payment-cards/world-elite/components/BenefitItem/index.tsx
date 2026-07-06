import clsx from 'clsx'
import style from './benefit-item.module.scss'

interface Props {
  icon: React.ReactNode
  title: string
  desc: string
  reverse?: boolean
}

const BenefitItem = ({ icon, title, desc, reverse = false }: Props) => {
  return (
    <div className={clsx(style.wrapper, reverse && style.reverse)}>
      <div className={style.icon}>{icon}</div>
      <div className={style.text}>
        <p className={clsx('medium-18', style.title)}>{title}</p>
        <p className={clsx('regular-15', style.desc)}>{desc}</p>
      </div>
    </div>
  )
}

export default BenefitItem
