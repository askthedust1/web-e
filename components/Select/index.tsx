import clsx from 'clsx'
import Icon from 'components/Icon'
import { useTranslation } from 'next-i18next'
import React, { FC } from 'react'
import style from './select.module.scss'
interface SelectProps {
  massage?: string
  label?: string | boolean
  selectOption(value: string): void
  optionList: {
    name: string
    id: number | string
    selected?: boolean
    locale?: string
  }[]
  onClick?: React.MouseEventHandler<HTMLDivElement>
  classNameBlock?: string
  value?: string | number
  classNameSelect?: string
  classItem?: string
}

const SelectFilter: FC<SelectProps> = ({
  massage,
  label,
  optionList,
  selectOption,
  onClick: _onClick,
  classNameBlock,
  classNameSelect,
  value,
  classItem
}) => {
  const { t } = useTranslation()
  return (
    <div className={clsx(style.container, classNameBlock)}>
      <div className={clsx(style.block, classNameSelect)}>
        <select
          value={value}
          className={clsx(style.select, classItem,  'light-16')}
          id="selectedValue"
          onChange={(value) => selectOption(value.target.value)}
        >
          {label && (
            <option selected className={style.label} value="">
              {label}
            </option>
          )}
          {optionList?.map((item, index) => (
            <option key={index} value={item.id}>
              {item.locale
                ? t(`service_point_service.${item.locale}`)
                : item.name}
            </option>
          ))}
        </select>
        <div className={style.icon}>
          <Icon id="arrow-up-thin" width={29} height={29} />
        </div>
      </div>

      <div>
        <p className={clsx(style.massage, 'light-14')}>{massage}</p>
      </div>
    </div>
  )
}

export default SelectFilter
