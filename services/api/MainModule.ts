export interface MainPage {
  page: {
    seo_title: string
    seo_description: string
    seo_keywords: string
    og_title: string
    og_image: string
    og_description: string
    id: number
    suggest_title: string
    services_title: string
    clients_title: string
    news_title: string
    app_banner: {
      title: string
      app_store_link: string
      background: string
      google_play_link: string
      id: number
      image: string
      infos: {
        title: string
        id: number
        icon: string
      }[]
    }
    google_play_link: string
    app_store_link: string
    card_banner: {
      background: string
      button_link: string
      button_text: string
      id: number
      image: string
      infos: {
        icon: string
        id: number
        title: string
      }[]
      title: string
    }
    card_banner_mob: string
    card_link: string
    banners: {
      banner_button_link: string
    banner_button_text?: string
    banner_image?: string
    banner_image_mob?: string
    banner_subtitle: string
    banner_subtitle_hex: string
    banner_title_hex: string
    banner_title?: string
    tag?: string
    title?: string
    id?: number
    }[]
    actual_suggests: {
      id: number
      image: string
      title: string
      tag: string
      desc: string
      link: string
    }[]
    online_services: [
      {
        id: number
        image: string
        title: string
        desc: string
        link: string
      }
    ]
    for_clients: {
      id: number
      icon: string
      title: string
      link: string
    }[]
  }
  exchange: {
    id: number
    created_at: string
    caption: string
    bottom_caption: string
    cash_exchanges: {
      id: number
      currency: {
        id: number
        name: string
        code: string
        icon: string
      }
      buy: string
      sell: string
      commission: string
      nbkr: string
    }[]
    cashless_exchanges: {
      id: number
      currency: {
        id: number
        name: string
        code: string
        icon: string
      }
      buy: string
      sell: string
      commission: string
      nbkr: string
    }[]
    gold_exchanges: {
      id: number
      weight: string
      buy: string
      sell: string
    }[]
  }
  news: {
    id: number
    image: string
    title: string
    published_at: string
    desc: string
    link: string
    slug: string
  }[]
}

export interface ExchangeProps {
  id: number
  created_at: string
  caption: string
  bottom_caption: string
  cash_exchanges: {
    id: number
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    buy: string
    sell: string
    commission: string
    nbkr: string
  }[]
  cashless_exchanges: {
    id: number
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    buy: string
    sell: string
    commission: string
    nbkr: string
  }[]
  gold_exchanges: {
    id: number
    weight: string
    buy: string
    sell: string
  }[]
}

export interface SEOProps {
  seo_title: string
  seo_description: string
  seo_keywords: string
  og_title: string
  og_image: string
  og_description: string
}
