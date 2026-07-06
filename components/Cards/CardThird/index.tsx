import Image from 'next/image'
import style from './card-third.module.scss'
import { FC, useEffect, useState } from 'react'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { linkPath } from 'helpers/changeTypeOfUse'
import { isMobile, openDeepLink } from 'helpers/openDeepLink'

interface Items {
  id: number
  image?: string
  title: string
  link?: string
  desc: string
  icon?: string
}

interface CardThirdProps {
  item: Items
}

const CardThird: FC<CardThirdProps> = ({ item }) => {
  const router = useRouter()

  const [isMobileClient, setIsMobileClient] = useState(false)

  useEffect(() => {
    setIsMobileClient(isMobile())
  }, [])

  const isCreditLink = item.link === '/online-credit'

  const handleClick = (e: any) => {
    if (isMobileClient && isCreditLink) {
      e.preventDefault()
      e.stopPropagation()
      openDeepLink()
    }
  }

  const resolvedLink =
    isCreditLink && isMobileClient
      ? '#'
      : linkPath(item.link ?? '', router) || '/'

  return (
    <div className={style.card}>
      {item.link && (
        <a href={resolvedLink} onClick={handleClick} className={style.link} />
      )}

      <div className={style.image}>
        {item && (
          <Image
            alt={item?.title}
            className={style.img}
            src={item?.image || item.icon || '/'}
            width={100}
            height={76}
          />
        )}
      </div>

      <h3 className={`${style.title} medium-18`}>{item.title}</h3>

      <div className={`${style.desc} light-14`}>{parse(item.desc)}</div>
    </div>
  )
}

export default CardThird
