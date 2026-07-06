import { FC } from 'react'
import s from './value.module.scss'
import { StaticImageData } from 'next/image'
import AppImage from 'components/ui/AppImage'
import clsx from 'clsx'

interface ValueCardProps {
  title: string
  description: string
  width?: string
  color?: string
  className?: string
  image?: StaticImageData | string
}

const ValueCard: FC<ValueCardProps> = ({
  title,
  description,
  width,
  color,
  className,
  image,
}) => {
  return (
    <div
      className={`${s.valueCard}  ${className ? s[className] : ''}`}
      style={{
        width,
        backgroundColor: color,
      }}
    >
      <div className={clsx(s.face, s.faceFront)}>
        {image && (
          <div className={s.imageWrapper}>
            <AppImage
              src={image}
              alt="Value image"
              className={s.cardImage}
              width={150}
              height={150}
              style={{ objectFit: 'cover', zIndex: 0 }}
            />
          </div>
        )}
        <h3 className={s.valueTitle}>{title}</h3>
      </div>

      <div
        className={clsx(s.face, s.faceBack)}
        style={{ marginTop: className !== 'cardThree' ? 'auto' : '' }}
      >
        <p className={s.valueDescription}>{description}</p>
      </div>
    </div>
  )
}

export default ValueCard
