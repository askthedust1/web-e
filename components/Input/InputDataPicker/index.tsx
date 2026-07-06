import Icon from 'components/Icon'
import React, { FC, useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FieldError } from 'react-hook-form'
import style from './input-data-picker.module.scss'
import ru from 'date-fns/locale/ru'
import { enUS } from 'date-fns/locale'
import clsx from 'clsx'
import { useRouter } from 'next/router'

interface IAugmentedJQuery {
  placeholder: string
  selected: Date
  onChange(data: Date): void
  error?: FieldError
  maxDate?: Date
  disabled?: boolean
  isOpenDate?: boolean
  dateFormat?: string
}

const InputDataPicker: FC<IAugmentedJQuery> = ({
  placeholder,
  selected,
  onChange,
  error,
  maxDate,
  disabled,
  isOpenDate,
  dateFormat = 'yyyy-MM-dd',
}) => {
  const { locale } = useRouter()
  const [open, setOpen] = useState(false)
  const onClickDate = () => {
    if (!isOpenDate) {
      setOpen((prev) => !prev)
    }
  }

  return (
    <div className={style.block}>
      <div
        className={clsx(style.block, 'light-16')}
        onMouseEnter={onClickDate}
        onMouseLeave={onClickDate}
      >
        <DatePicker
          locale={locale !== 'en' ? ru : enUS}
          onChange={onChange}
          disabled={disabled}
          dateFormat={dateFormat}
          open={open}
          selected={selected}
          peekNextMonth
          showMonthDropdown
          dropdownMode="select"
          className={clsx(style.data, 'color-white')}
          placeholderText={placeholder}
          showYearDropdown
          maxDate={maxDate}
        />
        <div className={clsx(style.calendar, 'color-white')}>
          <Icon id="calendar" height={23} width={23} />
        </div>
      </div>
      <div className={clsx(style.error, 'light-12')}>{error?.message}</div>
    </div>
  )
}
export default React.memo(InputDataPicker)
