import Container from 'components/Container'
import Icon from 'components/Icon'
import clsx from 'clsx'
import style from './contact.module.scss'
import { FC } from 'react'
import { SiteSettingProps } from 'services/api/LayoutModule'
import { useTranslation } from 'next-i18next'

interface Props {
  contact: SiteSettingProps | null
  dark?: boolean
}

const Contact: FC<Props> = ({ contact, dark = false }) => {
  const { t } = useTranslation()

  return (
    <div className={clsx(style.section, dark && style.dark)}>
      <Container>
        <div className={style.side}>
          <div className={style.side__left}>
            {contact?.contact_center_phone && (
              <a
                className={style.action}
                target="_blank"
                href={`tel:${contact.contact_center_phone.replace(/[^\d+]/g, '')}`}
                rel="noopener noreferrer"
              >
                <Icon
                  id="headphone"
                  width={24}
                  height={24}
                  className={`${style.icon} ${style.icon__headphone}`}
                />
                <div>
                  <div className={`${style.action__label} light-16`}>
                    {t('contacts_dayNigth')}
                  </div>
                  <div className={`${style.action__value} regular-18`}>
                    {contact.contact_center_phone}
                  </div>
                </div>
              </a>
            )}
            {/*<a*/}
            {/*  className={style.action}*/}
            {/*  target="_blank"*/}
            {/*  href={`tel: ${contact?.trust_phone.replace(*/}
            {/*    /[^\d]/g,*/}
            {/*    ''*/}
            {/*  )}`}*/}
            {/*  rel="noopener noreferrer"*/}
            {/*>*/}
            {/*  <Icon*/}
            {/*    id="call"*/}
            {/*    width={24}*/}
            {/*    height={24}*/}
            {/*    className={`${style.icon} ${style.icon__call}`}*/}
            {/*  />*/}
            {/*  <div>*/}
            {/*    <div className={`${style.action__label} light-16`}>*/}
            {/*      {t('trust_phone')}*/}
            {/*    </div>*/}
            {/*    <div className={`${style.action__value} regular-18`}>*/}
            {/*      {contact?.trust_phone}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</a>*/}
            {contact?.whatsapp_number && (
              <a
                className={style.action}
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=${contact.whatsapp_number.replace(
                  /[^\d]/g,
                  ''
                )}`}
                rel="noopener noreferrer"
              >
                <Icon
                  id="whatsapp"
                  width={24}
                  height={24}
                  className={`${style.icon} ${style.icon__whatsapp}`}
                />
                <div>
                  <div className={`${style.action__label} light-16`}>
                    WhatsApp
                  </div>
                  <div className={`${style.action__value} regular-18`}>
                    {contact.whatsapp_number}
                  </div>
                </div>
              </a>
            )}
          </div>
          <div className={style.side__right}>
            {contact?.fb_link && (
              <a
                className={style.social}
                target="_blank"
                href={contact.fb_link}
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Icon
                  id="facebook"
                  width={32}
                  height={32}
                  className={style.icon}
                />
              </a>
            )}
            <a
              className={style.social}
              target="_blank"
              href="https://www.youtube.com/@Eldikbank"
              rel="noopener noreferrer"
              style={{ height: 32 }}
              aria-label="YouTube"
            >
              <div className={style.svg_container}>
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M16.502 0C7.6654 0 0.501953 7.16344 0.501953 16C0.501953 24.8366 7.6654 32 16.502 32C25.3385 32 32.502 24.8366 32.502 16C32.502 7.16344 25.3385 0 16.502 0ZM23.1697 10.4996C23.904 10.7011 24.4824 11.2948 24.6786 12.0488C25.0353 13.4154 25.0353 16.2667 25.0353 16.2667C25.0353 16.2667 25.0353 19.1179 24.6786 20.4845C24.4824 21.2385 23.904 21.8323 23.1697 22.0339C21.8389 22.4 16.502 22.4 16.502 22.4C16.502 22.4 11.165 22.4 9.83412 22.0339C9.09977 21.8323 8.52144 21.2385 8.32518 20.4845C7.96862 19.1179 7.96862 16.2667 7.96862 16.2667C7.96862 16.2667 7.96862 13.4154 8.32518 12.0488C8.52144 11.2948 9.09977 10.7011 9.83412 10.4996C11.165 10.1333 16.502 10.1333 16.502 10.1333C16.502 10.1333 21.8389 10.1333 23.1697 10.4996Z"
                        fill="#97A3B7" />
                  <path d="M14.9019 19.2V13.8667L19.1685 16.5335L14.9019 19.2Z" fill="#97A3B7" />
                </svg>
              </div>
            </a>
            {contact?.instagram_link && (
              <a
                className={style.social}
                target="_blank"
                href={contact.instagram_link}
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Icon
                  id="instagram"
                  width={32}
                  height={32}
                  className={style.icon}
                />
              </a>
            )}
            {contact?.telegram_link && (
              <a
                className={style.social}
                target="_blank"
                href={contact.telegram_link}
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <Icon
                  id="telegram"
                  width={32}
                  height={32}
                  className={style.icon}
                />
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Contact
