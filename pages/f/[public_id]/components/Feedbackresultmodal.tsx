import clsx from 'clsx'
import Button from 'components/Buttons/Button'
import { useTranslation } from 'next-i18next'
import React, { FC } from 'react'
import { useRouter } from 'next/router'
import s from '/components/PopUp/pop-up.module.scss'
import Modal from 'components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose(): void
  popUpButton?(): void
  href?: string
  unicKey?: string
  text?: string
  isWarning?: boolean
}

const FeedbackResultModal: FC<Props> = ({
  isOpen,
  onClose,
  href,
  unicKey,
  text,
  popUpButton,
  isWarning,
}) => {
  const router = useRouter()
  const { t } = useTranslation()

  const routerChange = () => {
    router.push(href as string)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={480}>
      <div className={s.popUp}>
        {isWarning ? (
          <svg
            width="54"
            height="54"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#FF4D4F" />
            <path
              d="M12 7V13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="1" fill="white" />
          </svg>
        ) : (
          <img
            alt={unicKey || 'success'}
            className={s.image}
            src={'/images/popUp.png'}
            width={270}
            height={270}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )}

        <p className={clsx(s.title, 'medium-28')}>
          {text || t('popup_ordered')}
        </p>

        {unicKey && (
          <div className={clsx(s.subtitle, 'light-16')}>
            <p className={clsx(s.unickey, 'medium-28')}>{unicKey}</p>
          </div>
        )}

        {href && (
          <Button
            className={s.button}
            value={t('popup_accep')}
            onClick={routerChange}
          />
        )}

        {popUpButton && (
          <Button
            className={s.button}
            value={t('popup_accep')}
            onClick={popUpButton}
          />
        )}
      </div>
    </Modal>
  )
}

export default FeedbackResultModal
