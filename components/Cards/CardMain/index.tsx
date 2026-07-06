import Link from 'next/link'
import Image from 'next/image'
import Button from 'components/Buttons/Button'
import style from './card-main.module.scss'
import { useRouter } from 'next/router'
import { linkPath } from 'helpers/changeTypeOfUse'
import { useTranslation } from 'next-i18next'

interface item {
  badge?: string
  id: number
  image: string
  title: string
  tag: string
  desc: string
  link: string
}

interface CardProps {
  href: string
  item: item
  imageWidth: number
  imageHeight: number
  buttonText?: string
}

const CardMain = ({
  href,
  item,
  imageWidth,
  imageHeight,
  buttonText,
}: CardProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className={style.card}>
      <div className={style.imageWrapper}>
        <Link legacyBehavior href={href || linkPath(item?.link, router)}>
          <a className={style.link} />
        </Link>
        <div className={`${style.badge} light-12`}>{item?.tag}</div>
        <Image
          alt={item?.title || ''}
          className={style.image}
          src={item?.image}
          width={imageWidth}
          height={imageHeight}
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 50vw, 33vw"
        />
      </div>
      <div className={style.info}>
        <h3 className={`${style.title} medium-20`}>{item?.title}</h3>
        <p className={`${style.desc} light-16`}>{item?.desc}</p>
        <div>
          <Button
            value={buttonText || t("setting.button_more")}
            href={href || linkPath(item?.link, router)}
            isOutline
          />
        </div>
      </div>
    </div>
  )
}

export default CardMain
