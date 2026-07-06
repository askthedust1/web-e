export interface Banking {
  banner_title_hex: string
  banner_subtitle_hex: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: null
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  sections: BlocksSecton[]
  google_play_link: string
  app_store_link: string
  banner_bg_mob: string
  banner_bg: string
}

export interface BlocksSecton {
  desc: string | undefined
  id: number
  title: string
  blocks: {
    id: 1
    title: string
    desc: string
    caption: string
    docs: []
    images: []
    infos: {
      id: number
      title: string
      icon: string
    }[]
  }[]
}

export interface BankingApplicataion {
  banner_title_hex: string
  banner_subtitle_hex: string

  seo_title: string
  banner_bg_mob: string
  banner_bg: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: null
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  about: string
  support_phone: string
  support_email: string
  application_caption: string
  personal_data_processing: {
    id: number
    title: string
    desc: string
    slug: string
    file: string
  }
  opportunities: [
    {
      id: number
      title: string
      desc: string
      icon: string
    }
  ]
  faqs: [
    {
      id: number
      question: string
      answer: string
    }
  ]
}
