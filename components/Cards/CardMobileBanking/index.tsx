import React, { FC, useEffect } from 'react'
import AppImage from 'components/ui/AppImage'
import style from './card-mobile-banking.module.scss'
import { useMediaQuery } from 'react-responsive'
interface Array {
  title: string
  id: number
  icon: string
}

interface dataProps {
  app_store_link: string
  background: string
  google_play_link: string
  id: number
  image: string
  title: string
  infos: Array[]
}
interface CardMobileBankingProps {
  data: dataProps
}

const CardMobileBanking: FC<CardMobileBankingProps> = ({
  data,
}: CardMobileBankingProps) => {
  const isMobile = useMediaQuery({ maxWidth: 640 })

  const [isVisible, setIsVisible] = React.useState<boolean>(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={style.card}>
      <AppImage
        className={style.backgroundImage}
        src={data?.background || '/default_image_path'}
        fill
        style={{ objectFit: 'cover', objectPosition: '30% 30%' }}
        sizes="(max-width: 960px) 100vw, 50vw"
        alt={data?.title || ''}
      />

      <div className={style.gridSide}>
        <div className={style.gridSideLeft}>
          <h3 className={`${style.title} medium-32`}>{data?.title}</h3>
          <ul className={style.list}>
            {data?.infos.map((item) => (
              <li
                className={`${style.list__item} light-16 color-white`}
                key={item.id}
              >
                <div className={style.image}>
                  <AppImage
                    src={item.icon || '/'}
                    width={26}
                    height={26}
                    alt={`${data?.title}-main`}
                  />
                </div>
                {item.title}
              </li>
            ))}
          </ul>
          <div className={style.grid}>
            <a
              href={data?.google_play_link}
              target="_blank"
              rel="noreferrer"
              className={style.app__link}
            >
              {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
              <img
                src="/images/mobile-app/google.svg"
                width={160}
                height={52}
                alt={`${data?.title}-google`}
              />
            </a>
            <a
              href={data?.app_store_link}
              target="_blank"
              rel="noreferrer"
              className={style.app__link}
            >
              {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
              <img
                src="/images/mobile-app/appstore.svg"
                width={160}
                height={52}
                alt={`${data?.title}-appstore`}
              />
            </a>
          </div>
        </div>
        {isVisible && !isMobile && (
          <div className={style.gridSideRight}>
            {data?.image && (
              <AppImage
                src={data?.image}
                width={245}
                height={500}
                alt={`${data?.title}-m`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardMobileBanking
