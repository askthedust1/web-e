import Link from 'next/link'
import Image from 'next/image'
import Icon from 'components/Icon'
import style from './card-thin.module.scss'
import parse from 'html-react-parser'

interface CardThinProps {
  href?: string
  title?: string
  imagePath?: string
  isSmallTitle?: boolean
  isIcon?: boolean
  isRevert?: boolean
  desc?: string
}

const CardThin = ({
  href,
  title,
  imagePath,
  isSmallTitle = false,
  isIcon = false,
  isRevert = true,
  desc,
}: CardThinProps) => {
  return (
    <div
      className={`${style.card} ${isIcon ? style.cardIcon : ''} ${
        isRevert ? style.cardRevert : ''
      }`}
    >
      {href && (
        <Link legacyBehavior href={href}>
          <a className={style.link}></a>
        </Link>
      )}
      {!desc && isRevert && (
        <div
          className={`${style.title} ${
            isSmallTitle ? 'light-16' : 'regular-18'
          } `}
        >
          {parse(title || ' ')}
        </div>
      )}
      {desc && <h3 className="medium-20">{title}</h3>}
      <Image
        alt={title || ''}
        className={style.image}
        src={imagePath || '/'}
        width={48}
        height={48}
      />
      {desc && <div className="light-16">{parse(desc || '')}</div>}
      {!isRevert && (
        <h3
          className={`${style.title} ${
            isSmallTitle ? 'light-16' : 'regular-18'
          } `}
        >
          {title}
        </h3>
      )}
      {isIcon && (
        <Icon
          className={style.icon}
          id="arrow-right-small"
          width={24}
          height={24}
        />
      )}
    </div>
  )
}

export default CardThin
