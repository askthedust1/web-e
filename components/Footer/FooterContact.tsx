import { useState, FC } from 'react'
import Link from 'next/link'
import style from 'components/Footer/footer.module.scss'
import { SiteSettingProps } from 'services/api/LayoutModule'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import Icon from 'components/Icon'

interface Props {
  data: SiteSettingProps | null
}

const FooterAboutBank: FC<Props> = ({ data }) => {
  const { t, i18n } = useTranslation()
  const date = new Date()
  const yearOfDate = date.getFullYear()
  const [dropDown, setDropDown] = useState(false)

  const whistleblowingPolicyHref =
    i18n.language === 'en'
      ? '/files/Whistleblowing_Policy.pdf'
      : '/files/Политика_по_информированию_о_нарушениях.pdf'

  const phoneHref = data?.contact_center_phone
    ? data.contact_center_phone.replace(/[^\d+]/g, '')
    : ''

  const IconUpDown = !dropDown ? (
    <Icon className={style.icon} id="arrow-up-thin" width={15} height={20} />
  ) : (
    <Icon className={style.icon} id="arrow-down-thin" width={15} height={20} />
  )

  return (
    <div className={style.footer__grid__item}>
      {/* Desktop */}
      <div className={style.contact__desctop}>
        <h4 className={`${style.title} regular-18`}>{t('setting.сontacts')}</h4>

        <ul className={style.list}>
          {data?.complaint_book_manual && (
            <li>
              <Link
                legacyBehavior
                href={data.complaint_book_manual}
                locale={false}
              >
                <a className={`${style.link__pdf} light-16`}>
                  {t('book_of_report')}
                </a>
              </Link>
            </li>
          )}

          <li>
            <a
              href={whistleblowingPolicyHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${style.link__pdf} light-16`}
            >
              {t('whistleblowing_policy')}
            </a>
          </li>

          {data?.contact_center_phone && (
            <li>
              <div className={`${style.label} light-12`}>
                {t('contacts_dayNigth')}
              </div>
              <a
                className={`${style.subLink} regular-16`}
                href={`tel:${phoneHref}`}
                rel="noopener noreferrer"
              >
                {data.contact_center_phone}
              </a>
            </li>
          )}

          {data?.address && (
            <li>
              <div className={`${style.label} light-12`}>
                {t('main_office')}
              </div>
              <a
                className={`${style.subLink} regular-16`}
                href={data?.map_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.address}
              </a>
            </li>
          )}

          {data?.email && (
            <li>
              <div className={`${style.label} light-12`}>{t('email_en')}</div>
              <a
                className={`${style.subLink} ${style.subLinkBlue} regular-16`}
                href={`mailto:${data.email}`}
                rel="noopener noreferrer"
              >
                {data.email}
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile */}
      <div className={style.mobContact}>
        <button
          type="button"
          onClick={() => setDropDown(!dropDown)}
          className={clsx(style.select__dropdown)}
          aria-expanded={dropDown}
          aria-controls="footer-contact-dropdown"
        >
          <p className={clsx(style.contac__title, 'medium-16')}>
            {t('setting.сontacts')} {yearOfDate}
          </p>
          {IconUpDown}
        </button>

        <ol
          id="footer-contact-dropdown"
          className={clsx(style.contact__dropdown, dropDown && style.active)}
        >
          {data?.complaint_book_manual && (
            <li className={clsx(style.liMob, 'light-14')}>
              <Link
                legacyBehavior
                href={data.complaint_book_manual}
                locale={false}
              >
                <a className={`${style.link__pdf} light-14`}>
                  {t('book_of_report')}
                </a>
              </Link>
            </li>
          )}

          {data?.contact_center_phone && (
            <li className={clsx(style.liMob, 'light-14')}>
              <div className={`${style.label} light-12`}>
                {t('contacts_dayNigth')}
              </div>
              <a
                className={`${style.subLink} regular-16`}
                href={`tel:${phoneHref}`}
                rel="noopener noreferrer"
              >
                {data.contact_center_phone}
              </a>
            </li>
          )}

          {data?.address && (
            <li className={clsx(style.liMob, 'light-14')}>
              <div className={`${style.label} light-12`}>
                {t('main_office')}
              </div>
              <a
                className={`${style.subLink} regular-16`}
                href={data?.map_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.address}
              </a>
            </li>
          )}

          {data?.email && (
            <li className={clsx(style.liMob, 'light-14')}>
              <div className={`${style.label} light-12`}>{t('email_en')}</div>
              <a
                className={`${style.subLink} ${style.subLinkBlue} regular-16`}
                href={`mailto:${data.email}`}
                rel="noopener noreferrer"
              >
                {data.email}
              </a>
            </li>
          )}
        </ol>
      </div>
    </div>
  )
}

export default FooterAboutBank
