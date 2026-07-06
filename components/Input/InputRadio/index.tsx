import clsx from 'clsx'
import Icon from 'components/Icon'
import React, { FC } from 'react'
import { FieldError } from 'react-hook-form'
import style from './input-radio.module.scss'
import { useTranslation } from 'next-i18next'

interface InputRadioProps {
  labelArray?: { name: string; id: number, is_active?: boolean }[]
  name: string
  error?: FieldError
  onClick(id: string | number): void
  value: number | number[] | string
}

const InputRadio: FC<InputRadioProps> = ({
  labelArray,

  name,
  onClick,
  error,
  value,
}) => {
  const [chech, _setChech] = React.useState(true)
  const { t } = useTranslation()

  return (
    <div className={style.container}>
      <div className={style.block}>
        {labelArray?.map((item, index) => (
          <div
            key={index}
            className={clsx(style.checkboxBlock, item?.is_active === false && style.disabled)}
            onClick={() => onClick(item.id)}
          >
            <div className={style.iconWrapper}>
              <Icon
                id={value !== item.id ? 'radio' : 'active'}
                width={33}
                height={33}
                className={clsx(
                  chech ? style.defaultCheckbox : style.activeCheckbox,
                  value !== item.id && style.disabled
                )}
              />
            </div>

            <input
              disabled={item?.is_active === false}
              className={style.checkbox}
              type="radio"
              checked={value === item.id}
              id={`${item.name}${index}`}
              name={name}
            />
            <label
              className={clsx(style.label, 'light-18')}
              htmlFor={`${item.name}${index}`}
            >
              {item.name}
              {" "}
              {item?.is_active === false && <span className={style.cuption}>{t("setting.badge")}</span>}
            </label>
          </div>
        ))}

      </div>
      <div>
        <p className={clsx(style.error, 'light-12')}>{error?.message}</p>
      </div>
    </div>
  )
}

export default InputRadio
