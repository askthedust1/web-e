import clsx from 'clsx'
import Image from 'next/image'
import style from './benefit-item.module.scss'

interface Props {
  icon: string
  title: string
  desc: string
  reverse?: boolean
  onClick?: () => void
}

const BenefitItem = ({ icon, title, desc, reverse = false, onClick }: Props) => {
  return (
    <button
      type="button"
      className={clsx(style.wrapper, reverse && style.reverse)}
      onClick={onClick}
    >
      <div className={style.icon}>
        <Image src={icon} alt={title} width={130} height={130} />
      </div>
      <div className={style.text}>
        <p className={clsx('medium-18', style.title)}>{title}</p>
        <p className={clsx('regular-15', style.desc)}>{desc}</p>
      </div>
    </button>
  )
}

export default BenefitItem
