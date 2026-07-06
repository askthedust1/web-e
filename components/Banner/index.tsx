import { FC } from 'react'
import Container from 'components/Container'
import Button from 'components/Buttons/Button'
import parse from 'html-react-parser'
import style from './banner.module.scss'
import clsx from 'clsx'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'next-i18next'
interface BannerProps {
  badge?: boolean
  isReques?: boolean
  title?: string
  subtitle?: string
  linkObj?: {
    pathname: string
    query: { type: string; for_who?: string | string[] }
  }
  link?: string
  linkText?: string
  imagePath?: string
  imagePathMobile?: string
  appstore?: string
  googleplay?: string
  banner_bg?: string
  banner_bg_mob?: string
  banner_title_hex?: string
  banner_subtitle_hex?: string
  onButtonClick?: () => void
}

const Banner: FC<BannerProps> = ({
  linkObj,
  badge = true,
  title = '',
  subtitle = '',
  link = '',
  linkText = '',
  imagePath,
  imagePathMobile,
  appstore,
  googleplay,
  isReques = false,
  banner_bg,
  banner_bg_mob,
  banner_title_hex = '',
  banner_subtitle_hex = '',
  onButtonClick,
}: BannerProps) => {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const imageShow = !isMobile ? imagePath : imagePathMobile
  const { t } = useTranslation()

  const Buttons = onButtonClick
    ? badge && (
        <Button
          onClick={onButtonClick}
          className={style.button}
          value={linkText}
        />
      )
    : link
      ? link &&
        badge && (
          <Button href={link} className={style.button} value={linkText} />
        )
      : linkObj &&
        badge &&
        isReques && (
          <Button
            hrefLink={linkObj}
            className={style.button}
            value={t('setting.button_request')}
          />
        )
  const ButtonsMob = onButtonClick
    ? badge && (
        <Button
          onClick={onButtonClick}
          className={style.buttonMboile}
          value={linkText}
        />
      )
    : link
      ? link &&
        badge && (
          <Button
            href={link || ''}
            className={style.buttonMboile}
            value={linkText}
          />
        )
      : linkObj &&
        badge &&
        isReques && (
          <Button
            hrefLink={linkObj}
            className={style.buttonMboile}
            value={t('setting.button_request')}
          />
        )

  return (
    <div className={`${style.wrapper} ${style.wrapper2}`}>
      {banner_bg && (
        <div className={style.desc}>
          {/* eslint-disable-next-line no-restricted-syntax -- admin-uploaded banner bg from API may be SVG; next/image can't render SVG (dangerouslyAllowSVG off) */}
          <img
            className={style.bgImg}
            alt={`${title}-bg`}
            src={banner_bg}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
            }}
          />
        </div>
      )}
      {banner_bg_mob && (
        <div className={style.mob}>
          {/* eslint-disable-next-line no-restricted-syntax -- admin-uploaded banner bg from API may be SVG; next/image can't render SVG (dangerouslyAllowSVG off) */}
          <img
            className={style.mobImg}
            alt={`${title}-bg-mob`}
            src={banner_bg_mob}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
            }}
          />
        </div>
      )}

      <Container>
        <div className={style.grid}>
          <div>
            {!badge && (
              <div className={`${style.badge} light-12`}>
                {t('pages_names.time_cross')}
              </div>
            )}
            <h2
              style={{ color: banner_title_hex }}
              className={`${style.title} medium-40`}
            >
              {title}{' '}
            </h2>
            {subtitle && (
              <div
                style={{ color: ` ${banner_subtitle_hex}` }}
                className={clsx(style.subtitle, 'light-18')}
              >
                {parse(subtitle)}{' '}
              </div>
            )}
            {(appstore || googleplay) && (
              <div className={style.gridApps}>
                <a
                  href={googleplay}
                  target="_blank"
                  rel="noreferrer"
                  className={style.app__link}
                >
                  {/* eslint-disable-next-line no-restricted-syntax -- SVG src; next/image can't render SVG (dangerouslyAllowSVG off) */}
                  <img
                    alt={`${title}-google`}
                    src="/images/mobile-app/google.svg"
                    width={160}
                    height={52}
                  />
                </a>
                <a
                  href={appstore}
                  target="_blank"
                  rel="noreferrer"
                  className={style.app__link}
                >
                  {/* eslint-disable-next-line no-restricted-syntax -- SVG src; next/image can't render SVG (dangerouslyAllowSVG off) */}
                  <img
                    alt={`${title}-mob`}
                    src="/images/mobile-app/appstore.svg"
                    width={160}
                    height={52}
                  />
                </a>
              </div>
            )}
            {Buttons}
          </div>
          {imageShow && (
            <div className={style.img}>
              {/* eslint-disable-next-line no-restricted-syntax -- admin-uploaded banner image from API may be SVG; next/image can't render SVG (dangerouslyAllowSVG off) */}
              <img
                alt={`${title}`}
                className={style.img}
                src={imageShow}
                width={!isMobile ? 505 : 260}
                height={!isMobile ? 450 : 310}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          )}
          {ButtonsMob}
        </div>
      </Container>
    </div>
  )
}

export default Banner
