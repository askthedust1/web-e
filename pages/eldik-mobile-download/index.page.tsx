import React, { useEffect } from 'react'
import styles from 'pages/eldik-mobile-download/eldikMobileDownload.module.scss'
import Container from 'components/Container'

const EldikMobileDownload = () => {
  useEffect(() => {
      const ua = navigator.userAgent || navigator.vendor

      if (/android/i.test(ua)) {
          window.location.href =
              'https://play.google.com/store/apps/details?id=kg.rsk.staging'
      } else if (/iPad|iPhone|iPod/.test(ua)) {
          window.location.href =
              'https://apps.apple.com/kg/app/eldik/id6596756225'
      } else {
          window.location.href =
              'https://eldik.kg'
      }
  }, [])

  return (
    <div className={styles.content}>
      <Container>
        <div className={styles.content}>Перенаправление...</div>
      </Container>
    </div>
  )
}

export default EldikMobileDownload
