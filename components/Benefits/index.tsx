import React, { FC } from 'react'
import s from './benefits.module.scss'

interface Benefit {
  id: number
  text: string
  icon: string
}

interface BenefitsProps {
  benefits: Benefit[]
  title: string
}

const Benefits: FC<BenefitsProps> = ({ benefits, title }) => {
  return (
    <div className={s.benefitsSection}>
      <h2 className={s.title}>{title}</h2>
      <div className={s.benefitsGrid}>
        {benefits.map((benefit) => (
          <div key={benefit.id} className={s.benefitCard}>
            <div className={s.iconWrapper}>
              {/* eslint-disable-next-line no-restricted-syntax -- keep raw <img>: icons are SVG; next/image needs dangerouslyAllowSVG (not enabled) */}
              <img
                src={benefit.icon}
                width={60}
                height={60}
                alt={benefit.icon}
              />
            </div>
            <p className={s.benefitText}>{benefit.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Benefits
