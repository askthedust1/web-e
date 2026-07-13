import { FC } from 'react'
import { SiteSettingProps } from 'services/api/LayoutModule'
import s from './footer.module.scss'

interface Props {
  data: SiteSettingProps | null
}

const FooterBanner: FC<Props> = ({ data }) => {
  return (
    <div className={s.banner}>
      {/* Место под изображение телефонов — вставьте картинку сюда */}
      <div className={s.banner__media} />

      <div className={s.banner__content}>
        <p className={`medium-28 ${s.banner__title}`}>
          Скачивай и оплачивай
          <br />
          через приложение Eldik
        </p>

        <div className={s.banner__apps}>
          <a
            href={data?.app_store_link || '#'}
            target="_blank"
            rel="noreferrer"
            className={s.banner__app}
          >
            {/* eslint-disable-next-line no-restricted-syntax */}
            <img
              src="/images/mobile-app/appstore.svg"
              alt="App Store"
              width={150}
              height={48}
            />
          </a>
          <a
            href={data?.google_play_link || '#'}
            target="_blank"
            rel="noreferrer"
            className={s.banner__app}
          >
            {/* eslint-disable-next-line no-restricted-syntax */}
            <img
              src="/images/mobile-app/google.svg"
              alt="Google Play"
              width={150}
              height={48}
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default FooterBanner
