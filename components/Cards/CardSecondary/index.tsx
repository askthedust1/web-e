import Link from 'next/link'
import Image from 'next/image'
import style from './card-secondary.module.scss'
import { format } from 'date-fns'
interface item {
  id: number
  image?: string
  title: string

  published_at?: string
  created_at?: string
  desc?: string
  link?: string
  price?: string
  min_pay?: string
  main_image?: {
    id: number
    image: string
    is_main: boolean
  }
}

interface CardProps {
  href: {
    pathname: string
    query: { slug: string }
  }
  item: item
  imageWidth: number
  imageHeight: number
  isProperty?: boolean
}
import { ru } from 'date-fns/locale'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
const CardSecondary = ({
  href,
  item,
  imageWidth,
  imageHeight,
  isProperty = false,
}: CardProps) => {
  const { t } = useTranslation()
  const timeFormat =
    item.published_at || item.created_at
      ? format(
          new Date(item.published_at || (item.created_at as string)),
          'dd MMMM y',
          {
            locale: ru,
          }
        )
      : ''

  return (
    <div className={style.card}>
      <Link legacyBehavior href={href}>
        <a className={style.link} />
      </Link>
      <Image
        alt={item?.title || ''}
        className={style.image}
        src={!isProperty ? item?.image || '/' : item?.main_image?.image || '/'}
        width={imageWidth}
        height={imageHeight}
        sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 50vw, 33vw"
      />
      {isProperty ? (
        <div className={style.info}>
          <h3 className={`${style.title} regular-20`}>{item?.title}</h3>
          <div className={style.decs}>
            <div className={style.short}>
              <p className={clsx(style.key, 'light-12')}>{t('object_cost')}</p>
              <p className={clsx(style.value, 'medium-18 ')}>{item.price}</p>
            </div>
            <div className={style.short}>
              <p className={clsx(style.key, 'light-12')}>{t('minimal_dep')}</p>
              <p className={clsx(style.value, 'medium-18 ')}>{item.min_pay} </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={style.info}>
          <div className={`${style.date} light-14`}>{timeFormat}</div>
          <h3 className={`${style.title} regular-20`}>{item?.title}</h3>
        </div>
      )}
    </div>
  )
}

export default CardSecondary
