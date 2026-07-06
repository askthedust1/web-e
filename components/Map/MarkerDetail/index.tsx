import clsx from 'clsx'
import Icon from 'components/Icon'
import { useTranslation } from 'next-i18next'
import React, { FC, useState } from 'react'
import { ServiceDetailProps } from 'services/api/BranchesApimodule'
import s from './marker-detail.module.scss'
import parseTime from 'helpers/parseTime'
import { useRouter } from 'next/router'

interface Props {
  info: ServiceDetailProps
}

const MarkerDetail: FC<Props> = ({ info }) => {
  const [toggle, setToggle] = useState({
    work: false,
    break: false,
  })

  const workDaysAll = info?.week_days?.map((item) => item).slice(0, 2)
  const { t } = useTranslation()
  const { locale } = useRouter()
  const close_untill = parseTime(info?.is_closed_till, 'hh:mm', locale)
  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <p className={clsx(s.title, 'medium-18')}>{info?.name}</p>
        <ul className={s.ul}>
          <li className={s.li}>
            <Icon className={s.icon} id="pin-location" width={18} height={17} />
            <p className={clsx(s.cuption, 'light-14')}>{info?.address}</p>
          </li>
          <li className={s.li}>
            <Icon className={s.icon} id="phone-thin" width={15} height={15} />
            {info?.phones?.map((item) => (
              <a key={item.id} className={clsx(s.cuption, 'light-14')}>
                {item?.phone}
              </a>
            ))}
          </li>
          <li className={clsx(s.li, !info?.is_closed ? s.isOpen : s.isClosed)}>
            <Icon className={s.icon} id="ellipse" width={15} height={15} />
            {!info?.is_closed ? (
              <p className={clsx(s.cuption, 'light-14')}>{info.status}</p>
            ) : (
              <p className={clsx(s.cuption, 'light-14')}>
                {t('сlosed')} {''}
                {close_untill}
              </p>
            )}
          </li>
        </ul>
      </div>
      <div className={s.wrapper}>
        <p className={clsx(s.subtitle, 'light-14')}>{t('time_work')}</p>
        <ul className={clsx(s.ul, s.scroller)}>
          {!toggle.work
            ? workDaysAll?.map((item) => (
                <li key={item.id} className={s.liTime}>
                  <p>{item?.day}</p>
                  <p>
                    {item?.open_from}-{item?.open_till}
                  </p>
                </li>
              ))
            : info?.week_days?.map((item) => (
                <li key={item.id} className={s.liTime}>
                  <p>{item?.day}</p>
                  <p>
                    {item?.open_from}-{item?.open_till}
                  </p>
                </li>
              ))}
          {!toggle.work ? (
            <p
              onClick={() => setToggle((prev) => ({ ...prev, work: true }))}
              className={clsx(s.scroll, 'light-14')}
            >
              {t('whole_list')}
              <Icon
                className={s.scrollIcon}
                id="arrow-up-thin"
                width={12}
                height={12}
              />
            </p>
          ) : (
            <p
              onClick={() => setToggle((prev) => ({ ...prev, work: false }))}
              className={clsx(s.scroll, 'light-14')}
            >
              {t('hide')}
              <Icon
                className={s.scrollIcon}
                id="arrow-down-thin"
                width={12}
                height={12}
              />
            </p>
          )}
        </ul>
      </div>
      <div className={s.wrapper}>
        <p className={s.subtitle}>{t('break_time')}</p>
        <ul className={clsx(s.ul, s.scroller)}>
          {!toggle.break
            ? workDaysAll?.map((item) => (
                <li key={item.id} className={s.liTime}>
                  <p>{item?.day}</p>
                  <p>
                    {item?.break_from}-{item?.break_till}
                  </p>
                </li>
              ))
            : info?.week_days?.map((item) => (
                <li key={item.id} className={s.liTime}>
                  <p>{item?.day}</p>
                  <p>
                    {item?.break_from}-{item?.break_till}
                  </p>
                </li>
              ))}
          {!toggle?.break ? (
            <p
              onClick={() => setToggle((prev) => ({ ...prev, break: true }))}
              className={clsx(s.scroll, 'light-14')}
            >
              {t('whole_list')}
              <Icon
                className={s.scrollIcon}
                id="arrow-up-thin"
                width={12}
                height={12}
              />
            </p>
          ) : (
            <p
              onClick={() => setToggle((prev) => ({ ...prev, break: false }))}
              className={clsx(s.scroll, 'light-14')}
            >
              {t('hide')}
              <Icon
                className={s.scrollIcon}
                id="arrow-down-thin"
                width={12}
                height={12}
              />
            </p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default MarkerDetail
