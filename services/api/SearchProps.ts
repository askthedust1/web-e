export interface SearchResultProps {
  credits: {
    id: number
    slug: string
    image: string
    image_mob: string
    name: string
    short_desc: string
    shorts: {
      id: number
      key: string
      value: string
    }[]
    is_creatable: boolean
    is_available: boolean
  }[]
  deposits: {
    id: number
    slug: string
    is_available: boolean
    is_creatable: boolean
    name: string
    short_desc: string
    image: string
    image_mob: string
    shorts: [
      {
        id: number
        key: string
        value: string
      }
    ]
  }[]
  cards: {
    id: number
    slug: string
    name: string
    short_desc: string
    image: string
    image_mob: string
    is_creatable: boolean
    is_available: boolean
    category: {
      id: number
      name: string
    }
    payment_system: {
      id: number
      name: string
      image: string
      is_available: boolean
    }
  }[]
  news: {
    id: number
    slug: string
    title: string
    short_desc: string
    image: string
    published_at: string
  }[]
  branches: {
    id: number
    slug: string
    name: string
    address: string
    region: {
      id: number
      name: string
    }
    city: boolean
    lng: string
    lat: string
    phones: {
      id: number
      phone: string
    }[]
    status: string
    day_n_night: boolean
    has_ground_mode: boolean
    ground_mode_till: string
    captions: { id: number; caption: string }[]
    icon: string
    is_open: boolean
  }[]
  bankomats: {
    id: number
    slug: string
    name: string
    address: string
    region: {
      id: number
      name: string
    }
    city: boolean
    lng: string
    lat: string
    phones: {
      id: number
      phone: string
    }[]
    status: string
    day_n_night: boolean
    has_ground_mode: boolean
    ground_mode_till: string
    captions: { id: number; caption: string }[]
    icon: string
    is_open: boolean
  }[]

  pages: {
    id: number
    title: string
    body: string
    url: string
  }[]
}
