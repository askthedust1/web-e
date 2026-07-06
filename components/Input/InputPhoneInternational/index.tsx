// @ts-nocheck
import * as React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import clsx from 'clsx'
import styles from 'components/ui/Input/rsc-input.module.scss'
import { FieldError } from 'react-hook-form'

interface Props {
  value: string
  onChangePhone: (event: any) => void
  placeholder: string
  error?: FieldError
  color?: string
  disabled?: boolean
}

export const InputPhoneInternational: React.FC<Props> = ({
                                                           value,
                                                           onChangePhone,
                                                           placeholder,
                                                           error,
                                                           color,
                                                           disabled
                                                         }) => {


  return (
    <>
      <PhoneInput
        country={'kg'}
        value={value}
        inputStyle={{
          width: '100%',
          height: color? 60 : 50,
          backgroundColor: color ? color : '',
        }}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChangePhone}
      />
      {error?.message && (
        <div className={clsx(styles.error, 'light-12')}>
          {error?.message}
        </div>
      )}
    </>
  )
}
