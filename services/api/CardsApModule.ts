export interface Cards {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  title: string
  support_phone: string
  support_email: string
  application_caption: string
  personal_data_processing: {
    title: string
    desc: string
    slug: string
  }
  faqs: []
  docs: []
}

export interface BankCards {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
  id: number
  title: string
  support_phone: string
  support_email: string
  application_caption: string
  personal_data_processing: {
    id: number
    title: string
    desc: string
    slug: string
  }
  faqs: {
    id: number
    question: string
    answer: string
  }[]
  docs: {
    id: number
    title: string
    file: string
  }[]
  categories: {
    id: number
    name: string
    is_available: boolean
    image: string
  }[]
  payment_systems: {
    id: number
    name: string
    image: string
    is_available: boolean
    is_open?: boolean
    is_active: boolean
  }[]
  results: ResultsProps[]
}

// export interface AllCards {
//   count: number;
//   next: number;
//   previous: number;
//   page_count: number;
//   results: {
//     id: 1;
//     slug: string;
//     name: string;
//     short_desc: string;
//     image: string;
//     image_mob: string;
//     is_creatable: boolean;
//     category: number;
//     payment_system: {
//       id: number;
//       name: string;
//       image: string;
//     };
//   }[];
// }

export interface AllCards {
  count: number
  next: number
  previous: number
  page_count: number
  results: ResultsProps[]
}
export interface ResultsProps {
  id: number
  slug: string
  name: string
  short_desc: string
  image: string
  image_mob: string
  is_creatable: boolean
  is_available: boolean
  is_closed?: boolean
  category: {
    id: number
    name: string
  }
  payment_system: {
    id: number
    name: string
    image: string
  }
  annual_service: string
  issuance: string
  currencies: {
    id: number
    name: string
    code: string
    icon: string
  }[]
  card_expiration_date: string
}

export interface BankCardsTypeOne {
  banner_title_hex: string
  banner_subtitle_hex: string
  desc: string
  issuance: string
  annual_service: string
  banner_title: string
  banner_subtitle: string
  banner_button_text: string
  banner_button_link: string
  banner_image: string
  banner_image_mob: string
  id: number
  slug: string
  name: string
  short_desc: string
  image: string
  image_mob: string
  is_creatable: boolean
  is_available: boolean
  banner_bg: string
  banner_bg_mob:string
  image_detail: string
  category: []
  payment_system: {
    id: number
    name: string
    image: string
  }
  services: []
  card_infos: {
    id: number
    title: string
    desc: string
  }[]
  owner_infos: {
    id: number
    title: string
    desc: string
  }[]
  captions: {
    id: number
    title: string
    color: string
    desc: string
  }[]
  advantages: {
    id: number
    title: string
    icon: string
  }[]
  privileges: {
    id: number
    title: string
    desc: string
    icon: string
    image: string
    link: string
  }[]
  fills: {
    id: number
    month_from: number
    month_till: number
    percs: {
      id: number
      currency: {
        id: number
        name: string
        code: string
        icon: string
      }
      perc: string
    }[]
  }[]
  docs: {
    id: number
    title: string
    ext: string
    file: string
  }[]
  currencies: {
    id: number
    name: string
    code: string
    icon: string
  }[]
  other_cards: {
    id: number
    slug: string
    name: string
    short_desc: string
    image: string
    image_mob: string
    is_creatable: boolean
    category: {
      id: number
      name: string
    }
    payment_system: {
      id: number
      name: string
      image: string
    }
  }[]
  tariff_term_file: string
  card_expiration_date: string
}
export interface CardsList {
  id: number
  slug: string
  name: string
  image: string
  image_mob: string
  currencies: {
    id: number
    name: string
    code: string
    icon: string
  }[]
  services: {
    name: string
    id: number
  }[]
}

export interface OrderCardInfoProps {
  delivery_branches: Root2[]
  delivery_methods: DeliveryMethods[]
  cards: CardsList[]
  page: {
    seo_title: string
    seo_description: string
    seo_keywords: string
    og_title: string
    og_image: string
    og_description: string
    id: number
    title: string
    support_phone: string
    support_email: string
    application_caption: string
    personal_data_processing: {
      id: number
      title: string
      desc: string
      slug: string
    }
    faqs: {
      id: number
      questnujmbeon: string
      answer: string
    }[]
    docs: []
    categories: {
      id: number
      name: string
    }[]
    payment_systems: {
      id: number
      name: string
      image: string
    }[]
  }
  delivery_cities: DeliveryCard[]
  countries: []
  regions: RegionDelivery[]
}

export interface DeliveryBranch {
  id: number;
  slug: string;
  name: string;
  address: string;
}

export interface DeliveryCity {
  id: number;
  name: string;
  branches: DeliveryBranch[];
}

export interface DeliveryCard {
  id: number;
  city: DeliveryCity;
  caption: string;
}

export interface CityDelivery {
  id: number;
  name: string;
}

export interface RegionDelivery {
  id: number;
  name: string;
  cities: CityDelivery[];
}

export interface DeliverCardProps {
  id: number
  city: {
    id: number
    name: string
    branches: {
      id: number
      slug: string
      name: string
      address: string
    }[]
  }
  caption: string
}
export interface DeliveryMethods {
  id: number
  name: string
  caption?: string
  delivery_type: string
  is_active: boolean
}
export interface Root2 {
  id: number
  branch: Branch
  region_id: number
}

export interface Branch {
  id: number
  slug: string
  name: string
  address: string
}
