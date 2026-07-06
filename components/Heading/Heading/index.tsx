import Link from 'next/link'
import Icon from 'components/Icon'
import style from '../heading.module.scss'
import { useTranslation } from 'next-i18next'

interface Heading {
  title?: string
  link?: string
  color?: string
}

const HeadingWithNav = ({ title, link, color }: Heading) => {

  const { t } = useTranslation()


  if(title?.length === 0 ) {
    return null
  }
  return (
    <div className={style.wrapper}>
      <h2 className={`${style.title} medium-32`} style={{color: color}}>
        {title}
        {link && (
          <Link legacyBehavior href={link}>
            <a className={`${style.more} medium-16`}>
              {t('setting.all')}
              <Icon
                id="arrow-right"
                width={16}
                height={16}
                className={style.icon}
              />
            </a>
          </Link>
        )}
      </h2>
    </div>
  )
}

export default HeadingWithNav
