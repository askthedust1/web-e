import clsx from 'clsx'
import Icon from 'components/Icon'
import React, { useEffect, HTMLProps, useState } from 'react'

import { FieldError } from 'react-hook-form'
import { useMediaQuery } from 'react-responsive'
import styles from './rsk-select.module.scss'

interface Props extends HTMLProps<HTMLSelectElement> {
  label?: string
  optionsList?: { name: string | number; id: number | string }[] | null
  error?: FieldError
  isHalf?: boolean
  isSmall?: boolean
  massage?: string
  className?: string
}

const RskSelect = React.forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      optionsList,
      error,
      isHalf,
      isSmall,
      massage,
      className,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const [isVisible, setIsVisible] = useState<boolean>(false)
    useEffect(() => {
      setIsVisible(true)
    }, [])

    return (
      <div
        className={clsx(styles.container, isHalf && styles.isHalf, className)}
      >
        <div
          className={clsx(
            styles.block,
            isHalf ? styles.isHalf : '',
            isSmall && styles.isSmall
          )}
        >
          <div className={styles.block}>
            <select
              className={clsx(styles.select, 'light-16')}
              ref={ref}
              {...props}
            >
              {label && (
                <option selected hidden value="" className={styles.label}>
                  {label}
                </option>
              )}
              {optionsList?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {isVisible && !isMobile ? (
              <label className={styles.icon}>
                <Icon id="arrow-up-thin" width={27} height={32} />
              </label>
            ) : (
              <label className={styles.icon_mob}>
                <Icon id="arrow-up-thin" width={20} height={20} />
              </label>
            )}
          </div>
          <div></div>
        </div>
        <p className={clsx(styles.massage, 'light-14')}>{massage}</p>
        <div className={clsx(styles.error, 'light-12')}>{error?.message}</div>
      </div>
    )
  }
)

RskSelect.displayName = 'RskSelect'
export { RskSelect }
