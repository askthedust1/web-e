export interface DiscountPage {
  banner_title_hex: string
  banner_subtitle_hex: string
  banner_bg: string
  banner_bg_mob: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  main_title: string
  about: string
  cards: {
    id: number
    name: string
    discounts: {
      id: number
      name: string
      discount: string
      address: string
    }[]
  }[]
}

export interface Securities {
  banner_title_hex: string
  banner_subtitle_hex: string
  seo_title: string
  banner_bg_mob: string
  banner_bg: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  blocks: {
    id: number
    title: string
    desc: string
    caption: string
    docs: {
      id: number
      title: string
      ext: string
      file: string
    }[]
    shorts: {
      icon: string
      id: number
      title: string
    }[]
  }[]
  captions: {
    color: string
    desc: string
    id: number
  }[]
  gkb_sells: {
    id: number
    condition: string
    tariff: string
  }[]
  nbkr_sells: {
    id: number
    condition: string
    tariff: string
  }[]
  id: number
  main_title: string
  about: string
  cards: {
    id: number
    name: string
    discounts: {
      id: number
      name: string
      discount: string
      address: string
    }[]
  }[]
}

export interface Shipping {
  seo_title: string
  banner_title_hex: string
  banner_subtitle_hex: string
  banner_bg: string
  banner_bg_mob: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  guarantee_title: string
  id: number
  about: string
  infos: {
    id: number
    title: string
    icon: string
  }[]
}

export interface GoldBars {
  seo_title: string
  banner_bg_mob: string
  banner_bg: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_title_hex: string
  banner_subtitle_hex: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  about: string
  title1: string
  title2: string
  infos: {
    id: number
    desc: string
    icon: string
    title: string
  }[]
  blocks: {
    id: number
    title: string
    desc: string
  }[]
  tech_specs: {
    id: number
    weight: string
    width: string
    length: string
    metal: string
    sample: string
  }[]
}

export interface OverdraftInfo {
  page: {
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
  }
  branches: {
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
    is_open: false
  }[]
}

export interface OwerDraft {
  page: {
    seo_title: string
    seo_description: string
    seo_keywords: string
    og_title: string
    og_image: string
    og_description: string
    banner_title: string
    banner_subtitle: string
    banner_button_text: string
    banner_button_link: string
    banner_image: string
    banner_image_mob: string
    about: string
    support_phone: string
    support_email: string
    application_caption: string
    personal_data_processing: {
      id: number
      title: string
      desc: string
      slug: string
    }
  }
  branch: {
    id: number
    slug: string
    name: string
    address: string
  }[]
  types: {
    id: number
    name: string
  }[]
}

export interface PostTerminalPage {
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
  main_title: string
  main_desc: string
  support_email: string
  application_caption: string
  banner_title_hex: string
  banner_subtitle_hex: string
  personal_data_processing: {
    id: number
    title: string
    desc: string
    slug: string
  }
}

export interface RkoProps {
  banner_title_hex: string
  banner_subtitle_hex: string
  seo_title: string
  banner_bg: string
  banner_bg_mob: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  blocks: {
    id: number
    title: string
    desc: string
    caption: string
    docs: {
      id: number
      title: string
      ext: string
      file: string
    }[]
    shorts: {
      icon: string
      id: number
      title: string
    }[]
  }[]
  support_phone: string
  support_email: string
  application_caption: string
  personal_data_processing: {
    id: number
    title: string
    desc: string
    slug: string
  }
}

export interface RkoInfoProps {
  page: {
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
    blocks: {
      id: number
      title: string
      desc: string
      caption: string
      docs: {
        id: number
        title: string
        ext: string
        file: string
      }[]
    }[]
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
  }
  currency?: {
    id: number
    name: string
    code: string
    icon: string
  }[]
  currencies: {
    id: number
    name: string
    code: string
    icon: string
  }[]
}

export interface OverdraftPage {
  banner_title_hex: string
  banner_subtitle_hex: string
  seo_title: string
  banner_bg_mob: string
  banner_bg: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  about: string
  caption: string
  inner_banner: string
  inner_banner_link: string
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
  steps: {
    id: number
    desc: string
  }[]
  properties: {
    id: number
    title: string
    desc: string
  }[]
  sections: {
    id: number
    title: string
    desc: string
  }[]
}

export interface SafeBoxed {
  banner_title_hex: string
  banner_subtitle_hex: string
  seo_title: string
  banner_bg: string
  banner_bg_mob: string
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
  sizes_lists: {
    id: number
    title: string
    sizes: {
      id: number
      safebox: string
      length: string
      width: string
      depth: string
    }[]
  }[]
  prices_lists: {
    id: number
    title: string
    prices: {
      id: 1
      measure: string
      price: string
      percent: string
    }[]
  }[]
}

export interface SalaryProjectPage {
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
  title: string
  about: string
  sections: {
    id: number
    title: string
    desc: string
    caption: string
    icons: {
      id: number
      title: string
      icon: string
    }[]
  }[]
}

export interface RscBasicPageProps {
  banner_title_hex: string
  banner_subtitle_hex: string
  sections: {
    id: number
    name: string
    title: string
    desc: string
    caption: string
    shorts: {
      id: number
      key: string
      value: string
    }[]
    docs: {
      id: number
      title: string
      ext: string
      file: string
    }[]

    faqs: {
      id: number
      question: string
      answer: string
    }[]
  }[]
  seo_title: string
  seo_description: string
  banner_bg_mob: string
  banner_bg: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  slug: string
  main_title: string
  main_desc: string
  caption: string
  shorts: { key: string; value: string; id: number }[]
  docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
  faqs: {
    id: number
    question: string
    answer: string
  }[]
}

export interface OnlineServicesList {
  id: number
  image: string
  title: string
  desc: string
  short_desc: string
  link: string
}

export interface ListPage {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  id: number
  others: OnlineServicesList[]
  online_services: OnlineServicesList[]
}

export interface JobList {
  id: number
  slug: string
  title: string
  image?: string
  cities: {
    id: number
    name: string
  }[]
}

export interface VideoItem {
  id: number;
  title: string;
  url: string;
  description?: string;
}

export interface IVacancies {
  id: number;
  title: string;
  sub_title: string;
  image: string;
  company_values_title: string;
  company_benefits_title: string;
  success_story_title: string;
  faq_title: string;
  company_values: {
    id: number;
    icon: string;
    card_title: string;
    description: string;
  }[];
  company_benefits: {
    id: number;
    image: string;
    title: string;
  }[];
  success_stories: {
    id: number;
    image: string;
    title: string;
    description: string;
    slug: string
  }[];
  faqs: {
    id: number;
    question: string;
    answer: string;
  }[];
  videos: VideoItem[];
}

export interface SuccessStory {
  id: number;
  image: string;
  title: string;
  description: string;
  slug: string;
}

export interface SuccessStoriesResponse {
  count: number;
  page_count: number;
  next: string | null;
  previous: string | null;
  results: SuccessStory[];
}

export interface CorporateLifeData {
  id: number;
  title: string;
  intro_text: string;
  articles: ArticleCorporateLife[];
  photos: PhotoCorporateLife[];
  videos: VideoCorporateLife[];
}

export interface ArticleCorporateLife {
  id: number;
  title: string;
  content: string;
  image: string;
  caption: string;
  order: number;
}

export interface PhotoCorporateLife {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface VideoCorporateLife {
  id: number;
  title: string;
  url: string;
  description: string;
  order: number;
}