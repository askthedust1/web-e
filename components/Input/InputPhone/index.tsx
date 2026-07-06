// @ts-nocheck
import * as React from 'react'
import ReactInputMask from 'react-input-mask'
import { clearPhone } from 'helpers/clearPhone'
import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import { t } from 'i18next'

export interface CbkInputProps extends React.HTMLProps<HTMLInputElement> {
  placeholder?: string
  label: string
  error?: FieldError
}

export type PhoneEvent = {
  phone: string
  formattedPhone: string
  isValid: boolean
}

interface Props {
  value: string
  onChangePhone: (event: PhoneEvent) => void
  massage?: string
  dontShowLabel?: boolean
}

export const KG_PHONE_MAX_LENGTH = 13

export const InputPhone: React.FC<Props & CbkInputProps> = ({
  dontShowLabel = true,
  value,
  onChangePhone,
  disabled,
  massage,
  ...props
}) => {
  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phone = event?.currentTarget.value
    const formattedPhone = `+${clearPhone(phone)}`
    const isValid = formattedPhone.length === KG_PHONE_MAX_LENGTH
    onChangePhone({ phone, formattedPhone, isValid })
  }
  return (
    <ReactInputMask
      formatChars={{
        '1': '[0-9]',
        a: '[A-Za-z]',
        '*': '[A-Za-z0-9]',
      }}
      // alwaysShowMask
      mask="+996111111111"
      value={value}
      onChange={onChangeText}
      disabled={disabled}
    >
      {
        /*@ts-nocheck*/ (inputProps: any) => (
          <RscInput
            dontShowLabel={dontShowLabel}
            disabled={disabled}
            label={t('forms.card.phone')}
            massage={massage}
            type="tel"
            {...inputProps}
            {...props}
          />
        )
      }
    </ReactInputMask>
  )
}
