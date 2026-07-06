import CkEditor from 'components/CkEditor'
import Document from 'components/Document'
import React, { FC } from 'react'
import style from './card-info-big.module.scss'
import { useTranslation } from 'next-i18next'

export interface DocumentProps {
  ext: string
  file: string
  id: number
  title: string
}
interface CardInfoBigProps {
  documents?: DocumentProps[]
  info?: string
  isCardOrder?: boolean
}
const CardInfoBig: FC<CardInfoBigProps> = ({
  documents,
  info,
  isCardOrder,
}) => {
  const { t } = useTranslation()

  return (
    <div className={style.card}>
      {info && <CkEditor caption={info} />}
      {documents && <Document documents={documents} />}
      {isCardOrder && (
        <>
          <p className={style.cardInfoText}>
            {t('forms.card.cardDelivery.infoSchedule')
              .split('\n')
              .map((line: any, index: number) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
          </p>
          <p className={style.cardInfoText}>
            {t('forms.card.cardDelivery.infoIdentity')}
          </p>
        </>
      )}
    </div>
  )
}

export default CardInfoBig
