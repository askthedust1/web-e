export interface LayoutDataProps {
  site_settings: SiteSettingProps;
  header: HeadersProps;
  footer_sections: FooterProps[];
}

export interface HeadersProps {
  id: number;
  right_button_text: string;
  right_button_path: string;
  bottom_links: {
    id: number;
    title: string;
    page_path: string;
    position: string;
    banner: string;
    banner_title: string;
    banner_subtitle: string;
    banner_button: string;
    banner_link: string;
    blocks: {
      id: number;
      title: string;
      page_path: string;
      links: {
        id: number;
        title: string;
        page_path: string;
      }[];
    }[];
  }[];
  top_left_links: {
    id: number;
    title: string;
    page_path: string;
    position: string;
  }[];
  top_right_links: {
    id: number;
    title: string;
    page_path: string;
    position: string;
  }[];
}
export interface BlockLinks {
  id: 1;
  title: string;
  page_path: string;
  position: string;
  banner: string;
  banner_link: string;
  banner_title: string;
  banner_subtitle: string;
  banner_button: string;
  blocks: {
    id: number;
    title: string;
    page_path: string;

    links: {
      id: number;
      title: string;
      page_path: string;
    }[];
  }[];
}
export interface FooterProps {
  id: number;
  title: string;
  is_active: boolean;
  footer_links: {
    id: number;
    title: string;
    page_path: string;
  }[];
}
export interface SiteSettingProps {
  id: number;
  logo: string;
  logo_mobile: string;
  address: string;
  show_translation: boolean;
  contact_center_phone: string;
  trust_phone: string;
  whatsapp_number: string;
  fax: string;
  email: string;
  fb_link: string;
  ok_link: string;
  vk_link: string;
  instagram_link: string;
  telegram_link: string;
  twitter_link: string;
  youtube_link: string;
  google_play_link: string;
  app_store_link: string;
  qr: string;
  license: string;
  map_link: string;
  complaint_book_manual: string;
}
