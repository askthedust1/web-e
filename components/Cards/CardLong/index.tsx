import Container from 'components/Container'
import React, { FC } from 'react'
import style from './card-long.module.scss'
import Button from 'components/Buttons/Button'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import { Branches } from 'services/api/BranchesApimodule'
import AppImage from 'components/ui/AppImage'

export interface CardLongProps {
  data: Branches
  getDetailInfo(): void
}

const CardLong: FC<CardLongProps> = ({
  data,
  getDetailInfo: getDetailInfo,
}: CardLongProps) => {
  const { t } = useTranslation()

  const rendercurrentStatus = () => {
    if (data?.day_n_night === true) {
      return <span className={clsx(style.isOpen, `light-16`)}>{t('open')}</span>
    }

    if (data?.is_open === true) {
      return (
        <span className={clsx(style.isOpen, 'light-16')}>{data.status}</span>
      )
    }

    return <span className={`${style.isClosed} light-16`}>{data?.status}</span>
  }

  return (
    <Container>
      <div className={style.card}>
        <div className={style.first}>
          <div className={style.name}>
            <div className={style.iamgeWrapper}>
              <AppImage
                alt={data.name || ''}
                width={38}
                height={38}
                src={data.icon || '/'}
                className={style.icon}
              />
            </div>

            <div>
              <p className={`${style.titleReg} light-14`}>
                {data?.region?.name}
              </p>
              <p className={`${style.title} regular-14`}>{data.name}</p>
            </div>
          </div>

          {rendercurrentStatus()}
        </div>
        <div className={style.second}>
          <p className={`${style.adress} light-16`}>{data.address}</p>
          {data?.phones.map((item) => (
            <a
              href={`tel:${item.phone}`}
              key={item.id}
              className={`${style.adress} light-16`}
            >
              {item.phone}
            </a>
          ))}
        </div>
        <div className={style.third}>
          {data.captions.map((item) => (
            <p className={clsx(style.caption, 'light-12')} key={item.id}>
              {item.caption}
            </p>
          ))}
        </div>
        <div className={style.button}>
          {data?.day_n_night ? (
            <p className={style.cuption}>
              {t('service_point_service.day_nigth')}
            </p>
          ) : (
            <Button
              className={style.buttonLink}
              onClick={getDetailInfo}
              value={t('time_work')}
              isOutline
            />
          )}
        </div>
      </div>
    </Container>
  )
}

export default CardLong
