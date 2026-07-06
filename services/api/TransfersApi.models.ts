export interface Transfers {
  id: number
  advantages: dataAdventuresItem[]
  banner_button_link: string
  banner_button_text: string
  banner_image: string
  banner_image_mob: string
  banner_subtitle: string
  banner_title: string

  main_body: string
  main_body2: string
  main_body3: string
  main_body_caption: string
  main_title: string
  main_title2: string
  main_title3: string
  og_description: string
  og_image: string
  og_title: string
  red_caption: string
  seo_description: string
  seo_keywords: string
  seo_title: string
  transfer_systems: dataTransferSystemsItem[]
}

interface dataAdventuresItem {
  id: number
  title: string
  icon: string
}

interface dataTransferSystemsItem {
  id: number
  name: string
  slug: string
}

export interface TransferTypeOne {
  banner_title_hex: string
  banner_subtitle_hex: string
  image: string
  banner_bg_mob: string
  banner_bg: string
  iframe: string
  banner_button_link: string
  banner_button_text: string
  banner_image: string
  banner_image_mob: string
  banner_subtitle: string
  banner_title: string
  id: number
  name: string
  slug: string
  main_title: string
  main_body: string
  main_body_caption: string
  logo: string
  action_text: string
  action_url: string
  main_title2: string
  main_body2: string
  red_caption: string
  grey_caption: string
  main_title3: string
  main_body3: string
  currencies: string
  contacts: string
  extra_title: string
  extra_body: string
  faqs: {
    id: number
    question: string
    answer: string
  }[]
  documents: []
  advantages: {
    id: number
    title: string
    icon: string
  }[]
  tariffs: {
    id: number
    title: string
    file: string
  }[]
  transfer_systems: {
    id: number
    name: string
    slug: string
  }[]
}

export interface TransfersSystemProps {
  count: number
  next: string
  previous: string
  page_count: number
  results: [
    {
      id: number
      name: string
      slug: string
      image: string
      iframe: string
      short_desc: string
      shorts: { key: string; value: string; id: number }[]
    }
  ]
}
