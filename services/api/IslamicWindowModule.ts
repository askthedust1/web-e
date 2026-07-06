export interface IslamicWindowPage {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  id: number
  main_title: string
  support_phone: string
  support_email: string
}

export interface IslamicProductShort {
  id: number
  key: string
  value: string
}

export interface IslamicProductSection {
  id: number
  title: string
  desc: string
}

export interface IslamicProductListItem {
  id: number
  slug: string
  image: string
  image_mob: string
  name: string
  short_desc: string
  shorts: IslamicProductShort[]
}

export interface IslamicProductList {
  count: number
  next: string | null
  previous: string | null
  page_count: number
  results: IslamicProductListItem[]
}

export interface IslamicProductDetail {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_title_hex: string
  banner_subtitle: string
  banner_subtitle_hex: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  banner_bg: string
  banner_bg_mob: string
  id: number
  slug: string
  name: string
  short_desc: string
  shorts: IslamicProductShort[]
  main_title: string
  main_desc: string
  second_title: string
  second_desc: string
  sections_title: string
  sections: IslamicProductSection[]
}

export interface IslamicWindowBranchItem {
  id: number
  name: string
  address: string
  specialist_fio: string
  specialist_phone: string
  branch_type: string
  lat: string
  lng: string
}

export interface IslamicWindowRegionGroup {
  region_id: number
  region_name: string
  branches: IslamicWindowBranchItem[]
}

export interface IslamicWindowBranchesResponse {
  regions: IslamicWindowRegionGroup[]
}
