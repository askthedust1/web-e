import Icon from 'components/Icon'
import React from 'react'
import style from './input-check-box.module.scss'
import clsx from 'clsx'
import { FieldError } from 'react-hook-form'

interface InputRadioProps {
  labelArray: { name: string; id: number }[]
  name: string
  error?: FieldError
  onClick(id: number): void
  value: number[] | any
  label?: string
}

export const InputCheckBox: React.FC<InputRadioProps> = ({
  name,
  error,
  value,
  onClick,
  labelArray,
  label,
  ...props
}) => {
  return (
    <div className={style.block}>
      <div className={style.block}>
        {labelArray?.map((item, index) => {
          let CHECK = []
          CHECK.push(item.id)

          return (
            <div key={item.id} className={style.component}>
              <label
                htmlFor={String(item.id)}
                className={clsx(style.iconWrapper, 'light-16')}
              >
                <Icon
                  id={
                    value && !value.includes(CHECK[0])
                      ? 'checkbox'
                      : 'checkbox-active'
                  }
                  width={33}
                  height={33}
                  className={clsx(
                    style.activeCheckbox,
                    value && !value.includes(CHECK[0]) && style.active
                  )}
                />
              </label>

              <input
                className={style.checkbox}
                type="checkbox"
                key={index}
                id={String(item.id)}
                name={String(item.id)}
                onClick={() => onClick(item.id)}
                {...props}
              />
              <label
                htmlFor={String(item.id)}
                className={clsx(style.label, 'light-18')}
              >
                {item.name}
              </label>
            </div>
          )
        })}
      </div>
      <div className={clsx(style.error, 'light-12')}>{error?.message}</div>
    </div>
  )
}
