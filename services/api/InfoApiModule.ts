export interface AboutProps {
  id: number
  title: string
  desc: string
}

export interface AdministrationProps {
  id: number
  title: string
  desc1: string
  desc2: string
  groups: {
    id: number
    title: string
    people: {
      id: number
      position: string
      fio: string
    }[]
  }[]
  docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
}

export interface CorrespondProps {
  id: number
  caption: string
  banks: {
    id: number
    bank: string
    swift: string
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    account: string
  }[]
}

export interface RequisitesProps {
  id: number
  title: string
  desc: string
  docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
}
export interface PressProps {
  id: number
  title: string
  desc: string
}
export interface ContactsProps {
  id: number
  title: string
  desc: string
  docs: [
    {
      id: number
      title: string
      ext: string
      file: string
    }
  ]
  lat: string
  lng: string
}

export interface VacanciesProps {
  id: number
  slug: string
  title: string
  cities: {
    id: number
    name: string
  }[]
  departments: { id: number; name: string }[]
  image?: string
  icon: {
    value: string,
    label: string,
    url: string
  },
}

export interface TotalData {
  count: number
  next: string
  page_count: number
  previous: string
  og_description: string
  og_image: string
  og_title: string
  seo_description: string
  seo_keywords: string
  seo_title: string
  results?: {
    id: number
    slug: string
    title: string
    cities: { id: number, name: string }[]
    departments: { id: number; name: string }[]
    image?: string
    experience: {
      code: string,
      label: string
    }
    icon: {
      value: string,
      label: string,
      url: string
    },
  }[]
  map(arg0: (job: any) => JSX.Element): unknown
  id: number
  slug?: string
  title: string
  lat: string
  lng: string
  cities?: {
    id: number
    name: string
  }[]
  docs?: [
    {
      id: number
      title: string
      ext: string
      file: string
    }
  ]
  caption?: string
  banks?: {
    id: number
    bank: string
    swift: string
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    account?: string
  }[]
  desc?: string
  desc1?: string
  desc2?: string
  groups?:
    | {
        id?: number | any
        title?: string | any
        people?: {
          id?: number | any
          position?: string | any
          fio?: string | any
        }[]
      }[]
    | any
}

export interface BranchesInfo {
  id: number
  slug: string
  name: string
  address: string
  lng: string
  lat: string
  phones: {
    id: number
    phone: string
  }[]
  status: string
  icon: string
  is_open: true
}

export interface VacanciesBasic {
  id: number
  title: string
}

export interface VacanciesInfo {
  id: number
  text: string
  order: number
}

export interface VacanciesDeteilProps {
  reqs: string
  id: number
  slug: string
  title: string
  desc: string
  image?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  branches: BranchesInfo[]
  experience: {
    code: string,
    label: string
  },
  department: {
    id: number,
    name: string,
    slug: string
  },
  icon: {
    value: string,
    label: string,
    url: string
  },
  values: VacanciesBasic[]
  offers: VacanciesBasic[]
  responsibilities: VacanciesInfo[]
  requirements: VacanciesInfo[]
  conditions: VacanciesInfo[]
}
