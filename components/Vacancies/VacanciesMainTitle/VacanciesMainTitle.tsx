import React, { FC } from 'react'
import s from 'pages/vacancies/components/vacanciesBanner/vacanciesBanner.module.scss'

interface Props {
  basicText: string,
  gradientText: string | JSX.Element,
}

const VacanciesMainTitle: FC<Props> = ({basicText, gradientText}) => {
  return (
    <h1 className={s.careerTitle}>
      {basicText} <br />
      <span className={s.textGradient}>{gradientText}</span>
    </h1>
  )
}

export default VacanciesMainTitle