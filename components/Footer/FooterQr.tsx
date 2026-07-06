import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import { FC, useState } from 'react'
import { SiteSettingProps } from 'services/api/LayoutModule'
import s from './footer.module.scss'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import PopUp from 'components/PopUp'
interface Props {
  data: SiteSettingProps | any
}
const FooterQr: FC<Props> = ({ data }) => {
  const { t } = useTranslation()
  const [isQr, setQr] = useState(false)

  return (
    <div className={s.footerQr}>
      {isQr && <PopUp closeModalQr={() => setQr(false)} qr={data?.qr} />}
      <Container>
        <div className={s.QrContainer}>
          <div className={s.linksQr}>
            <div className={s.apps}>
              <a
                href={data?.google_play_link}
                target="_blank"
                rel="noreferrer"
                className={s.app__link}
              >
                {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
                <img
                  alt="Google Play"
                  src="/images/mobile-app/google.svg"
                  width={130}
                  height={43}
                />
              </a>

              <a
                href={data?.app_store_link}
                target="_blank"
                rel="noreferrer"
                className={s.app__link}
              >
                {/* eslint-disable-next-line no-restricted-syntax -- SVG: next/image can't optimize SVG (no dangerouslyAllowSVG); vectors need no optimization */}
                <img
                  alt="App Store"
                  src="/images/mobile-app/appstore.svg"
                  width={130}
                  height={43}
                />
              </a>
            </div>
            {data?.qr && (
              <>
                {' '}
                <p className={clsx(s.qrTitle, 'light-12')}>{t('qr')}</p>
                <div className={s.qr} onClick={() => setQr(true)}>
                  <p className={clsx(s.qrTitleMob, 'light-12')}>{t('qr')}</p>
                  <AppImage
                    alt={data?.id}
                    src={data?.qr || '/asd'}
                    width={30}
                    height={30}
                  />
                </div>{' '}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default FooterQr
