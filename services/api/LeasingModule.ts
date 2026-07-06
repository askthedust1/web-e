export interface LeasingItem {
  id: number;
  slug: string;
  image: string
  image_mob: string;
  name: string;
  short_desc?: string;
}

export interface LeasingList {
  count: number;
  next: number;
  page_count: number;
  previous: number;
  results: LeasingItem[];
}

export interface LeasingDetail {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_title?: string;
  og_image?: string;
  og_description?: string;
  banner_title?: string;
  banner_title_hex?: string;
  banner_subtitle?: string;
  banner_subtitle_hex?: string;
  banner_button_text?: string;
  banner_button_link?: string;
  banner_image?: string;
  banner_image_mob?: string;
  banner_bg?: string;
  banner_bg_mob?: string;
  readonly id: number;
  slug: string;
  name: string;
  short_desc?: string;
  main_title?: string;
  main_desc?: string;
  second_title?: string;
  second_desc?: string;
  sections_title?: string;
}