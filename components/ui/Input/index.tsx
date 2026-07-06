import clsx from 'clsx'
import { useState, HTMLProps, forwardRef } from 'react'

import { FieldError } from 'react-hook-form'

import styles from './rsc-input.module.scss'
import Icon from 'components/Icon'

export interface RscInput extends HTMLProps<HTMLInputElement> {
  placeholder?: string
  label: string
  error?: FieldError
  isHalf?: boolean
  isAuth?: boolean
  isSmall?: boolean
  isPasspord?: boolean
  dontShowLabel?: boolean
  massage?: string
  hendlerShowPassWord?(value: string): void
}

export const RscInput = forwardRef<HTMLInputElement, RscInput>(
  (
    {
      dontShowLabel = false,
      isPasspord = false,
      hendlerShowPassWord,
      isAuth = false,
      placeholder,
      label,
      children,
      error,
      isHalf,
      isSmall,
      massage,
      ...props
    },
    ref
  ) => {
    const [password, setPassword] = useState(isPasspord ? 'password' : 'text')
    const showPassword = (curremtValue: string) => {
      if (curremtValue === 'password') {
        setPassword('text')
      } else {
        setPassword('password')
      }
    }
    return (
      <>
        <div
          className={clsx(
            styles.wrapper,
            isHalf ? styles.isHalf : '',
            isSmall && styles.isSmall
          )}
        >
          {props?.value && !dontShowLabel && (
            <div className={styles.labelTop}>{label}</div>
          )}

          <div className={clsx(styles.block, 'light-16')}>
            <input
              rows={10}
              type={password}
              ref={ref}
              className={clsx(
                styles.input,
                props?.disabled && styles.disabled,
                props?.value && !dontShowLabel && styles.inputWithLabel
              )}
              placeholder={label}
              {...props}
            />
            {isPasspord && (
              <div
                onClick={() => showPassword(password)}
                className={clsx(
                  styles.showPassword,
                  props.type === 'text' && styles.active
                )}
              >
                <Icon id="eye" width={23} height={23} />
              </div>
            )}
            {children}
          </div>
          {massage && (
            <p className={clsx(styles.massage, 'light-14')}>{massage}</p>
          )}
          {error?.message && (
            <div className={clsx(styles.error, 'light-12')}>
              {error?.message}
            </div>
          )}
        </div>
      </>
    )
  }
)

RscInput.displayName = 'RscInput'
