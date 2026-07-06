import React from 'react'
import AppImage from 'components/ui/AppImage'
import clsx from 'clsx'
import s from '../../../pages/vacancies/to-students/toStudents.module.scss'

interface InternshipCardProps {
  image: string
  title?: string
  text: string
  big?: boolean
  gradient?: string
  isCardBottom?: boolean
  width?: number
  height?: number
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  image,
  title,
  text,
  big,
  gradient,
  isCardBottom = false,
  width = 233,
  height = 233,
}) => (
  <div
    className={clsx(s.internshipCard, {
      [s.bigCard]: big,
      [s.rightCard]: !big,
    })}
    style={{ background: gradient }}
  >
    <div className={s.imageWrapper}>
      <AppImage
        className={s.image}
        src={image}
        alt={title || 'Иллюстрация'}
        width={width}
        height={height}
        style={{ objectFit: 'cover' }}
      />
    </div>
    <div style={{ width: isCardBottom ? '100%' : '439px' }} className={s.text}>
      {title && <h4>{title}</h4>}
      <p
        style={{
          fontWeight: big ? 'bold' : '',
          fontSize: big ? '18px' : '',
          padding: big ? '15px' : '',
        }}
      >
        {text}
      </p>
    </div>
  </div>
)

export default InternshipCard
