import React, { FC } from 'react'
import s from './vacanciesBanner.module.scss'
import { RscInput } from 'components/ui/Input'
import { RskSelect } from 'components/ui/Select'
import { useTranslation } from 'next-i18next'
import DepartmentMultiSelect from './DepartmentMultiSelect'
import { VacancyFacets, VacancyFilters } from 'services/api/VacancyFacetsApi.models'

interface Props {
  facets: VacancyFacets
  filters: VacancyFilters
  loading: boolean
  onSearchChange: (value: string) => void
  onDepartmentToggle: (id: number) => void
  onRegionChange: (value: string) => void
  onCityChange: (value: string) => void
  onReset: () => void
}

// Counts only earn their place when they discriminate (>1). At "1 per option"
// they are pure noise, so we omit them.
const withCount = (name: string, count: number) =>
  count > 1 ? `${name} (${count})` : name

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

const VacanciesFilterForm: FC<Props> = ({
  facets,
  filters,
  loading,
  onSearchChange,
  onDepartmentToggle,
  onRegionChange,
  onCityChange,
  onReset,
}) => {
  const { t } = useTranslation()

  const selectedRegion = facets.regions.find((r) => String(r.id) === filters.region)
  const cities = selectedRegion?.cities || []
  const hasRegion = Boolean(filters.region)

  const chips: Chip[] = []
  if (filters.search) {
    chips.push({ key: 'search', label: filters.search, onRemove: () => onSearchChange('') })
  }
  filters.department.forEach((id) => {
    const dep = facets.departments.find((d) => d.id === id)
    if (dep)
      chips.push({ key: `dep-${id}`, label: dep.name, onRemove: () => onDepartmentToggle(id) })
  })
  if (selectedRegion) {
    chips.push({ key: 'region', label: selectedRegion.name, onRemove: () => onRegionChange('') })
  }
  if (filters.city) {
    const city = cities.find((c) => String(c.id) === filters.city)
    if (city) chips.push({ key: 'city', label: city.name, onRemove: () => onCityChange('') })
  }

  return (
    <form className={s.searchForm} onSubmit={(e) => e.preventDefault()}>
      <div className={s.row}>
        <RscInput
          label={t('job.search')}
          dontShowLabel
          value={filters.search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        />

        <DepartmentMultiSelect
          label={t('job.department')}
          options={facets.departments}
          selected={filters.department}
          onToggle={onDepartmentToggle}
        />
      </div>

      <div className={s.row}>
        <RskSelect
          label={t('job.region')}
          disabled={loading}
          optionsList={facets.regions.map((r) => ({
            id: r.id,
            name: withCount(r.name, r.count),
          }))}
          value={filters.region}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onRegionChange(e.target.value)}
        />

        <RskSelect
          label={hasRegion ? t('job.city') : t('job.city_pick_region')}
          disabled={loading || !hasRegion}
          optionsList={cities.map((c) => ({ id: c.id, name: withCount(c.name, c.count) }))}
          value={filters.city}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCityChange(e.target.value)}
        />
      </div>

      {chips.length > 0 && (
        <div className={s.chips}>
          {chips.map((chip) => (
            <button type="button" key={chip.key} className={s.chip} onClick={chip.onRemove}>
              <span className={s.chipLabel}>{chip.label}</span>
              <span className={s.chipRemove}>×</span>
            </button>
          ))}
          <button type="button" className={s.resetLink} onClick={onReset}>
            {t('job.reset')}
          </button>
        </div>
      )}
    </form>
  )
}

export default VacanciesFilterForm
