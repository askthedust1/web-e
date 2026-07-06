import { observer } from 'mobx-react-lite'
import s from './rsk-modal.module.scss'
import { FC, useEffect, useRef, useCallback } from 'react'
import { store } from 'store'
interface Props {}
const RskModal: FC<Props> = observer(() => {
  const { modals } = store
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modals?.resetData()
        return
      }

      if (e.key !== 'Tab') return

      const container = containerRef.current
      if (!container) return

      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [modals]
  )

  useEffect(() => {
    if (!modals?.visible) return

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    const container = containerRef.current
    if (container) {
      const focusable = container.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])'
      )
      focusable?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [modals?.visible, handleKeyDown])

  if (!modals?.visible) {
    return null
  }

  return (
    <>
      <div
        className={s.overlay}
        onClick={() => modals?.resetData()}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        className={s.container}
        role="dialog"
        aria-modal="true"
      >
        {modals?.body}
      </div>
    </>
  )
})

export default RskModal
