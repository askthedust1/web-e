import React, { FC } from 'react'
import AppImage from 'components/ui/AppImage'
import s from './stepsCard.module.scss'

interface Step {
  id: number
  title: string
  icon: string
}

interface StepsCardProps {
  steps: Step[]
  title?: string
}

const StepsCard: FC<StepsCardProps> = ({ steps, title }) => {
  return (
    <div className={s.stepsSection}>
      {title && <h2 className={s.title}>{title}</h2>}
      <div className={s.stepsContainer}>
        {steps.map((step, index) => (
          <div key={step.id} className={s.stepCard}>
            <div className={s.stepIcon} style={{ marginBottom: 20 }}>
              <AppImage
                src={step.icon}
                alt={step.title}
                width={110}
                height={110}
                style={{ width: '110px', height: 'auto' }}
              />
            </div>
            <div className={s.stepContent}>
              <span className={s.stepLabel}>Шаг {index + 1}</span>
              <div className={s.stepTitle}>{step.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepsCard
