export interface NewsList {
  count: number
  next: number
  previous: number
  page_count: number
  results: NewsResult[]
}
export interface NewsResult {
  id: number
  slug: string
  title: string
  short_desc: string
  image: string
  published_at: string
}
export type NewsResultType = {
  id: number
  slug: string
  title: string
  short_desc: string
  image: string
  created_at: string
}
export interface NewsListDetail {
  extra_images: {
    id: number
    image: string
  }[]

  og_description: string
  og_image: string
  og_title: string
  seo_description: string
  seo_keywords: string
  seo_title: string
  id: number
  slug: string
  title: string
  short_desc: string
  desc: string
  image: string
  published_at: string
  other_news: {
    id: number
    slug: string
    title: string
    short_desc: string
    image: string
    published_at: string
  }[]
}
