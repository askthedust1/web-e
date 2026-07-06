import React, { FC } from 'react'
import s from './paymentSystems.module.scss'

interface PaymentSystem {
  id: number
  name: string
  icon: string
}

interface PaymentSystemsProps {
  systems: PaymentSystem[]
  title: string
  subtitle: string
}

const PaymentSystems: FC<PaymentSystemsProps> = ({
  systems,
  title,
  subtitle,
}) => {
  return (
    <div className={s.paymentSystemsSection}>
      <h2 className={s.title}>{title}</h2>
      <p className={s.subtitle}>{subtitle}</p>
      <div className={s.systemsGrid}>
        {systems.map((system) => (
          <div key={system.id} className={s.systemCard}>
            {/* eslint-disable-next-line no-restricted-syntax -- keep raw <img>: payment-system logos include SVG; next/image needs dangerouslyAllowSVG (not enabled) */}
            <img src={system.icon} alt={system.name} className={s.systemIcon} />
            <span className={s.systemName}>{system.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PaymentSystems
