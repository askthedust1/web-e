import React from 'react'
import s from './numberCounter.module.scss'
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob'
import { useTranslation } from 'next-i18next'

const NumberCounter = () => {
  const { t } = useTranslation()

  const stats = [
    { value: '29 лет', label: t('job.age') },
    { value: '2500+', label: t('job.employees') },
    { value: '50+', label: t('job.vacancies') },
    { value: '1млн+', label: t('job.clients') },
  ]

  return (
    <div className={s.counterWrapper}>
      <GradientBlob
        background="linear-gradient(358deg, rgba(8,126,229,0.8) 25%, rgba(95,222,197,0.77) 71%)"
        size={500}
        top="0"
        right="50px"
        blur={300}
        zIndex={-99}
      />
      <div className={s.counterGroup}>
        {stats.map((item, index) => (
          <div className={s.counterItem} key={index}>
            <div className={s.counterValue}>{item.value}</div>
            <div className={s.counterLabel}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NumberCounter
