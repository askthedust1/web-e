import { FC } from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { SiteSettingProps } from 'services/api/LayoutModule'
import s from './footer.module.scss'
import {
  SupportIcon,
  PhoneIcon,
  HeartIcon,
  LocationIcon,
  MailIcon,
  FacebookIcon,
  TelegramIcon,
  YoutubeIcon,
  InstagramIcon,
} from './FooterIcons'

interface Props {
  data: SiteSettingProps | null
}

const FooterContactBand: FC<Props> = ({ data }) => {
  const { t } = useTranslation()
  const phoneHref = data?.contact_center_phone
    ? data.contact_center_phone.replace(/[^\d+]/g, '')
    : ''

  return (
    <div className={s.contactBand}>
      {/* Бренд-блок 24/7 + соцсети */}
      <div className={s.contactBand__brand}>
        <div className={s.support}>
          <span className={s.support__icon}>
            <SupportIcon />
          </span>
          <span className={s.support__num}>
            <span className={s.support__small}>24/7</span>
            <b>9111</b>
          </span>
        </div>

        <div className={s.socials}>
          {data?.fb_link && (
            <a
              className={s.social}
              href={data.fb_link}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
          )}
          {data?.telegram_link && (
            <a
              className={s.social}
              href={data.telegram_link}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
          )}
          <a
            className={s.social}
            href="https://www.youtube.com/@Eldikbank"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <YoutubeIcon />
          </a>
          {data?.instagram_link && (
            <a
              className={s.social}
              href={data.instagram_link}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          )}
        </div>
      </div>

      {/* Колонка: телефон + инструкция */}
      <div className={s.contactBand__col}>
        {data?.contact_center_phone && (
          <a className={s.contactItem} href={`tel:${phoneHref}`}>
            <span className={s.contactItem__icon}>
              <PhoneIcon />
            </span>
            <span className={s.contactItem__text}>
              <span className={s.contactItem__label}>Телефон</span>
              <span className={s.contactItem__value}>
                {data.contact_center_phone}
              </span>
            </span>
          </a>
        )}

        {data?.complaint_book_manual && (
          <Link legacyBehavior href={data.complaint_book_manual} locale={false}>
            <a className={s.contactItem}>
              <span className={s.contactItem__icon}>
                <HeartIcon />
              </span>
              <span className={s.contactItem__text}>
                <span className={s.contactItem__value}>
                  {t('book_of_report')}
                </span>
              </span>
            </a>
          </Link>
        )}
      </div>

      {/* Колонка: офис + email */}
      <div className={s.contactBand__col}>
        {data?.address && (
          <a
            className={s.contactItem}
            href={data.map_link || '#'}
            target="_blank"
            rel="noreferrer"
          >
            <span className={s.contactItem__icon}>
              <LocationIcon />
            </span>
            <span className={s.contactItem__text}>
              <span className={s.contactItem__label}>{t('main_office')}</span>
              <span className={s.contactItem__value}>{data.address}</span>
            </span>
          </a>
        )}

        {data?.email && (
          <a className={s.contactItem} href={`mailto:${data.email}`}>
            <span className={s.contactItem__icon}>
              <MailIcon />
            </span>
            <span className={s.contactItem__text}>
              <span className={s.contactItem__label}>{t('email_en')}</span>
              <span className={s.contactItem__value}>{data.email}</span>
            </span>
          </a>
        )}
      </div>
    </div>
  )
}

export default FooterContactBand
