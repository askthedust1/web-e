import clsx from 'clsx'
import Icon from 'components/Icon'
import React, { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { FieldError } from 'react-hook-form'
import { CardsList } from 'services/api/CardsApModule'
import styles from './select-img.module.scss'
import AppImage from 'components/ui/AppImage'

interface Props extends React.HTMLProps<HTMLSelectElement> {
  label?: string
  optionsList: CardsList[]
  error?: FieldError
  isHalf?: boolean
  isSmall?: boolean
  massage?: string
  selectedImg: number | string | string[]
}

const RskSelectImg = React.forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      optionsList,
      error,
      isHalf,
      isSmall,
      massage,
      selectedImg,
      value,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const [isVisible, setIsVisible] = React.useState<boolean>(false)

    useEffect(() => {
      setIsVisible(true)
    }, [])

    const SELECTED_VALUE =
      optionsList?.filter((item) => item.id === value)[0] || null

    return (
      <div>
        <div
          className={clsx(
            'border-black',
            'height-150',
            styles.block,
            isHalf ? styles.isHalf : '',
            isSmall && styles.isSmall
          )}
        >
          <div className={styles.select}>
            {isVisible && !isMobile && (
              <p className={clsx(styles.label, 'regular-12')}>{label}</p>
            )}

            <div className={styles.imgWrapper}>
              {isVisible && !isMobile ? (
                <AppImage
                  alt={label || ''}
                  width={90}
                  height={60}
                  src={SELECTED_VALUE?.image || optionsList[0]?.image || '/'}
                  className={styles.card}
                />
              ) : (
                <AppImage
                  alt={label || ''}
                  width={50}
                  height={30}
                  src={SELECTED_VALUE?.image || optionsList[0]?.image || '/'}
                  className={styles.card_mob}
                />
              )}
            </div>
            <select
              className={clsx(styles.item, 'light-16')}
              ref={ref}
              value={value}
              {...props}
            >
              {optionsList?.map((item) => (
                <option
                  className={styles.option}
                  key={item.name}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
            {isVisible && !isMobile ? (
              <div className={styles.icon}>
                <Icon id="arrow-up-thin" width={29} height={29} />
              </div>
            ) : (
              <div className={styles.icon_mob}>
                <Icon id="arrow-up-thin" width={15} height={15} />
              </div>
            )}
          </div>
        </div>
        <p className={clsx(styles.massage, 'light-14')}>{massage}</p>
        <div className={clsx(styles.error, 'light-14')}>{error?.message}</div>
      </div>
    )
  }
)

RskSelectImg.displayName = 'RskSelectImg'
export { RskSelectImg }
