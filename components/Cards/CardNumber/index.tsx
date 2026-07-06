import style from './card-number.module.scss'
import { FC } from 'react'

interface CardNumberProps {
  title?: string
  step?: number
}

const CardNumber: FC<CardNumberProps> = ({ title, step }: CardNumberProps) => {
  return (
    <div className={`${style.card} g-t-60`}>
      <h6 className={`${style.step} medium-40`}>0{step}</h6>
      <p className={`${style.title}' light-16 `}>{title}</p>
    </div>
  )
}

export default CardNumber
