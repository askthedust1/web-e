import React from 'react'
import s from 'pages/vacancies/components/vacancies/vacancyBlock.module.scss'
import { useTranslation } from 'next-i18next'

const NoVacancies = () => {
  const { t } = useTranslation()

  return (
    <div className={s.noVacancies}>
      {/* eslint-disable-next-line no-restricted-syntax -- SVG src; next/image can't render SVG (dangerouslyAllowSVG off) */}
      <img
        src="/images/vacancies/noresults.svg"
        width={208}
        height={208}
        alt="no results"
        style={{ alignSelf: 'center' }}
      />
      <p>{t('job.no_vacancies')}</p>
    </div>
  )
}

export default NoVacancies
