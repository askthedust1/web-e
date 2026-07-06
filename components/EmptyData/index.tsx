import AppImage from 'components/ui/AppImage'
import EmptyDataImage from '/public/images/empty/Group.png'
import Section from 'components/Section'
import s from './empty-data.module.scss'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { FC } from 'react'

interface Props {
  text?: string
  subtitle?: string
}

const EmptyData: FC<Props> = ({ text, subtitle }) => {
  const { t } = useTranslation()
  return (
    <Section className={s.wrapper}>
      <div>
        <AppImage
          alt={text || ''}
          className={s.image}
          src={EmptyDataImage.src}
          height={160}
          width={176}
        />
        <p className={clsx(s.title, 'medium-40')}>{text ? text : t('empty')}</p>
        {subtitle && <p className={clsx(s.subtitle, 'light-18')}>{subtitle}</p>}
      </div>
    </Section>
  )
}

export default EmptyData
