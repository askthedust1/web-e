export type InvestorSectionKind = 'default' | 'contacts'

export interface InvestorDocument {
  id: number
  title: string
  file: string
  year: number | null
}

export interface InvestorContact {
  id: number
  full_name: string
  position?: string
  email?: string
  phone?: string
  whatsapp_number?: string
  photo?: string | null
}

export interface InvestorSectionCard {
  id: number
  title: string
  slug: string
  icon: string | null
  kind: InvestorSectionKind
  is_active: boolean
}

export interface InvestorSectionDetail {
  id: number
  title: string
  slug: string
  kind: InvestorSectionKind
  description: string | null
  icon: string | null
  documents: InvestorDocument[]
  contacts: InvestorContact[]
  is_active: boolean
}

export interface InvestorPage {
  id: number
  main_title: string
  main_desc: string | null
  banner_title: string
  banner_subtitle: string
  banner_image: string | null
  banner_bg: string | null
  sections: InvestorSectionCard[]
  is_active: boolean
}
