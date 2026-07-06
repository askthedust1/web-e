import React, { FC } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import s from './jobList.module.scss'
import { VacancyFacets, VacancyFilters } from 'services/api/VacancyFacetsApi.models'

interface Props {
  facets: VacancyFacets
  filters: VacancyFilters
  hasFilters: boolean
  onSearchChange: (value: string) => void
  onDepartmentToggle: (id: number) => void
  onRegionChange: (value: string) => void
  onCityChange: (value: string) => void
  onReset: () => void
  onCollapse: () => void
}

// Counts only earn their place when they discriminate (>1); zero-count options
// are hidden unless already selected (so an over-constrained filter stays removable).
const countLabel = (count: number) => (count > 1 ? `(${count})` : '')

const FilterSidebar: FC<Props> = ({
  facets,
  filters,
  hasFilters,
  onSearchChange,
  onDepartmentToggle,
  onRegionChange,
  onCityChange,
  onReset,
  onCollapse,
}) => {
  const { t } = useTranslation()

  const departments = facets.departments.filter(
    (d) => d.count > 0 || filters.department.includes(d.id)
  )
  const regions = facets.regions.filter(
    (r) => r.count > 0 || String(r.id) === filters.region
  )
  const selectedRegion = facets.regions.find((r) => String(r.id) === filters.region)
  const cities = (selectedRegion?.cities || []).filter(
    (c) => c.count > 0 || String(c.id) === filters.city
  )

  return (
    <aside className={s.sidebar}>
      <div className={s.sidebarHead}>
        <span className={s.sidebarTitle}>{t('job.filters')}</span>
        <button
          type="button"
          className={s.collapseBtn}
          title={t('job.collapse_filters')}
          onClick={onCollapse}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
        </button>
      </div>

      <div className={s.searchBox}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('job.search')}
        />
      </div>

      <div className={s.groupLabel}>{t('job.direction')}</div>
      <div className={s.optionList}>
        {departments.map((d) => {
          const selected = filters.department.includes(d.id)
          return (
            <button
              type="button"
              key={d.id}
              className={s.option}
              onClick={() => onDepartmentToggle(d.id)}
            >
              <span className={clsx(s.checkbox, selected && s.checked)}>
                {selected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span className={s.optionName}>{d.name}</span>
              <span className={s.optionCount}>{countLabel(d.count)}</span>
            </button>
          )
        })}
      </div>

      <div className={s.groupLabel}>{t('job.region')}</div>
      <div className={s.optionList}>
        {regions.map((r) => {
          const selected = String(r.id) === filters.region
          return (
            <button
              type="button"
              key={r.id}
              className={s.option}
              onClick={() => onRegionChange(selected ? '' : String(r.id))}
            >
              <span className={clsx(s.radio, selected && s.checked)}>
                <span />
              </span>
              <span className={s.optionName}>{r.name}</span>
              <span className={s.optionCount}>{countLabel(r.count)}</span>
            </button>
          )
        })}
      </div>

      <div className={s.groupLabel}>
        {t('job.city')}
        {!selectedRegion && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C2C9D2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
      </div>
      {selectedRegion ? (
        <div className={s.optionList}>
          {cities.map((c) => {
            const selected = String(c.id) === filters.city
            return (
              <button
                type="button"
                key={c.id}
                className={s.option}
                onClick={() => onCityChange(selected ? '' : String(c.id))}
              >
                <span className={clsx(s.radio, selected && s.checked)}>
                  <span />
                </span>
                <span className={s.optionName}>{c.name}</span>
                <span className={s.optionCount}>{countLabel(c.count)}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className={s.cityHint}>{t('job.city_pick_region')}.</div>
      )}

      {hasFilters && (
        <button type="button" className={s.resetBtn} onClick={onReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          {t('job.reset')}
        </button>
      )}
    </aside>
  )
}

export default FilterSidebar
