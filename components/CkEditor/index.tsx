import React, { FC, useEffect, useState } from 'react'
import Button from 'components/Buttons/Button'
import Container from 'components/Container'
import style from './ck-editor.module.scss'
import parse, { attributesToProps, Element } from 'html-react-parser'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { isMobile, openDeepLink } from '../../helpers/openDeepLink'

interface CkEditorProps {
  title?: string
  caption?: string
  description?: string
  link?:
    | {
        pathname: string
        query: any
      }
    | string
    | null
    | (() => void)
  linkBlue?: string
  shorts?: {
    id: number
    key: string
    value: string
  }[]
  is_available?: boolean
  isBanner?: boolean
  linkText?: string
  cut_desc?: string
  link_text?: string
  issuance?: string
  annual_service?: string
  onOpenModal?: () => void
  onOpenInfoModal?: () => void
  currencies?: string
  card_expiration_date?: string
}

// CKEditor body HTML can embed full-size <img>. We can't route them through
// next/image (dimensions and host are unknown for arbitrary editor content),
// but we lazy-load and constrain them so they don't block initial paint or
// overflow the viewport on mobile (CCONV-1550).
const renderRichText = (html: string) =>
  parse(html, {
    replace: (node) => {
      if (node instanceof Element && node.name === 'img') {
        const props = attributesToProps(node.attribs)
        return (
          // eslint-disable-next-line no-restricted-syntax -- CKEditor body image: dynamic HTML, unknown size; lazy-loaded + constrained
          <img
            {...props}
            loading="lazy"
            decoding="async"
            style={{
              ...(props.style as React.CSSProperties),
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        )
      }
      return undefined
    },
  })

// SVG иконки
const IssueCardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8H20V18ZM20 6H4V6H20ZM6 10H12V12H6V10ZM6 14H16V16H6V14Z"
      fill="currentColor"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10Z"
      fill="currentColor"
    />
  </svg>
)

const CurrencyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z"
      fill="currentColor"
    />
  </svg>
)

const CkEditor: FC<CkEditorProps> = ({
  cut_desc,
  linkText,
  title = '',
  caption = '',
  description = '',
  link,
  shorts,
  linkBlue,
  is_available = true,
  isBanner,
  link_text: _link_text,
  issuance,
  annual_service,
  onOpenModal,
  onOpenInfoModal,
  currencies,
  card_expiration_date,
}: CkEditorProps) => {
  const { t } = useTranslation()

  const [isMobileClient, setIsMobileClient] = useState(false)

  useEffect(() => {
    setIsMobileClient(isMobile())
  }, [])

  const isCreditLink =
    typeof link === 'object' && link?.pathname === '/online-credit'

  const hrefLink = isMobileClient && isCreditLink ? null : link

  const onClick =
    isMobileClient && isCreditLink ? () => openDeepLink() : undefined

  const isVisaInfiniteOrBusiness =
    title?.includes('Visa Infinite') ||
    title?.includes('Visa Business') ||
    title?.includes('ЭЛКАРТ Бизнес')

  return (
    <Container>
      <div
        className={clsx(style.wrapper, isBanner && style.isBanner, 'forVisual')}
      >
        {!is_available && (
          <div className={`${style.badge} light-12`}>
            {t('pages_names.time_cross')}
          </div>
        )}
        <h2>{title}</h2>
        {renderRichText(caption)}
        {renderRichText(description)}
        {cut_desc}
      </div>

      <div className={style.grid}>
        {shorts &&
          shorts.slice(0, 3).map((item) => (
            <div className={style.info} key={item.id}>
              <p className={`${style.value} medium-16`}>{item.value}</p>
              <p className={`${style.title} light-14`}>{item.key}</p>
            </div>
          ))}
      </div>

      {(issuance || card_expiration_date) &&
        (annual_service || card_expiration_date) && (
          <div className={style.featuresGrid}>
            {issuance && (
              <div className={style.featureItem}>
                <div className={style.iconTextRow}>
                  <div className={style.iconWrapper}>
                    <IssueCardIcon />
                  </div>
                  <div className={style.textContent}>
                    <span className={`${style.featureTitle} light-14`}>
                      {t('forms.card.features.issuance')}
                    </span>
                    <span className={`${style.featureValue} medium-16`}>
                      {issuance}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {card_expiration_date && (
              <div className={style.featureItem}>
                <div className={style.iconTextRow}>
                  <div className={style.iconWrapper}>
                    <CalendarIcon />
                  </div>
                  <div className={style.textContent}>
                    <span className={`${style.featureTitle} light-14`}>
                      {t('forms.card.features.expiration')}
                    </span>
                    <span className={`${style.featureValue} medium-16`}>
                      {card_expiration_date}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {annual_service && (
              <div className={style.featureItem}>
                <div className={style.iconTextRow}>
                  <div className={style.iconWrapper}>
                    <CalendarIcon />
                  </div>
                  <div className={style.textContent}>
                    <span className={`${style.featureTitle} light-14`}>
                      {t('forms.card.features.annual_service')}
                    </span>
                    <span className={`${style.featureValue} medium-16`}>
                      {annual_service}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {currencies && (
              <div className={style.featureItem}>
                <div className={style.iconTextRow}>
                  <div className={style.iconWrapper}>
                    <CurrencyIcon />
                  </div>
                  <div className={style.textContent}>
                    <span className={`${style.featureTitle} light-14`}>
                      {t('forms.card.features.currency')}
                    </span>
                    <span className={`${style.featureValue} medium-16`}>
                      {currencies}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      {(link || linkBlue) && (
        <div className={style.buttons}>
          {isVisaInfiniteOrBusiness && (
            <Button
              value={linkText || t('setting.button_request')}
              hrefLink={null}
              onClick={onOpenInfoModal}
              isLarge
              isBlue
            />
          )}
          {link &&
            (() => {
              if (isVisaInfiniteOrBusiness) {
                return (
                  <>
                    <Button
                      value={linkText || t('setting.button_request')}
                      hrefLink={null}
                      onClick={onOpenInfoModal}
                      isLarge
                      isBlue
                    />
                  </>
                )
              } else {
                return (
                  <>
                    <Button
                      value={linkText || t('setting.button_request')}
                      hrefLink={hrefLink}
                      onClick={onClick}
                      isLarge
                      isBlue
                    />
                  </>
                )
              }
            })()}
          {linkBlue &&
            (() => {
              if (isVisaInfiniteOrBusiness) {
                return (
                  <Button
                    value={t('setting.button_more')}
                    href={linkBlue}
                    onClick={undefined}
                    isLarge
                    isOutline
                  />
                )
              }

              if (issuance || annual_service) {
                return (
                  <Button
                    value={t('setting.button_more')}
                    href={undefined}
                    onClick={onOpenModal}
                    isLarge
                    isOutline
                  />
                )
              }

              return (
                <Button
                  value={t('setting.button_more')}
                  href={linkBlue}
                  onClick={undefined}
                  isLarge
                  isOutline
                />
              )
            })()}
        </div>
      )}
    </Container>
  )
}

export default CkEditor
