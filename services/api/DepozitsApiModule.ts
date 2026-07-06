export interface Depozits {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: null
  og_description: string
  id: number
  main_title: string
  support_phone: string
  support_email: string
  faqs: {
    id: number
    question: string
    answer: string
  }[]
  deposits: {
    id: number
    slug: string
    is_available: boolean
    name: string
    short_desc: string
    image: string
    image_mob: string
    shorts: {
      id: number
      key: string
      value: string
    }[]
  }[]
}

export interface DepozitsTypeOne {
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  slug: string
  is_available: boolean
  name: string
  short_desc: string
  image: string
  image_mob: string
  main_title: string
  main_desc: string
  sections_title: string
  defense_title: string
  defense_desc: string
  shorts: {
    id: number
    key: string
    value: string
  }[]
  steps: {
    id: number
    desc: string
  }[]
  opportunities: {
    id: number
    title: string
    desc: string
    icon: string
  }[]
  sections: {
    id: number
    title: string
    slug: string
  }[]
  calc_currencies: {
    id: number
    currency: {
      id: number
      name: string
      code: string
    }
    min_sum: number
    max_sum: number
  }[]
  calc_percents: {
    id: number
    period: {
      id: number
      month_from: number
      month_till: number
    }
    perc: string
  }[]
}

export interface DepozitsDeteil {
  show_calculator: boolean

  og_description: string
  banner_bg: string
  banner_bg_mob: string
  og_image: string
  og_title: string
  seo_description: string
  banner_title_hex: string
  banner_subtitle_hex: string
  seo_keywords: string
  seo_title: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  slug: string
  is_available: boolean
  name: string
  short_desc: string
  image: string
  image_mob: string
  main_title: string
  main_desc: string
  sections_title: string
  defense_title: string
  defense_desc: string
  shorts: {
    id: number
    key: string
    value: string
  }[]
  steps: {
    id: number
    desc: string
  }[]
  opportunities: {
    id: number
    title: string
    desc: string
    icon: string
  }[]
  sections: {
    id: number
    slug: string
    title: string
    main_desc: string
    green_caption: string
    grey_caption: string
    extra_desc: string
    caption: string
    shorts: any[]
    fills: {
      id: number
      period: string
      year_perc: string
      effective_perc: string
    }[]
    docs: {
      id: number
      title: string
      ext: string
      file: string
    }[]
  }[]
  calc_currencies: {
    calc_percents: {
      id: number
      period: {
        end: number
        id: number
        measure: string
        start: number
      }
      perc: string
      step: number
    }[]
    id: number
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    min_sum: number
    max_sum: number
  }[]
}
