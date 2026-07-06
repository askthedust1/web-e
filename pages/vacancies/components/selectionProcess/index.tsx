import React from 'react'
import s from './selectionProcess.module.scss'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

const colors = [
  'rgba(35, 164, 149, 0.7)',
  'rgba(52, 76, 234, 0.7)',
  'rgba(53, 143, 199, 0.7)',
  'rgba(55, 128, 224, 0.7)',
  'rgba(0, 97, 208, 0.7)',
]

const SelectionProcessBlock = () => {
  const { t } = useTranslation()
  const steps = [
    { id: 1, text: t("job.steps.step_1") },
    { id: 2, text: t("job.steps.step_2") },
    { id: 3, text: t("job.steps.step_3") },
    { id: 4, text: t("job.steps.step_4") },
    { id: 5, text: t("job.steps.step_5"), image: '/images/vacancies/job-offer.png' }
  ];
  const leftColumn = steps.filter(step => step.id === 1 || step.id === 3)
  const rightColumn = steps.filter(step => step.id === 2 || step.id === 4)
  const largeCard = steps.find(step => step.id === 5)

  return (
    <section className={s.selectionSection}>
      <h2 className={s.title}>{t('job.selection')}</h2>
      <div className={s.grid}>
        <div className={s.column}>
          {leftColumn.map((step, _index) => (
            <div
              key={step.id}
              className={s.card}
              style={{ backgroundColor: colors[step.id - 1] }}
            >
              <span className={s.stepNumber}>{step.id}</span>
              <p className={s.text}>{step.text}</p>
            </div>
          ))}
        </div>

        <div className={s.column}>
          {rightColumn.map((step, _index) => (
            <div
              key={step.id}
              className={s.card}
              style={{ backgroundColor: colors[step.id - 1] }}
            >
              <span className={s.stepNumber}>{step.id}</span>
              <p className={s.text}>{step.text}</p>
            </div>
          ))}
        </div>

        {largeCard && (
          <div
            className={s.cardLarge}
            style={{ backgroundColor: colors[largeCard.id - 1] }}
          >
            <div className={s.contentRow}>
              <span className={s.stepNumber}>{largeCard.id}</span>
              <p className={s.text}>{largeCard.text}</p>
            </div>

            {largeCard.image && (
              <div className={s.imageWrapper}>
                <Image src={largeCard.image} alt="Иллюстрация предложения о работе"
                       width={700}
                       height={700}
                       sizes="100vw"
                       style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default SelectionProcessBlock
