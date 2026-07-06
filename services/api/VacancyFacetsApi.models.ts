export interface FacetCity {
  id: number
  name: string
  count: number
}

export interface FacetRegion {
  id: number
  name: string
  count: number
  cities: FacetCity[]
}

export interface FacetDepartment {
  id: number
  name: string
  count: number
}

export interface VacancyFacets {
  regions: FacetRegion[]
  departments: FacetDepartment[]
}

export interface VacancyFilters {
  search: string
  region: string
  city: string
  department: number[]
}

export const EMPTY_FILTERS: VacancyFilters = {
  search: '',
  region: '',
  city: '',
  department: [],
}
