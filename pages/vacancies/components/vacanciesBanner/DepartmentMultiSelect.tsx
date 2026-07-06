import React, { FC, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Icon from 'components/Icon'
import { FacetDepartment } from 'services/api/VacancyFacetsApi.models'
import s from './departmentMultiSelect.module.scss'

interface Props {
  label: string
  options: FacetDepartment[]
  selected: number[]
  onToggle: (id: number) => void
}

const DepartmentMultiSelect: FC<Props> = ({ label, options, selected, onToggle }) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const triggerText = selected.length === 0 ? label : `${label}: ${selected.length}`

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={clsx(s.trigger, selected.length > 0 && s.active)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={s.triggerText}>{triggerText}</span>
        <Icon
          id="arrow-up-thin"
          width={20}
          height={20}
          className={clsx(s.chevron, open && s.chevronOpen)}
        />
      </button>

      {open && (
        <div className={s.panel}>
          {options.length === 0 && <div className={s.empty}>—</div>}
          {options.map((o) => {
            const checked = selected.includes(o.id)
            return (
              <button
                type="button"
                key={o.id}
                className={clsx(s.option, checked && s.optionChecked)}
                onClick={() => onToggle(o.id)}
              >
                <span className={clsx(s.box, checked && s.boxChecked)}>
                  {checked && <span className={s.tick}>✓</span>}
                </span>
                <span className={s.optionName}>{o.name}</span>
                {o.count > 1 && <span className={s.count}>{o.count}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DepartmentMultiSelect
