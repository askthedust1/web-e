import clsx from 'clsx'
import {
  useState,
  HTMLProps,
  forwardRef,
  useEffect,
  ChangeEvent
} from 'react'
import { FieldError } from 'react-hook-form'
import styles from './rsc-input.module.scss'
import Icon from 'components/Icon'

export interface RscInputNumber extends HTMLProps<HTMLInputElement> {
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
  isNumberFormat?: boolean
  handleChangeNumber?: (value: string) => void
  value?: any
}

export const RscInputNumber = forwardRef<HTMLInputElement, RscInputNumber>(
  (
    {
      dontShowLabel = false,
      isPasspord = false,
      hendlerShowPassWord,
      isAuth = false,
      placeholder,
      handleChangeNumber,
      label,
      children,
      error,
      isHalf,
      isSmall,
      massage,
      isNumberFormat = false,
      value,
      onChange,
      type,
      ...props
    },
    ref
  ) => {
    const [formatted, setFormatted] = useState('')
    const format = (val: string) => {
      const num = val?.replace(/\D/g, '')
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    useEffect(() => {
      if (isNumberFormat && typeof value === 'string') {
        setFormatted(format(value || ""))
      }
    }, [value, isNumberFormat])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const onlyNumbers = e.target.value.replace(/\D/g, '')
      setFormatted(format(onlyNumbers))
      if(handleChangeNumber) handleChangeNumber(onlyNumbers)
    }

    const [password, setPassword] = useState('password')
    const togglePassword = () => {
      setPassword((prev) => (prev === 'password' ? 'text' : 'password'))
    }
    return (
      <div className={clsx(styles.wrapper, isHalf && styles.isHalf, isSmall && styles.isSmall)}>
        {!!value && !dontShowLabel && <div className={styles.labelTop}>{label}</div>}

        <div className={clsx(styles.block, 'light-16')}>
          <input
            ref={ref}
            type={isNumberFormat ? 'text' : isPasspord ? password : type}
            className={clsx(styles.input, props.disabled && styles.disabled)}
            placeholder={label}
            value={isNumberFormat ? formatted : value}
            onChange={isNumberFormat ? handleChange : onChange}
            {...props}
          />

          {isPasspord && (
            <div onClick={togglePassword} className={clsx(styles.showPassword, password === 'text' && styles.active)}>
              <Icon id="eye" width={23} height={23} />
            </div>
          )}

          {children}
        </div>

        {massage && <p className={clsx(styles.massage, 'light-14')}>{massage}</p>}
        {error?.message && <div className={clsx(styles.error, 'light-12')}>{error.message}</div>}
      </div>
    )
  }
)

RscInputNumber.displayName = 'RscInputNumber'