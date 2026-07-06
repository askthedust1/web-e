import React, { FC, ReactNode } from 'react'
import styles from './modal.module.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  width?: string | number
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, width, children }) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}

export default Modal
