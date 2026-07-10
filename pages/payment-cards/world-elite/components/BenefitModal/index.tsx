import { useEffect } from 'react'
import Image from 'next/image'
import { Benefit } from '../Benefits/benefits.data'
import style from './benefit-modal.module.scss'

interface Props {
  benefit: Benefit | null
  onClose: () => void
}

const BenefitModal = ({ benefit, onClose }: Props) => {
  useEffect(() => {
    if (!benefit) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [benefit, onClose])

  if (!benefit) return null

  return (
    <div className={style.overlay} onClick={onClose}>
      <div
        className={style.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={benefit.title}
      >
        <button className={style.close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className={style.icon}>
          <Image
            src={benefit.icon}
            alt={benefit.title}
            width={130}
            height={130}
          />
        </div>

        <div className={`medium-20 ${style.titleBanner}`}>{benefit.title}</div>

        <p className={`regular-15 ${style.intro}`}>{benefit.intro}</p>

        {benefit.sections.map((section) => (
          <div className={style.section} key={section.title}>
            <p className={`medium-16 ${style.sectionTitle}`}>{section.title}</p>
            <p className={`regular-15 ${style.sectionText}`}>{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BenefitModal
