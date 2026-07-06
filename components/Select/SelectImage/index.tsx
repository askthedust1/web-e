import clsx from 'clsx'
import Icon from 'components/Icon'
import AppImage from 'components/ui/AppImage'
import React from 'react'
import styles from './select-img.module.scss'
import { FC } from 'react'
import { useTranslation } from 'next-i18next'
interface Props extends React.HTMLProps<HTMLSelectElement> {
  onFilterCardsMob(e: string): void
  massage?: string
  optionsList: {
    id: number
    image: string
    is_available?: boolean
    is_open?: boolean
    name?: string
  }[]
  selectedImage: string
  isAviable?: boolean
}

const SelectImg: FC<Props> = ({
  massage,
  optionsList,
  selectedImage,
  onFilterCardsMob,
  isAviable = false,
}) => {
  const SELECTED_VALUE =
    optionsList?.filter((item) => item.id === parseInt(selectedImage))[0] ||
    null
  const { t } = useTranslation()

  return (
    <div>
      <div className={clsx(styles.block)}>
        <div className={styles.select}>
          <div className={styles.imgWrapper}>
            {SELECTED_VALUE?.image && (
              <AppImage
                src={SELECTED_VALUE.image}
                alt={SELECTED_VALUE.name || ''}
                className={styles.card_mob}
                width={41}
                height={26}
                sizes="42px"
              />
            )}
          </div>
          <select
            onChange={(e) => onFilterCardsMob(e.target.value)}
            className={clsx(styles.item, 'light-16')}
          >
            <option value="">{t('setting.all')}</option>
            {optionsList?.map((item) => (
              <option
                disabled={(!item.is_available && isAviable) || !item.is_open}
                className={styles.option}
                key={item.name}
                value={item.id}
              >
                {item.name}{' '}
                {!item.is_available && isAviable && `(${t('setting.badge')})`}
                {item.is_open === false &&
                  isAviable &&
                  `(${t('status_card_system')})`}
              </option>
            ))}
          </select>

          <div className={styles.icon_mob}>
            <Icon id="arrow-up-thin" width={25} height={25} />
          </div>
        </div>
      </div>
      <p className={clsx(styles.massage, 'light-14')}>{massage}</p>
    </div>
  )
}

export default SelectImg
