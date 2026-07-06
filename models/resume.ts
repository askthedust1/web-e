export interface ResumeFormData {
  fio: string
  age: number | string
  city: string
  phone: string
  email: string
  objective: string
  skills: string
  personal_info: string
  fk: number | string // направление / отдел
  branches: number[] // желаемый филиал
  work_experiences: {
    organization: string
    position: string
    date_from: Date | null | string
    date_to: Date | null | string
    is_current: boolean
    duties: string
  }[]
  educations: {
    institution: string
    speciality: string
    date_from: Date | null | string
    date_to: Date | null | string
    is_current: boolean
  }[]
}
