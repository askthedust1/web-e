import React, { FC } from 'react'
import styles from './result-modal.module.scss'

interface Props {
  success?: boolean
  message?: string
  closeModal?: () => void
}

const ResultModal: FC<Props> = ({ success = true, message, closeModal }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div
          className={`${styles.icon} ${success ? styles.success : styles.error}`}
        >
          {success ? (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="#05944a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 9v4"
                stroke="#c53030"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16h.01"
                stroke="#c53030"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#c53030"
                strokeWidth="1.2"
                fill="transparent"
              />
            </svg>
          )}
        </div>
        <div className={styles.message}>{message}</div>
        <button className={styles.button} onClick={closeModal}>
          OK
        </button>
      </div>
    </div>
  )
}

export default ResultModal
