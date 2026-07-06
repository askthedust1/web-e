import React, { FC } from 'react'
import Button from 'components/Buttons/Button'
import AppImage from 'components/ui/AppImage'
import s from './acquiringPromo.module.scss'
import { useTranslation } from 'next-i18next'

interface AcquiringPromoProps {
  onClick: () => void
  pos?: boolean
}

const AcquiringPromo: FC<AcquiringPromoProps> = ({ onClick, pos }) => {
  const { t } = useTranslation('common')

  return (
    <div className={s.promoContainer}>
      <div className={s.imageWrapper}>
        {pos ? (
          <AppImage
            src={'/images/pos1.png'}
            alt={'pos1'}
            className={s.promoImage}
            width={1063}
            height={914}
            sizes="(max-width: 480px) 100vw, (max-width: 960px) 80vw, 50vw"
          />
        ) : (
          <AppImage
            src={'/images/acquiring1.png'}
            alt={'acquiring2'}
            className={s.promoImage}
            width={1063}
            height={939}
            sizes="(max-width: 480px) 100vw, (max-width: 960px) 80vw, 50vw"
          />
        )}
      </div>
      <div className={s.contentWrapper}>
        {pos ? (
          <>
            <h3 className={s.title}>{t('acquiring_promo.pos_title')}</h3>
            <ul className={s.list}>
              <li>{t('acquiring_promo.pos_item_1')}</li>
              <li>{t('acquiring_promo.pos_item_2')}</li>
              <li>{t('acquiring_promo.pos_item_3')}</li>
              <li>{t('acquiring_promo.pos_item_4')}</li>
            </ul>
            <Button
              value={t('acquiring_promo.pos_button')}
              onClick={onClick}
              isLarge
            />
          </>
        ) : (
          <>
            <h3 className={s.title}>{t('acquiring_promo.internet_title')}</h3>
            <ul className={s.list}>
              <li>{t('acquiring_promo.internet_item_1')}</li>
              <li>{t('acquiring_promo.internet_item_2')}</li>
            </ul>
            <Button
              value={t('acquiring_promo.internet_button')}
              onClick={onClick}
              isLarge
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AcquiringPromo
